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
 *    packageName,
 *    version,
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
    if (!changes.length) {
      return;
    }
    const formattedNotes = formatChanges(changes, priority);
    return `# ${capitalize(priority)}\n\n${formattedNotes}`;
  }).filter(note => !!note);
  return formattedReleaseNotes.join('\n\n');
};
