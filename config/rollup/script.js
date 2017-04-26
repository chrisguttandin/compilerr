import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    dest: 'build/es5/script.js',
    entry: 'src/module.js',
    format: 'umd',
    moduleName: 'compilerr',
    plugins: [
        babel({
            presets: [
                [
                    'es2015',
                    {
                        modules: false
                    }
                ]
            ]
        }),
        commonjs(),
        nodeResolve()
    ]
};
