const { Octokit } = require('@octokit/rest');

function initialize(token, { baseUrl='https://api.github.com', userAgent='CanJS Release Notes Script v2'} = {}){
  const octokit = new Octokit({
    auth: token,
    userAgent,
    previews: [],
    baseUrl,
    log: {
      debug: () => {},
      info: () => {},
      warn: console.warn,
      error: console.error
    },
    request: {
      agent: undefined,
      fetch: undefined,
      timeout: 0
    }
  });
  return octokit;
}
function getReleaseByTag(octokit, OWNER, package, version){
  return octokit.repos.getReleaseByTag({
    "owner": OWNER,
    "repo": package,
    "tag": version
  });
}
function listTags(octokit, OWNER, repo){
  return octokit.repos.listTags({ 'owner': OWNER, 'repo': repo });
}

module.exports = {
  initialize,
  getReleaseByTag,
  listTags,
}
