// const all = require('../src/aggregate-release-notes');
const {
  aggregateReleaseNote,
  getUpdatedDependencies,
  createAggregateReleaseNote,
  filterTags,
  groupByType,
} = require('../src/aggregate-release-notes');
const mockPackageJson = require('./mocks/package-json.mock');
const mockUpdatedDeps = require('./mocks/updated-deps.mock');
const mockAllReleaseNotes = require('./mocks/all-release-notes.mock');
const mockAllReleaseNotesLong = require('./mocks/all-release-notes-long.mock');
const mockAggregateReleaseNote = require('./mocks/aggregate-release-note.mock');
const mockListTags = require('./mocks/list-tags.mock');

describe('aggregate-release-notes', () => {
  describe('#getUpdatedDependencies', () => {
    test('should return updated deps', () => {
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
        createAggregateReleaseNote(allReleaseNotes, currentRelease, { owner, repo })
      ).toEqual(
        mockAggregateReleaseNote
      );
    })
  });
  describe('#filterTags', () => {
    test('should return tags that match the diff', () => {
      const diff = {currentVer: '3.1.4', prevVer: '3.1.2'};
      expect(
        filterTags(mockListTags, diff).map(t => t.name)
      ).toEqual(
        ['v3.1.2', 'v3.1.3', 'v3.1.4']
      );
    })
  });
  describe('#groupByType', () => {
    test('arranges deps changes into groups by type (major/minor/patch)', () => {
      const depsReleaseNotes = {
        'can-connect-feathers': [{
          packageName: 'can-connect-feathers',
          currentRelease: 'v3.6.0',
          type: 'minor'
        }, {
          packageName: 'can-connect-feathers',
          currentRelease: 'v3.6.1',
          type: 'patch'
        }],
        'can-connect': [{
          packageName: 'can-connect',
          currentRelease: 'v2.0.0',
          type: 'major'
        }]
      };
      const groupedRes = groupByType(depsReleaseNotes)
      expect(groupedRes.major[0]).toEqual(expect.objectContaining({
        packageName: 'can-connect',
        currentRelease: 'v2.0.0'
      }));
      expect(groupedRes.minor[0]).toEqual(expect.objectContaining({
        packageName: 'can-connect-feathers',
        currentRelease: 'v3.6.0'
      }));
      expect(groupedRes.patch[0]).toEqual(expect.objectContaining({
        packageName: 'can-connect-feathers',
        currentRelease: 'v3.6.1'
      }));
    })
  });
});
