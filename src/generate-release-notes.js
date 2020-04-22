/**
 * Node script that aggregates release notes for CanJS dependencies in one markdown note.
 * This note can be used for CanJS release notes or for general reference.
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
 * ```
 * node generate-release-notes.js s1w5i2f2t v3.8.1 v3.9.0 --template release-template.js
 * // returns a string in markdown with the all can-* dependency release notes between CanJS v3.8.1 and CanJS v3.9.0
 *
 * node generate-release-notes.js s1w5i2f2t v3.8.1 v3.9.0 --template release-template.js --provider gitlab
 * // the default provider is github.
 * ```
 */

const { aggregateReleaseNote, postReleaseNote } = require('./aggregate-release-notes');

// Default to canjs/canjs repo
const OWNER = 'canjs';
const REPO = 'canjs';
const TOKEN = process.argv[2];
const currentRelease = process.argv[4];
const previousRelease = process.argv[3];

// console.log(`*** Starting... ${OWNER}, ${REPO}, ${currentRelease}, ${previousRelease}`);

async function run(){
  const aggregatedReleaseNote = await aggregateReleaseNote(currentRelease, previousRelease, { OWNER, REPO, TOKEN });
  postReleaseNote(aggregatedReleaseNote);
}

run();
