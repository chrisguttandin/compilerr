import babel from 'rollup-plugin-babel';

export default {
    dest: 'build/es5/bundle.js',
    entry: 'src/module.js',
    format: 'umd',
    moduleName: 'compilerr',
    plugins: [
        babel({
            exclude: 'node_modules/**',
            presets: [
                [
                    'es2015',
                    {
                        modules: false
                    }
                ]
            ]
        })
    ]
};
