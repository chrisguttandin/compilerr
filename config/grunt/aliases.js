module.exports = {
    build: [
        'clean:build',
        'sh:build',
        'babel:build',
        'uglify'
    ],
    continuous: [
        'test',
        'watch:continuous'
    ],
    lint: [
        'eslint'
    ],
    test: [
        'build',
        'mochaTest:test'
    ]
};
