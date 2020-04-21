/**
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

function generate(a, b) {
  return a + b;
}

module.exports = generate;
