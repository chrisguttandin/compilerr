const babelOptions = require('../babel/test.json');
const babelRegister = require('babel-register');
const chai = require('chai');
const fs = require('fs');

module.exports = {
    test: {
        options: {
            bail: true,
            clearRequireCache: true,
            require: [
                () => {
                    const compiler = require.extensions['.js'];

                    require.extensions['.js'] = function (mdl, filename) {
                        if (!filename.includes('node_modules') && filename.includes('src/')) {
                            filename = filename
                                .replace('src/', 'build/node/')
                                .slice(0, -3) + '.js';

                            mdl._compile(fs.readFileSync(filename, 'utf8'), filename);
                        }

                        if (compiler) {
                            return compiler(mdl, filename);
                        }
                    };
                },
                () => babelRegister(babelOptions),
                () => global.expect = chai.expect
            ]
        },
        src: [
            'test/unit/**/*.js'
        ]
    }
};
