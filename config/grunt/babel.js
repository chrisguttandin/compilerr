const babelOptions = require('../babel/build.json');

module.exports = {
    build: {
        files: [{
            cwd: 'src/',
            dest: 'build/node',
            expand: true,
            src: [
                '**/*.js'
            ]
        }],
        options: babelOptions
    }
};
