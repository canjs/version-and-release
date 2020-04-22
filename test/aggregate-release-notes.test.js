// const all = require('../src/aggregate-release-notes');
const {
  aggregateReleaseNote,
  getUpdatedDependencies,
  createAggregateReleaseNote
} = require('../src/aggregate-release-notes');
const mockPackageJson = require('./mocks/package-json.mock');
const mockUpdatedDeps = require('./mocks/updated-deps.mock');
const mockAllReleaseNotes = require('./mocks/all-release-notes.mock');
const mockAggregateReleaseNote = require('./mocks/aggregate-release-note.mock');

describe('aggregate-release-notes', () => {
  describe('#getUpdatedDependencies', () => {
    test('should return package json', () => {
      expect(getUpdatedDependencies(mockPackageJson.previousRelease, mockPackageJson.currentRelease)).toEqual(mockUpdatedDeps);
    })
  });
  describe('#createAggregateReleaseNote', () => {
    test('should return a string with aggregated notes', () => {
      const allReleaseNotes = mockAllReleaseNotes;
      const currentRelease = 'v3.8.1';
      const owner = 'canjs';
      const repo = 'canjs';
      expect(
        createAggregateReleaseNote(allReleaseNotes, currentRelease, { owner, repo }).replace(/[\r]/g, '')
      ).toEqual(
        mockAggregateReleaseNote
      );
    })
  });
});
