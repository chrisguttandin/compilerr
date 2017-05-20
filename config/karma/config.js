module.exports = (config) => {

    config.set({

        basePath: '../../',

        browserNoActivityTimeout: 90000,

        browsers: [
            'ChromeCanary',
            'FirefoxDeveloper'
        ],

        files: [
            'test/unit/**/*.js'
        ],

        frameworks: [
            'mocha',
            'sinon-chai'
        ],

        preprocessors: {
            'test/unit/**/*.js': 'webpack'
        },

        webpack: {
            module: {
                loaders: [
                    {
                        loader: 'ts-loader',
                        test: /\.ts?$/
                    }
                ]
            },
            resolve: {
                extensions: [ '.js', '.ts' ]
            }
        },

        webpackMiddleware: {
            noInfo: true
        }

    });

};
