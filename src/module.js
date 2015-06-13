'use strict';

var indefiniteArticle = require('indefinite-article.js');

function applyModifiers(variable, modifiers) {
    if (modifiers === undefined) {
        return variable;
    }

    return modifiers.reduce(function (variable, modifier) {
        if (modifier === 'capitalize') {
            return variable.charAt(0).toUpperCase() + variable.slice(1);
        }

        if (modifier === 'prependIndefiniteArticle') {
            return indefiniteArticle(variable) + ' ' + variable;
        }

        return variable;
    }, variable);
}

function buildRegex(variable) {
    var expression;

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
    var regex = /\${([^\.]+)(\.[^\(]+\(\))*}/g,
        result,
        variables = [];

    result = regex.exec(string);

    while (result !== null) {
        variables.push({
            name: result[1],
            modifiers: (result[2] === undefined) ? [] : Array.prototype.slice.call(result, 2).map(function (modifier) {
                return modifier.slice(1, -2);
            })
        });

        result = regex.exec(string);
    }

    return variables.reduce(function (template, variable) {
        return template.replace(buildRegex(variable), applyModifiers(parameters[variable.name], variable.modifiers));
    }, string);
}

module.exports.compile = function compile(template, parameters) {
    var code,
        err,
        message;

    code = (template.code === undefined) ? undefined : renderString(template.code, parameters);
    message = (template.message === undefined) ? undefined : renderString(template.message, parameters);

    err = (message === undefined) ? new Error() : new Error(message);

    if (code !== undefined) {
        err.code = code;
    }

    if (template.status !== undefined) {
        err.status = template.status;
    }

    return err;
};
