const generate = require('../src/generate-release-notes');

test('adds 1 + 2 to equal 3', () => {
  expect(generate(1, 2)).toBe(3);
});
