/*
 * Receives object with groups of changes by priority:
 * {
 *   major: [ change1, change2, ... ],
 *   minor: [ change1, change2, ... ],
 *   patch: [ change1, change2, ... ]
 * }
 *
 * Where every change looks like:
 * {
 *   packageName,
 *   previousRelease,
 *   currentRelease,
 *   previousReleaseSha,
 *   currentReleaseSha,
 *   title,
 *   body
 * }
 */
module.exports = deps => {
  // E.g. take only patches and concat title and body for each change:
  return deps.patch.reduce((acc, change) => (
    acc + `## ${change.packageName} ${change.version}${change.title ? ' - ' + change.title : ''} \n${change.body}\n\n`
  ), '');
}
