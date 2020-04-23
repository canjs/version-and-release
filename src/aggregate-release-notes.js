const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const semver = require('semver');
const { initialize: initializeProvider } = require('./provider-github');

const DEBUG = false;
const debug = (...args) => DEBUG && console.log.apply(console, args);

async function aggregateReleaseNote(currentRelease, previousRelease, options) {
  const provider = initializeProvider(options.token);

  const fileContents = await getPackageJsonByRelease(previousRelease, currentRelease);
  const updatedDependencies = getUpdatedDependencies(fileContents.previousRelease, fileContents.currentRelease);
  const allReleaseNotes = await getAllReleaseNotes(updatedDependencies, { ...options, provider });
  const aggregateReleaseNote = await createAggregateReleaseNote(allReleaseNotes, currentRelease, options);

  return aggregateReleaseNote
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

async function matchTags(repo, diff, { provider, owner }) {
  try {
    //the maximum number of match tags to return
    const upperBound = 10;
    let tags = [];
    const res = await provider.listTags(owner, repo);

    for (let i = 0; i < res.data.length; i++) {
      let currentRef = res.data[i].name.replace(/^v/, '');

      if (diff.prevVer && currentRef === diff.prevVer || tags.length >= upperBound) {
        break;
      }

      tags.push(res.data[i]);
    }
    // sort in ascending order by ref
    return tags.sort((v1, v2) => semver.gt(v1.name, v2.name));
  } catch(err) {
    console.error('Error in matchTags', err);
  }
}

async function getAllReleaseNotes(updatedDependencies, options) {
  const { owner, provider } = options;
  const matchingTags = [];
  let releaseNotes = {};
  for (let key in updatedDependencies) {
    try {
      matchingTags[key] = await matchTags(key, updatedDependencies[key], options);

    } catch(err) {
      console.error('Error in getAllReleaseNotes', err);
    }
  }

  await Promise.all(Object.keys(matchingTags).map(async function(packageName, index) {
    releaseNotes[packageName] = await Promise.all(matchingTags[packageName].map(async function(taggedRelease) {
      let version = taggedRelease.name;
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

      return `[${packageName} ${version}${title ? ' - ' + title : ''}](https://github.com/canjs/${packageName}/releases/tag/${version})${body ? '\n' + body : ''}`;
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
  aggregateReleaseNote,
  getUpdatedDependencies,
  createAggregateReleaseNote,
  postReleaseNote
};
