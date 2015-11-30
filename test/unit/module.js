'use strict';

var compilerr = require('../../src/module.js');

describe('compilerr', function () {

    describe('compile()', function () {

        it('should return an error with a compiled message', function () {
            var err,
                template;

            template = {
                message: 'A resource at the url called "${url}" could not be found.'
            };

            err = compilerr.compile(template, {
                url: '/somewhere.json'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A resource at the url called "/somewhere.json" could not be found.');
        });

        it('should return an error with a compiled code', function () {
            var err,
                template;

            template = {
                code: 'a-${fake}-code'
            };

            err = compilerr.compile(template, {
                fake: 'fake'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.code).to.equal('a-fake-code');
        });

        it('should return an error with a compiled message containing two variables', function () {
            var err,
                template;

            template = {
                message: 'A ${resource} at the url called "${url}" could not be found.'
            };

            err = compilerr.compile(template, {
                resource: 'resource',
                url: '/somewhere.json'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A resource at the url called "/somewhere.json" could not be found.');
        });

        it('should return an error with a given status', function () {
            var err,
                template;

            template = {
                status: 400
            };

            err = compilerr.compile(template);

            expect(err).to.be.an.instanceOf(Error);

            expect(err.status).to.equal(400);
        });

        it('should capitalize a variable', function () {
            var err,
                template;

            template = {
                message: '${text.capitalize()} and even more text.'
            };

            err = compilerr.compile(template, {
                text: 'a capitalized text'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A capitalized text and even more text.');
        });

        it('should dashify a variable', function () {
            var err,
                template;

            template = {
                message: '${text.dashify()}'
            };

            err = compilerr.compile(template, {
                text: 'a text with spaces and camelCase'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('a-text-with-spaces-and-camel-case');
        });

        it('should prepend a variable with an indefinite article', function () {
            var err,
                template;

            template = {
                message: 'Something like ${error.prependIndefiniteArticle()} can always happen.'
            };

            err = compilerr.compile(template, {
                error: 'error'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('Something like an error can always happen.');
        });

        it('should apply two modifiers to one variable', function () {
            var err,
                template;

            template = {
                message: '${error.prependIndefiniteArticle().capitalize()} can always happen.'
            };

            err = compilerr.compile(template, {
                error: 'error'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('An error can always happen.');
        });

        it('should return an error with a given cause as a third argument', function () {
            var cause,
                err;

            cause = new Error('a fake cause');

            err = compilerr.compile({}, {}, cause);

            expect(err).to.be.an.instanceOf(Error);

            expect(err.cause).to.equal(cause);
        });

        it('should return an error with a given cause as a second argument', function () {
            var cause,
                err;

            cause = new Error('a fake cause');

            err = compilerr.compile({}, cause);

            expect(err).to.be.an.instanceOf(Error);

            expect(err.cause).to.equal(cause);
        });

        it('should return an error with a given AWS style exception as a second argument', function () {
            var cause,
                err;

            cause = {
                code: 'SomeCrazyException'
            };

            err = compilerr.compile({}, cause);

            expect(err).to.be.an.instanceOf(Error);

            expect(err.cause).to.equal(cause);
        });

    });

});
