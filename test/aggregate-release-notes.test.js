// const all = require('../src/aggregate-release-notes');
const { aggregateReleaseNote, getUpdatedDependencies } = require('../src/aggregate-release-notes');
const mockPackageJson = require('./mocks/package-json.mock');
const mockUpdatedDeps = require('./mocks/updated-deps.mock');

describe('aggregate-release-notes', () => {
  describe('#getUpdatedDependencies', () => {
    test('should return package json', () => {
      expect(getUpdatedDependencies(mockPackageJson.previousRelease, mockPackageJson.currentRelease)).toEqual(mockUpdatedDeps);
    })
  });
});
