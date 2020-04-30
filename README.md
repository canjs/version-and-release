# version-and-release
Tools for automating maintenance of CanJS packages

## Usage
```js
const getReleaseNotes = require('version-and-release');
const options = {
  token: "your github token",
  owner: "canjs",
  repo: "canjs",
};
const output = getReleaseNotes('v6.3.0', 'v6.4.0', options);
// >>> "# Major \n ## [can-connect v2.0.0](https://github.com/canjs/can-connect/releases/tag/v6.0.0) ..."
```

### Default template
The default template `src/release-template.js` formats output like this ([demo](test/release-template-demo.md)):
```
# Major

## [<packageName> <version> - <description>](url-to-release)
<body>
...

# Minor

## [<packageName> <version> - <description>](url-to-release)
<body>
...

# Patch

- [<packageName> <version> - <description>](url-to-release)

- [<packageName> <version> - <description>](url-to-release)
...
```

### All options:

Function `getReleaseNotes` takes 3 arguments:
1. Previous release version.
2. Current release version.
3. Options, an object with the following props:
- `token`, a string with auth token (for GitHub see https://github.com/blog/1509-personal-api-tokens);
- `owner`, a string with owner account name;
- `repo`, a string with repository name;
- `provider`, a string to choose what git provider to use (e.g. "github, "gitlab"); default "github";
- `template`, a function that should expect changes grouped by priority (see [default template](src/release-template.js));
- `maxTagsToLoad`, a number that limits how many tags to load per dependency package; default 30, for GitHub max is 100;
- `maxTagsToInclude`, a number that limits how many releases of every dependency package to include; default 10. 

## CLI usage
```
$ ./bin/generate-release-notes \
    --token=<token> \
    --repo=canjs \
    --owner=canjs \
    --template="../test/sample-template.js" \
    --provider=github \
    v6.3.0 v6.4.0
```
or using single char aliases:
```
$ ./bin/generate-release-notes \
    -T <token> \
    -r canjs \
    -o canjs \
    -t "../test/sample-template.js" \
    -p github \
    v6.3.0 v6.4.0
```
_Note: default value for both `repo` and `owner` is "canjs". Default (and the only implemented) git provider is "github"._

## Demo

1. Checkout this repo locally and add it to canjs project as a local dep:
```
$ cd canjs
$ npm add --save-dev "../version-and-release";
```

2. Run script for CanJS (default repo) releases `v6.3.0`  to `v6.4.0`:
```
$ node node_modules/version-and-release/src/generate-release-notes.js -T <token> \
v6.3.0 v6.4.0
```

Intermediary info with updated dependencies:
```js
{ 
  'can-connect': { currentVer: '4.0.2', prevVer: '4.0.1' },
  'can-event-queue': { currentVer: '1.1.8', prevVer: '1.1.7' },
  'can-observable-array': { currentVer: '1.0.7', prevVer: '1.0.6' },
  'can-queues': { currentVer: '1.3.2', prevVer: '1.3.1' },
  'can-view-live': { currentVer: '5.0.4', prevVer: '5.0.3' } 
}
```

3. Final output:
```
{ 
  major: [],
  minor: [],
  patch: 
   [ { packageName: 'can-observable-array',
       version: 'v1.0.7',
       type: 'patch',
       previousRelease: 'v1.0.6',
       currentRelease: 'v1.0.7',
       previousReleaseSha: '273bb9710742e7ef128cca712f6c43759e95d68c',
       currentReleaseSha: 'd541e32aaefb07e917b454fab343a535cda04d17',
       title: 'Update listening to event documentation',
       body: 'Fix listening to event documentation.\r\n\r\n#77 ' },
     { packageName: 'can-connect',
       version: 'v4.0.2',
       type: 'patch',
       previousRelease: 'v4.0.1',
       currentRelease: 'v4.0.2',
       previousReleaseSha: 'dfdd0efd9c4f75a3235b103a8f75a235580dfa43',
       currentReleaseSha: '1b63e95ec9794231d367f6f77774634d4f7e783b',
       title: 'Move packages as devDependencies ',
       body: 'move `can-observable-*` packages to development dependencies (`devDependencies`)\r\n\r\n#512' },
     { packageName: 'can-view-live',
       version: 'v5.0.4',
       type: 'patch',
       previousRelease: 'v5.0.3',
       currentRelease: 'v5.0.4',
       previousReleaseSha: '05ea9509cac646e8441a35f9c0a9f65f9df553b6',
       currentReleaseSha: 'b0735a2e2eda299e87a7478da1e3536e4ec97cf7',
       title: '',
       body: '' },
     { packageName: 'can-queues',
       version: 'v1.3.2',
       type: 'patch',
       previousRelease: 'v1.3.1',
       currentRelease: 'v1.3.2',
       previousReleaseSha: 'e27022c41ef3d5c62583736704134b2c81a83daa',
       currentReleaseSha: 'b2defc22da322e3f038f0f8b3d85e05a8312469e',
       title: '',
       body: '' },
     { packageName: 'can-event-queue',
       version: 'v1.1.8',
       type: 'patch',
       previousRelease: 'v1.1.7',
       currentRelease: 'v1.1.8',
       previousReleaseSha: '4ad393f51702cf64090a8741b7fc1ce9a42f2753',
       currentReleaseSha: '86c70820688691e2d4ed10cc040b331a9512db34',
       title: 'Fix a typo in the documentation',
       body: 'For documentation needs, fix the `isntance` wording to `instance`.' } ] 
}
```

### Example using template:
```
$ node node_modules/version-and-release/src/generate-release-notes.js \
    -T <token> \
    --template="../test/sample-template.js" \
    v6.3.0 v6.4.0
```

#### Output:

```
## can-event-queue v1.1.8 - Fix a typo in the documentation
For documentation needs, fix the `isntance` wording to `instance`.

## can-observable-array v1.0.7 - Update listening to event documentation
Fix listening to event documentation.

#77

## can-connect v4.0.2 - Move packages as devDependencies
move `can-observable-*` packages to development dependencies (`devDependencies`)

#512

## can-view-live v5.0.4

## can-queues (v1.3.2)[link]

```
## can-queues [v1.3.2](link)
