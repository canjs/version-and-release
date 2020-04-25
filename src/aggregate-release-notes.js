const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const semver = require('semver');
const { initialize: initializeProvider } = require('./provider-github');

const DEBUG = true;
const debug = (...args) => DEBUG && console.log.apply(console, args);

async function aggregateReleaseNote(currentRelease, previousRelease, { token, owner, repo }) {
  const provider = initializeProvider(token);

  const fileContents = await getPackageJsonByRelease(previousRelease, currentRelease);
  const updatedDependencies = getUpdatedDependencies(fileContents.previousRelease, fileContents.currentRelease);
  const allReleaseNotes = await getAllReleaseNotes(updatedDependencies, { owner, provider, format: formatAsString });
  const aggregateReleaseNote = await createAggregateReleaseNote(allReleaseNotes, currentRelease, { owner, repo, provider });

  return aggregateReleaseNote
}

/*
 * Returns array of changes grouped by priority:
 * {
 *   major: [ change1, change2, ... ],
 *   minor: [ change1, change2, ... ],
 *   patch: [ change1, change2, ... ]
 * }
 *
 * Where every change looks like:
 * {
 *   package,
 *   previousRelease,
 *   currentRelease,
 *   previousReleaseSha,
 *   currentReleaseSha,
 *   title,
 *   body
 * }
 */
async function getDependenciesReleaseNotesData(currentRelease, previousRelease, { token, owner, repo }) {
  const provider = initializeProvider(token);

  const fileContents = await getPackageJsonByRelease(previousRelease, currentRelease);
  const updatedDependencies = getUpdatedDependencies(fileContents.previousRelease, fileContents.currentRelease);
  const allReleaseNotes = await getAllReleaseNotes(updatedDependencies, { owner, repo, provider });
  debug(`allReleaseNotes`, allReleaseNotes);
  return {};
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
 *
 * returns [{
 *    name: 'v3.1.3',
 *    zipball_url: 'https://api.github.com/repos/canjs/can-stache-bindings/zipball/v3.1.3',
 *    tarball_url: 'https://api.github.com/repos/canjs/can-stache-bindings/tarball/v3.1.3',
 *    commit: {
 *      sha: '9019cb2e9fbf82bcfd8c6b3dcc5f7d4ce9176b6f',
 *      url: 'https://api.github.com/repos/canjs/can-stache-bindings/commits/9019cb2e9fbf82bcfd8c6b3dcc5f7d4ce9176b6f'
 *    },
 *    node_id: 'MDM6UmVmNTYzNDU0OTI6djMuMi4wLXByZS40'
 * }, ...]
 */
async function matchTags(repo, diff, { provider, owner }) {
  let res;
  try {
    res = await provider.listTags(owner, repo, {page: 6});
  } catch(err) {
    console.error('Error in matchTags', err);
  }
  return filterTags(res.data, diff);
}

function filterTags(allTags, diff) {
  //the maximum number of match tags to return
  const upperBound = 10;

  let tags = allTags.filter(tag => (
    semver.satisfies(tag.name, `>${diff.prevVer} <=${diff.currentVer}`)
  ));

  // sort in ascending order by ref
  return tags
    .filter((t, i) => i <= upperBound)
    .sort((v1, v2) => semver.gt(v1.name, v2.name));
}

function formatAsString (packageName, version, title, body) {
  return `[${packageName} ${version}${title ? ' - ' + title : ''}](https://github.com/canjs/${packageName}/releases/tag/${version})${body ? '\n' + body : ''}`;
}

async function getAllReleaseNotes(updatedDependencies, { owner, repo, provider, format }) {
  console.log(`updatedDependencies:`, updatedDependencies);
  const matchingTags = [];
  let releaseNotes = {};
  for (let key in updatedDependencies) {
    try {
      matchingTags[key] = await matchTags(key, updatedDependencies[key], { owner, repo, provider });
    } catch(err) {
      console.error('Error in getAllReleaseNotes', err);
    }
  }

  await Promise.all(Object.keys(matchingTags).map(async function(packageName) {
    releaseNotes[packageName] = await Promise.all(matchingTags[packageName].map(async function(taggedRelease, index) {
      const version = taggedRelease.name;
      const currentReleaseSha = taggedRelease.commit.sha;
      const previousRelease = index > 0 && matchingTags[packageName][index - 1].name;
      const previousReleaseSha = index > 0 && matchingTags[packageName][index - 1].commit.sha;
      let title = '';
      let body = '';

      try {
        let release = await provider.getReleaseByTag(owner, packageName, version);

        if (release.data.name) {
          title = release.data.name;
          body = release.data.body;
        }

      } catch(err) {
        // console.error(`${package} ${version}: getReleaseByTag Error Code ${err.code}: ${err.message} `);
      }

      const type = semver.patch(version) !== 0 && 'patch'
        || semver.minor(version) && 'minor'
        || semver.major(version) && 'major';

      if (format) {
        return format(packageName, version, title, body)
      }

      return {
        packageName,
        version,
        type,
        previousRelease,
        currentRelease: version,
        previousReleaseSha,
        currentReleaseSha,
        title,
        body
      };
    }));
  }));

  return releaseNotes;
}

function createAggregateReleaseNote(allReleaseNotes, currentRelease, { owner, repo }) {
  let releaseNote = `# ${owner}/${repo} ${currentRelease || 'INSERT VERSION HERE'} Release Notes \n`;

  let alphabetizedPackages = Object.keys(allReleaseNotes).sort();

  alphabetizedPackages.forEach(function(packageName) {
    releaseNote = `${releaseNote} \n## [${packageName}](https://github.com/canjs/${packageName}/releases) \n`;

    allReleaseNotes[packageName].forEach(function(note) {
      if (note) {
        releaseNote = `${releaseNote} - ${note} \n`;
      }
    });
  });

  return releaseNote;
}

function postReleaseNote(note) {
  console.log(note);
}

module.exports = {
  getDependenciesReleaseNotesData,
  aggregateReleaseNote,
  getUpdatedDependencies,
  createAggregateReleaseNote,
  postReleaseNote,
  filterTags
};
