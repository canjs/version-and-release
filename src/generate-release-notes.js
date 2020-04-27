/**
 * Node script that aggregates release notes for CanJS dependencies and groups them by type (major|minor|patch).
 * Then this group can be passed to a template for customization.
 *
 * You’ll need a personal access token to run this script: https://github.com/blog/1509-personal-api-tokens
 *
 * To execute:
 * ```
 * node generate-release-notes.js <access token> <older version> <newer version> \
 *   --template <template file> \
 *   --provider github
 * ```
 *
 * Example:
 * ```s
 * node generate-release-notes.js s1w5i2f2t v3.8.1 v3.9.0 --template release-template.js
 * // returns a string in markdown with the all can-* dependency release notes between CanJS v3.8.1 and CanJS v3.9.0
 *
 * node generate-release-notes.js s1w5i2f2t v3.8.1 v3.9.0 --template release-template.js --provider gitlab
 * // the default provider is github.
 * ```
 */
const parseArgs = require('minimist');
const { getDependenciesReleaseNotesData, postReleaseNote, loadTemplateFn } = require('./aggregate-release-notes');

// Get args from cli:
const args = parseArgs(process.argv.slice(2), {alias: {template: 't', owner: 'o', repo: 'r', token: 'T'}});
const {
  _: [previousRelease, currentRelease],
  token, owner = 'canjs', repo = 'canjs', template
} = args;

// Main options:
const options = { owner, repo, token, template };

async function run(){
  let dependenciesReleaseNotesData = await getDependenciesReleaseNotesData(currentRelease, previousRelease, options);

  const templateFn = options.template && await loadTemplateFn(options.template);

  if (templateFn) {
    dependenciesReleaseNotesData = templateFn(dependenciesReleaseNotesData);
  }

  postReleaseNote(dependenciesReleaseNotesData);
}

run();
