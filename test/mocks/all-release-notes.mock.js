module.exports = {
  'can-stache-bindings': [
      '[can-stache-bindings v5.0.0-pre.2](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.0-pre.2)',
      '[can-stache-bindings v5.0.0-pre.3](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.0-pre.3)',
      '[can-stache-bindings v5.0.0-pre.4](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.0-pre.4)',
      '[can-stache-bindings v5.0.0-pre.5](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.0-pre.5)',
      '[can-stache-bindings v5.0.0-pre.6 - can.preventDataBindings symbol support](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.0-pre.6)\nThis prevents adding bindings if a `can.preventDataBindings` symbol on an element returns `true`',
      '[can-stache-bindings v5.0.0](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.0)',
      '[can-stache-bindings v5.0.1](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.1)',
      '[can-stache-bindings v5.0.2 - More error message improvements ](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.2)\n- Make the “Unable to bind” error message more useful, instead of `Uncaught Error: can-event-queue: Unable to bind complete`:\r\n```js\r\nvar vm = new SimpleMap({\r\n    todo: {\r\n        complete: false\r\n    }\r\n});\r\nvm.handle = function() {} ;\r\nvar template = stache(\'<div on:complete:by:todo="handle()"></div>\');\r\ntemplate(vm); // -> can-stache-bindings - Unable to bind "complete": "complete" is a property on a plain object "{"complete":false}". Binding is available with observable objects only. For more details check https://canjs.com/doc/can-stache-bindings.html#Callafunctionwhenaneventhappensonavalueinthescope_animation_\'\r\n```\r\n- Explain that <input> elements always set properties to Strings',
      '[can-stache-bindings v5.0.3 - Clean up after tests that throw errors](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.3)\nhttps://github.com/canjs/can-stache-bindings/pull/553',
      '[can-stache-bindings v5.0.4 - Clean up a variable defined twice](https://github.com/canjs/can-stache-bindings/releases/tag/v5.0.4)\nRemoves a variable was defined twice in the code.\r\n#556 '
  ]
};
