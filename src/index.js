const {makeReleaseHandler} = require('./release-handler');

const getDependenciesReleaseNotesData = require('./aggregate-release-notes').getDependenciesReleaseNotesData;
 
module.exports = {
  getDependenciesReleaseNotesData,
  makeReleaseHandler
};
