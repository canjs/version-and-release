const { aggregateReleaseNote } = require('../src/aggregate-release-notes');

describe('aggregate-release-notes', () => {
  test('#aggregateReleaseNote', () => {
    expect(aggregateReleaseNote(1, 2)).toBe(3);
  });
})
