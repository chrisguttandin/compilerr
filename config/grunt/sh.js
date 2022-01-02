module.exports = (grunt) => {
    const continuous = grunt.option('continuous') === true;
    const fix = grunt.option('fix') === true;

    return {
        'build-es2019': {
            cmd: 'tsc --project src/tsconfig.json'
        },
        'build-es5': {
            cmd: 'rollup --config config/rollup/bundle.js'
        },
        'build-node': {
            cmd: 'babel ./build/es2019 --config-file ./config/babel/build.json --out-dir ./build/node'
        },
        'lint-config': {
            cmd: `eslint --config config/eslint/config.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives *.js config/`
        },
        'lint-src': {
            cmd: 'tslint --config config/tslint/src.json --project src/tsconfig.json src/*.ts src/**/*.ts'
        },
        'lint-test': {
            cmd: `eslint --config config/eslint/test.json --ext .js ${fix ? '--fix ' : ''}--report-unused-disable-directives test/`
        },
        'test-unit-browser': {
            cmd: `karma start config/karma/config-unit.js ${continuous ? '--concurrency Infinity' : '--single-run'}`
        },
        'test-unit-node': {
            cmd: 'mocha --bail --parallel --recursive --require config/mocha/config-unit.js test/unit'
        }
    };
};
