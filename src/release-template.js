/**
 * Input:
 * ```
 * const dependenciesReleaseNotesData =
 * {
 *    major: [ change1, change2, ... ],
 *    minor: [ change1, change2, ... ],
 *    patch: [ change1, change2, ... ]
 * }
 * ```
 *
 * Each change:
 * ```
 * {
 *    package,
 *    previousRelease,
 *    currentRelease,
 *    previousReleaseSha,
 *    currentReleaseSha,
 *    title,
 *    body
 * }
 * ```
 */

function formatNote (packageName, version, title, body) {
  return `[${packageName} ${version}${title ? ' - ' + title : ''}](https://github.com/canjs/${packageName}/releases/tag/${version})${body ? '\n' + body : ''}`;
}

function formatReleaseNotes(allReleaseNotes) {
  let releaseNote = '';

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

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

module.exports = releaseNotes => {
  return Object.entries().reduce((output, [priority, changes]) => {
    // wip
    return `${output} # ${capitalize(priority)}\n\n`;
  }, '')
};
