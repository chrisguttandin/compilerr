module.exports = {
    continuous: {
        files: ['src/**/*.ts', 'test/unit/**/*.js'],
        options: {
            spawn: false
        },
        tasks: ['test']
    }
};
