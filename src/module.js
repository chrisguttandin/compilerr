'use strict';

const dashify = require('dashify');
const indefiniteArticle = require('indefinite-article');

function applyModifiers(variable, modifiers) {
    if (modifiers === undefined) {
        return variable;
    }

    return modifiers.reduce(function (variable, modifier) {
        if (modifier === 'capitalize') {
            return variable.charAt(0).toUpperCase() + variable.slice(1);
        }

        if (modifier === 'dashify') {
            return dashify(variable);
        }

        if (modifier === 'prependIndefiniteArticle') {
            return indefiniteArticle(variable) + ' ' + variable;
        }

        return variable;
    }, variable);
}

function buildRegex(variable) {
    let expression;

    if (variable.modifiers) {
        expression = variable.name + variable.modifiers
            .map(function(modifier) {
                return '\\.' + modifier + '\\(\\)';
            })
            .join('');
    } else {
        expression = variable.name;
    }

    return new RegExp('\\${' + expression + '}', 'g');
}

function renderString(string, parameters) {
    const expressionRegex = /\${([^\.\}]+)((\.[^\(]+\(\))*)}/g;

    const variables = [];

    let expressionResult = expressionRegex.exec(string);

    while (expressionResult !== null) {
        const variable = {
            name: expressionResult[1]
        };

        if (expressionResult[3] !== undefined) {
            const modifiersRegex = /\.[^\(]+\(\)/g;

            let modifiersRegexResult = modifiersRegex.exec(expressionResult[2]);

            variable.modifiers = [];

            while (modifiersRegexResult !== null) {
                variable.modifiers.push(modifiersRegexResult[0].slice(1, -2));

                modifiersRegexResult = modifiersRegex.exec(expressionResult[2]);
            }
        }

        variables.push(variable);

        expressionResult = expressionRegex.exec(string);
    }

    return variables.reduce(function (template, variable) {
        return template.replace(buildRegex(variable), applyModifiers(parameters[variable.name], variable.modifiers));
    }, string);
}

module.exports.compile = function compile(template, parameters, cause) {
    if (arguments.length === 2 &&
            (parameters instanceof Error || (parameters.code !== undefined && parameters.code.slice(-9) === 'Exception'))) {
        cause = parameters;
    }

    const code = (template.code === undefined) ? undefined : renderString(template.code, parameters);
    const message = (template.message === undefined) ? undefined : renderString(template.message, parameters);

    const err = (message === undefined) ? new Error() : new Error(message);

    if (cause !== undefined) {
        err.cause = cause;
    }

    if (code !== undefined) {
        err.code = code;
    }

    if (template.status !== undefined) {
        err.status = template.status;
    }

    return err;
};
