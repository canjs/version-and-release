const {
  getUpdatedDependencies,
  filterTags,
  groupByType,
} = require('../src/aggregate-release-notes');
const mockPackageJson = require('./mocks/package-json.mock');
const mockAllReleaseNotes = require('./mocks/all-release-notes.mock');
const mockListTags = require('./mocks/list-tags.mock');

describe('aggregate-release-notes', () => {
  describe('#getUpdatedDependencies', () => {
    test('should return updated deps', () => {
      const packageJsonPrev = {
        dependencies: { 'can-connect': '1.0.0' }
      };
      const packageJsonCurrent = {
        dependencies: { 'can-connect': '1.1.0' }
      };
      const res = getUpdatedDependencies(packageJsonPrev, packageJsonCurrent);
      const expected = {
        'can-connect': {
          prevVer: '1.0.0',
          currentVer: '1.1.0'
        }
      };
      expect(res).toEqual(expected);
    });
    test('should return updated deps (long fixture)', () => {
      const res = getUpdatedDependencies(mockPackageJson.previousRelease, mockPackageJson.currentRelease);
      const expected = {
        'can-stache-bindings': {
          prevVer: '3.1.2',
          currentVer: '3.1.4'
        },
        'can-control': {
          prevVer: '3.0.10',
          currentVer: '3.0.11'
        }
      };
      expect(res).toEqual(expected);
    });
  });
  describe('#filterTags', () => {
    test('should return tags that match the diff', () => {
      const diff = {prevVer: '3.1.2', currentVer: '3.1.4'};
      expect(
        filterTags(mockListTags, diff).map(t => t.name)
      ).toEqual(
        ['v3.1.2', 'v3.1.3', 'v3.1.4']
      );
    });
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
    });
    test('groups a real list', () => {
      const groupedRes = groupByType(mockAllReleaseNotes);
      expect(groupedRes.major.length).toBe(0);
      expect(groupedRes.minor.length).toBe(45);
      expect(groupedRes.patch.length).toBe(22);
    });
  });
});
