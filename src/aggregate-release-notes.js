const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const semver = require('semver');
const { initialize: initializeProvider } = require('./provider-github')
const unit = x => x;

/*
 * Returns arrays of changes grouped by priority:
 * {
 *   major: [ change1, change2, ... ],
 *   minor: [ change1, change2, ... ],
 *   patch: [ change1, change2, ... ]
 * }
 *
 * Where every change looks like:
 * {
 *   packageName,
 *   previousRelease,
 *   currentRelease,
 *   previousReleaseSha,
 *   currentReleaseSha,
 *   title,
 *   body
 * }
 */
async function getDependenciesReleaseNotesData(currentRelease, previousRelease, { token, owner, repo, template = unit }) {
  const provider = initializeProvider(token);

  // Get package.json prev and current state:
  const packageJson = await getPackageJsonByRelease(previousRelease, currentRelease);

  // Collect deps updates from git:
  const updatedDependencies = getUpdatedDependencies(packageJson.previousRelease, packageJson.currentRelease);

  // Load release notes per tag:
  const allReleaseNotes = await getAllReleaseNotes(updatedDependencies, { owner, repo, provider });

  // Group by type major|minor|patch:
  const groupedReleaseNotes = groupByType(allReleaseNotes);

  return template(groupedReleaseNotes);
}

async function getPackageJsonByRelease(previousRelease, currentRelease) {
  const recentReleaseShas = [];
  let latestReleaseSha;
  let previousReleaseSha;

  // try to get the commit sha from the tags passed in
  // if not it defaults to the most recent release commits
  try {
    await execFile('git', ['fetch', '--tags']);
    const { stdout } = await execFile('git', ['log', '--pretty=oneline', previousRelease + '...' + currentRelease]);
    const logs = stdout.split('\n');

    latestReleaseSha = logs[1].slice(0,7);
    previousReleaseSha = logs[logs.length-2].slice(0,7);

  } catch(err) {
    console.error('The release tags you have passed do not have a match. Using the two most recent releases instead.');
    try {
      const { stdout } = await execFile('git', ['log', '--pretty=oneline', '-30']);
      const logs = stdout.split('\n');
      logs.forEach((log) => {
        if(log.slice(41) === 'Update dist for release') {
          recentReleaseShas.push(log.slice(0, 7));
        }
      });
      latestReleaseSha = recentReleaseShas[0];
      previousReleaseSha = recentReleaseShas[1];
    } catch (err) {
      console.error('Error retrieving or matching the most recent release commits.');
    }
  }

  let oldVerPackage, newVerPackage;
  try {
    oldVerPackage = await getFileContentFromCommit(previousReleaseSha, 'package.json');
    newVerPackage = await getFileContentFromCommit(latestReleaseSha, 'package.json');
  } catch(err) {
    console.error('Error: getFileFileContentFromCommit', err);
  }
  return { previousRelease: oldVerPackage, currentRelease: newVerPackage };
}

async function getFileContentFromCommit(sha, filename) {
  if (sha === 'latest') {
    const { stdout } = await execFile('cat', [filename]);
    return JSON.parse(stdout);
  } else {
    const revision = sha + ':' + filename;

    const { stdout } = await execFile('git', ['show', revision]);
    return JSON.parse(stdout);
  }
}

function getUpdatedDependencies(prevVer, currentVer) {
  let updatedDependencies = {};

  for (let key in currentVer.dependencies) {
    // Note: for a new dependency the prevVer will be undefined.
    if (!prevVer.dependencies[key] || (prevVer.dependencies[key] !== currentVer.dependencies[key])) {
      updatedDependencies[key] = {
        currentVer: currentVer.dependencies[key],
        prevVer: prevVer.dependencies[key]
      };
    }
  }

  return updatedDependencies;
}

/*
 * diff :: {currentVer: '3.1.4', prevVer: '3.1.2'}
 * Returns [{name: 'v3.1.3', zipball_url, commit, .., ...]
 */
async function matchTags(repo, diff, { provider, owner }) {
  let res;
  try {
    res = await provider.listTags(owner, repo, {page1: 6});
  } catch(err) {
    console.error('Error in matchTags', err);
  }
  return filterTags(res.data, diff);
}

function filterTags(allTags, diff) {
  //the maximum number of match tags to return
  const upperBound = 10;

  // We keep prevVer (>=) in the list to be able to get `previousRelease` and `previousReleaseSha` in the next step.
  let tags = allTags.filter(tag => (
    semver.satisfies(tag.name, `>=${diff.prevVer} <=${diff.currentVer}`)
  ));

  // sort in ascending order by ref
  return tags
    .filter((t, i) => i <= upperBound)
    .sort((v1, v2) => semver.gt(v1.name, v2.name));
}

async function getAllReleaseNotes(updatedDependencies, { owner, repo, provider }) {
  const matchingTags = {};
  let releaseNotes = {};
  for (let key in updatedDependencies) {
    try {
      matchingTags[key] = await matchTags(key, updatedDependencies[key], { owner, repo, provider });
    } catch(err) {
      console.error('Error in getAllReleaseNotes', err);
    }
  }

  // matchingTags :: {<packageName>: [{name: <version>, commit, zipball_url, ...}, ...]}
  await Promise.all(Object.keys(matchingTags).map(async function(packageName) {
    // At this step keep changes grouped by the package name:
    releaseNotes[packageName] = await Promise.all(matchingTags[packageName].map(async function(taggedRelease, index) {
      // The 1st item is the prevVer that should be excluded (it is just used for the next one to get its prev):
      if (index === 0) {
        return;
      }
      const version = taggedRelease.name;
      const currentReleaseSha = taggedRelease.commit.sha;
      const previousRelease = index > 0 && matchingTags[packageName][index - 1].name;
      const previousReleaseSha = index > 0 && matchingTags[packageName][index - 1].commit.sha;
      let title = '';
      let body = '';
      let htmlUrl = '';

      try {
        let release = await provider.getReleaseByTag(owner, packageName, version);

        if (release.data.name) {
          title = release.data.name;
          body = release.data.body;
          htmlUrl = release.data.html_url;
        }

      } catch(err) {
        // console.error(`${package} ${version}: getReleaseByTag Error Code ${err.code}: ${err.message} `);
      }

      const type = semver.patch(version) !== 0 && 'patch'
        || semver.minor(version) && 'minor'
        || semver.major(version) && 'major';

      return {
        packageName,
        version,
        type,
        previousRelease,
        currentRelease: version,
        previousReleaseSha,
        currentReleaseSha,
        htmlUrl,
        title,
        body
      };
    }));

    // Filter out unnecessary 1st item:
    releaseNotes[packageName].shift();
  }));

  return releaseNotes;
}

function postReleaseNote(note) {
  console.log(note);
}

// depsReleaseNotes :: {<packageName>: [ change1, change2, ...], ...}
// Returns :: {<type> : [change, ...], ...}
function groupByType(depsReleaseNotes) {
  const flattenedChanges = Object.values(depsReleaseNotes).reduce((acc, arr) => [...acc, ...arr], []);
  return flattenedChanges.reduce((acc, change) => {
    acc[change.type].push(change);
    return acc;
  }, {major: [], minor: [], patch: []})
}

module.exports = {
  getDependenciesReleaseNotesData,
  getUpdatedDependencies,
  postReleaseNote,
  filterTags,
  groupByType
};
