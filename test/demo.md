# Major

## [can-connect-feathers v6.0.0 - Upgrade to support Feathers 4](https://github.com/canjs/can-connect-feathers/releases/tag/v6.0.0)
This is an upgrade to can-connect-feathers to make it compatible with Feathers 4. Now can-connect-feathers can be used with CanJS 4, CanJS 5 and Feathers 4 apps.

A future version will upgrade for CanJS 6 compatibility.

## [can-connect-feathers v7.0.0 - Support for CanJS 6](https://github.com/canjs/can-connect-feathers/releases/tag/v7.0.0)
This updates can-connect-feathers for support for CanJS 6.

## [can-connect-ndjson v2.0.0 - Dependency upgrade](https://github.com/canjs/can-connect-ndjson/releases/tag/v2.0.0)
The 2.0.0 version of can-connect-ndjson depends on can-connect 4.0.0 or later.

There is no code change from the last 1.x release.

## [can-define-realtime-rest-model v2.0.0 - Dependency upgrade](https://github.com/canjs/can-define-realtime-rest-model/releases/tag/v2.0.0)
The 2.0.0 version of can-define-realtime-rest-model depends on can-connect 4.0.0 or later.

There is no code change from the last 1.x release.

## [can-define-rest-model v2.0.0 - Dependency upgrade](https://github.com/canjs/can-define-rest-model/releases/tag/v2.0.0)
The 2.0.0 version of can-define-rest-model depends on can-connect 4.0.0 or later.

There is no code change from the last 1.x release.

## [can-super-model v2.0.0 - Dependency upgrade](https://github.com/canjs/can-super-model/releases/tag/v2.0.0)
The 2.0.0 version of can-super-model depends on can-connect 4.0.0 or later.

There is no code change from the last 1.x release.

# Minor

## [can-stache v5.1.0 - for(integer)](https://github.com/canjs/can-stache/releases/tag/v5.1.0)
PR: https://github.com/canjs/can-stache/pull/709

This enables for loops to loop through numbers:

```
{{# for(this.count) }}
  {{ scope.index }}
{{/ for }}
```

# Patch

- [can-route v5.0.2 - Prevent .register from reading route data](https://github.com/canjs/can-route/releases/tag/v5.0.2)

- [can-stache-element v1.0.3 - Import `can` package in docs](https://github.com/canjs/can-stache-element/releases/tag/v1.0.3)

- [can-attribute-observable v2.0.2 - Updated documentation to use can-stache-element](https://github.com/canjs/can-attribute-observable/releases/tag/v2.0.2)

- [can-dom-mutate v2.0.8 - Work around IE11 contains() that does not recognize text nodes](https://github.com/canjs/can-dom-mutate/releases/tag/v2.0.8)

- [can-control v5.0.1 - Fix a queued teardown crash with viewModel listeners](https://github.com/canjs/can-control/releases/tag/v5.0.1)

- [can-observable-bindings v1.3.1]()

- [can-observable-bindings v1.3.2 - Initialize bindings to the right value](https://github.com/canjs/can-observable-bindings/releases/tag/v1.3.2)

- [can-observable-bindings v1.3.3 - Add parser documentation](https://github.com/canjs/can-observable-bindings/releases/tag/v1.3.3)

- [can-observe v2.3.2 - Remove an extra semicolon in a warning](https://github.com/canjs/can-observe/releases/tag/v2.3.2)

- [can-observable-mixin v1.0.4 - Get update and updateDeep to work on list-like objects](https://github.com/canjs/can-observable-mixin/releases/tag/v1.0.4)

- [can-observable-mixin v1.0.5 - Catch type errors only](https://github.com/canjs/can-observable-mixin/releases/tag/v1.0.5)

- [can-observable-mixin v1.0.6 - Test fix for CanJS build](https://github.com/canjs/can-observable-mixin/releases/tag/v1.0.6)

- [can-observable-mixin v1.0.7 - Set default to null / undefined without type](https://github.com/canjs/can-observable-mixin/releases/tag/v1.0.7)

- [can-stache v5.1.1 - for(number) docs fix](https://github.com/canjs/can-stache/releases/tag/v5.1.1)

- [can-simple-dom v1.7.1 - Allow a Node to report that it contains itself](https://github.com/canjs/can-simple-dom/releases/tag/v1.7.1)

- [can-route v5.0.1 - Add a warning when .data is set after .register() is called](https://github.com/canjs/can-route/releases/tag/v5.0.1)

- [can-memory-store v1.0.3 - Fix clear() function](https://github.com/canjs/can-memory-store/releases/tag/v1.0.3)

- [can-stache-bindings v5.0.2 - More error message improvements ](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.2)

- [can-stache-bindings v5.0.3 - Clean up after tests that throw errors](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.3)

- [can-stache-bindings v5.0.4 - Clean up a variable defined twice](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.4)

- [can-observable-array v1.0.6 - making sure dispatched patches have correct deleteCount](https://github.com/canjs/can-observable-array/releases/tag/v1.0.6)

- [can-observable-array v1.0.5 - Dispatch converted items in patch inserts](https://github.com/canjs/can-observable-array/releases/tag/v1.0.5)

- [can-observable-array v1.0.4 - Implement `can.getOwnEnumerableKeys` symbol](https://github.com/canjs/can-observable-array/releases/tag/v1.0.4)

- [can-map v4.3.10 - Prevent bubble parent with children functions](https://github.com/canjs/can-map/releases/tag/v4.3.10)

- [can-map v4.3.11 - Prevent bubble parent with children arrays](https://github.com/canjs/can-map/releases/tag/v4.3.11)

- [can-map v4.3.12 - Fix attempts to bubble bind non-observable children](https://github.com/canjs/can-map/releases/tag/v4.3.12)

- [can-observable-array v1.0.3 - 1.0.3](https://github.com/canjs/can-observable-array/releases/tag/v1.0.3)

- [can-type v1.1.3 - Add type error property](https://github.com/canjs/can-type/releases/tag/v1.1.3)

- [can-type v1.1.4 - Adding steal-remove](https://github.com/canjs/can-type/releases/tag/v1.1.4)

- [can-view-live v5.0.3 - Rebind listeners for reconnected live elements](https://github.com/canjs/can-view-live/releases/tag/v5.0.3)

- [can-view-live v5.0.2 - Use the DOM queue for all DOM updates](https://github.com/canjs/can-view-live/releases/tag/v5.0.2)

- [can-view-live v5.0.1 - Add docs in the main file](https://github.com/canjs/can-view-live/releases/tag/v5.0.1)
