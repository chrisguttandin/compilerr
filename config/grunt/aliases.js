module.exports = {
    build: [
        'clean:build',
        'babel:build'
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
