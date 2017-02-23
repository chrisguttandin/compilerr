import dashify from 'dashify';
import indefiniteArticle from 'indefinite-article';

function applyModifiers (variable, modifiers) {
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

function buildRegex (variable) {
    const expression = variable.name + variable.modifiers
        .map((modifier) => '\\.' + modifier + '\\(\\)')
        .join('');

    return new RegExp('\\${' + expression + '}', 'g');
}

function preRenderString (string, parameters) {
    const expressionRegex = /\${([^.}]+)((\.[^(]+\(\))*)}/g;

    const variables = [];

    let expressionResult = expressionRegex.exec(string);

    while (expressionResult !== null) {
        const variable = {
            modifiers: [],
            name: expressionResult[1]
        };

        if (expressionResult[3] !== undefined) {
            const modifiersRegex = /\.[^(]+\(\)/g;

            let modifiersRegexResult = modifiersRegex.exec(expressionResult[2]);

            while (modifiersRegexResult !== null) {
                variable.modifiers.push(modifiersRegexResult[0].slice(1, -2));

                modifiersRegexResult = modifiersRegex.exec(expressionResult[2]);
            }
        }

        variables.push(variable);

        expressionResult = expressionRegex.exec(string);
    }

    const preRenderedParts = variables
        .reduce(
            (parts, variable) => parts
                .map((part) => part
                    .split(buildRegex(variable))
                    .reduce((prts, part, index) => {
                        if (index === 0) {
                            return [ part ];
                        }

                        if (variable.name in parameters) {
                            return [ ...prts, applyModifiers(parameters[variable.name], variable.modifiers), part ];
                        }

                        return [ ...prts, (prmtrs) => applyModifiers(prmtrs[variable.name], variable.modifiers), part ];
                    }, [ ])
                )
                .reduce((prts, part) => [ ...prts, ...part ], []),
            [ string ]
        );

    return (missingParameters) => preRenderedParts
        .reduce((renderedParts, preRenderedPart) => {
            if (typeof preRenderedPart === 'string') {
                return [ ...renderedParts, preRenderedPart ];
            }

            return [ ...renderedParts, preRenderedPart(missingParameters) ];
        }, [ ])
        .join('');
}

export const compile = (template, knownParameters = {}) => {
    const renderCode = (template.code === undefined) ? () => undefined : preRenderString(template.code, knownParameters);
    const renderMessage = (template.message === undefined) ? undefined : preRenderString(template.message, knownParameters);

    return (missingParameters = {}, cause = undefined) => {
        if (cause === undefined &&
                (missingParameters instanceof Error || (missingParameters.code !== undefined && missingParameters.code.slice(-9) === 'Exception'))) {
            cause = missingParameters;
        }

        const err = (renderMessage === undefined) ? new Error() : new Error(renderMessage(missingParameters));

        if (cause !== undefined) {
            err.cause = cause;
        }

        if (renderCode !== undefined) {
            err.code = renderCode(missingParameters);
        }

        if (template.status !== undefined) {
            err.status = template.status;
        }

        return err;
    };
};
