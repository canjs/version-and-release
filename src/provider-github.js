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
  return {
    getReleaseByTag (...args) {
      return getReleaseByTag.apply(null, [octokit, ...args]);
    },
    listTags (...args) {
      return listTags.apply(null, [octokit, ...args]);
    }
  }
}
function getReleaseByTag(octokit, owner, packageName, version){
  return octokit.repos.getReleaseByTag({
    owner,
    repo: packageName,
    tag: version
  });
}
function listTags(octokit, owner, repo, { per_page = 30, page = 1}){
  return octokit.repos.listTags({
    owner,
    repo,
    per_page,
    page
  });
}

module.exports = {
  initialize
};
