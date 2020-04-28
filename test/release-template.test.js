const template = require('../src/release-template');

describe('Release template', () => {
  test('should sort and format grouped changes', () => {
    const releaseChanges = {
      major: [{
        packageName: 'can-b',
        version: 'v1.0.0',
        htmlUrl: 'https://github.com/canjs/can-b/releases/tag/v1.0.0',
        title: 'Some changes',
        body: 'Details of the changes'
      },{
        packageName: 'can-a',
        version: 'v2.0.0',
        htmlUrl: 'https://github.com/canjs/can-a/releases/tag/v2.0.0',
        title: 'Some changes',
        body: 'Details of the changes'
      },{
        packageName: 'can-c',
        version: 'v3.0.0',
        htmlUrl: 'https://github.com/canjs/can-c/releases/tag/v3.0.0',
        title: 'Some changes',
        body: 'Details of the changes'
      }],
      minor: [{
        packageName: 'can-connect',
        version: 'v1.2.0',
        htmlUrl: 'https://github.com/canjs/can-connect/releases/tag/v1.2.0',
        title: 'Some changes',
        body: 'Details of the changes'
      }],
      patch: [{
        packageName: 'can-connect',
        version: 'v1.2.3',
        htmlUrl: 'https://github.com/canjs/can-connect/releases/tag/v1.2.3',
        title: 'Some changes',
        body: 'Details of the changes'
      }]
    };
    const result = template(releaseChanges);
    const expected = `# Major

## [can-a v2.0.0 - Some changes](https://github.com/canjs/can-a/releases/tag/v2.0.0)
Details of the changes

## [can-b v1.0.0 - Some changes](https://github.com/canjs/can-b/releases/tag/v1.0.0)
Details of the changes

## [can-c v3.0.0 - Some changes](https://github.com/canjs/can-c/releases/tag/v3.0.0)
Details of the changes

# Minor

## [can-connect v1.2.0 - Some changes](https://github.com/canjs/can-connect/releases/tag/v1.2.0)
Details of the changes

# Patch

- [can-connect v1.2.3 - Some changes](https://github.com/canjs/can-connect/releases/tag/v1.2.3)}`;

    expect(result).toEqual(expected);
  })
});
