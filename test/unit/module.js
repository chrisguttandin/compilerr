import * as compilerr from '../../src/module';

describe('compilerr', function () {
    describe('compile()', function () {
        it('should return an error with a compiled message of known parameters', function () {
            const template = {
                message: 'A resource at the url called "${url}" could not be found.'
            };
            const render = compilerr.compile(template, {
                url: '/somewhere.json'
            });

            expect(render).to.be.a('function');

            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A resource at the url called "/somewhere.json" could not be found.');
        });

        it('should return an error with a compiled message of missing parameters', function () {
            const template = {
                message: 'A resource at the url called "${url}" could not be found.'
            };
            const render = compilerr.compile(template);

            expect(render).to.be.a('function');

            const err = render({
                url: '/somewhere.json'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A resource at the url called "/somewhere.json" could not be found.');
        });

        it('should return an error with a compiled code of known parameters', function () {
            const template = {
                code: 'a-${fake}-code'
            };
            const render = compilerr.compile(template, {
                fake: 'fake'
            });

            expect(render).to.be.a('function');

            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.code).to.equal('a-fake-code');
        });

        it('should return an error with a compiled code of missing parameters', function () {
            const template = {
                code: 'a-${fake}-code'
            };
            const render = compilerr.compile(template);

            expect(render).to.be.a('function');

            const err = render({
                fake: 'fake'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.code).to.equal('a-fake-code');
        });

        it('should return an error with a compiled message containing two variables of known parameters', function () {
            const template = {
                message: 'A ${resource} at the url called "${url}" could not be found.'
            };
            const render = compilerr.compile(template, {
                resource: 'resource',
                url: '/somewhere.json'
            });

            expect(render).to.be.a('function');

            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A resource at the url called "/somewhere.json" could not be found.');
        });

        it('should return an error with a compiled message containing two variables of missing parameters', function () {
            const template = {
                message: 'A ${resource} at the url called "${url}" could not be found.'
            };
            const render = compilerr.compile(template);

            expect(render).to.be.a('function');

            const err = render({
                resource: 'resource',
                url: '/somewhere.json'
            });

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A resource at the url called "/somewhere.json" could not be found.');
        });

        it('should return an error with a given status', function () {
            const template = {
                status: 400
            };
            const render = compilerr.compile(template);
            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.status).to.equal(400);
        });

        it('should capitalize a variable', function () {
            const template = {
                message: '${text.capitalize()} and even more text.'
            };
            const render = compilerr.compile(template, {
                text: 'a capitalized text'
            });
            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('A capitalized text and even more text.');
        });

        it('should dashify a variable', function () {
            const template = {
                message: '${text.dashify()}'
            };
            const render = compilerr.compile(template, {
                text: 'a text with spaces and camelCase'
            });
            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('a-text-with-spaces-and-camel-case');
        });

        it('should prepend a variable with an indefinite article', function () {
            const template = {
                message: 'Something like ${error.prependIndefiniteArticle()} can always happen.'
            };
            const render = compilerr.compile(template, {
                error: 'error'
            });
            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('Something like an error can always happen.');
        });

        it('should apply two modifiers to one variable', function () {
            const template = {
                message: '${error.prependIndefiniteArticle().capitalize()} can always happen.'
            };
            const render = compilerr.compile(template, {
                error: 'error'
            });
            const err = render();

            expect(err).to.be.an.instanceOf(Error);

            expect(err.message).to.equal('An error can always happen.');
        });

        it('should return an error with a given cause as a second argument', function () {
            const cause = new Error('a fake cause');
            const render = compilerr.compile({});
            const err = render({}, cause);

            expect(err).to.be.an.instanceOf(Error);

            expect(err.cause).to.equal(cause);
        });

        it('should return an error with a given cause as a fist argument', function () {
            const cause = new Error('a fake cause');
            const render = compilerr.compile({});
            const err = render(cause);

            expect(err).to.be.an.instanceOf(Error);

            expect(err.cause).to.equal(cause);
        });

        it('should return an error with a given AWS style exception as a fist argument', function () {
            const cause = {
                code: 'SomeCrazyException'
            };
            const render = compilerr.compile({});
            const err = render(cause);

            expect(err).to.be.an.instanceOf(Error);

            expect(err.cause).to.equal(cause);
        });
    });
});
