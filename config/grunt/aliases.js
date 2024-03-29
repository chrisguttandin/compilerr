const { env } = require('process');

// eslint-disable-next-line padding-line-between-statements
const filter = (predicate, ...tasks) => (predicate ? tasks : []);
const isTarget = (...targets) => env.TARGET === undefined || targets.includes(env.TARGET);

module.exports = {
    build: ['sh:build'],
    lint: ['sh:lint-config', 'sh:lint-src', 'sh:lint-test'],
    test: [
        'build',
        ...filter(isTarget('chrome', 'firefox', 'safari'), 'sh:test-unit-browser'),
        ...filter(isTarget('node'), 'sh:test-unit-node')
    ]
};
