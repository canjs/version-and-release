/*
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
 *    htmlUrl,
 *    title,
 *    body
 * }
 * ```
 */

const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

function formatChange ({packageName, version, htmlUrl, title, body}, priority) {
  return priority === 'patch'
    ? `- [${packageName} ${version}${title ? ' - ' + title : ''}](${htmlUrl})`
    : `## [${packageName} ${version}${title ? ' - ' + title : ''}](${htmlUrl})${body ? '\n' + body : ''}`;
}

function formatChanges(changes, priority) {
  const alphabetizedChanges = changes.sort((a, b) => a.packageName > b.packageName);
  const notes = alphabetizedChanges.map(change => formatChange(change, priority));
  return notes.join('\n\n');
}

module.exports = releaseNotes => {
  const formattedReleaseNotes = Object.entries(releaseNotes).map(([priority, changes]) => {
    const formattedNotes = formatChanges(changes, priority);
    return `# ${capitalize(priority)}\n\n${formattedNotes}`;
  });
  return formattedReleaseNotes.join('\n\n');

  // return Object.entries(releaseNotes).reduce((output, [priority, changes]) => {
  //   const formattedNotes = formatReleaseNotes(changes, priority);
  //   return `${output}\n# ${capitalize(priority)}\n\n ${formattedNotes}`;
  // }, '')
};
