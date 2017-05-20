import dashify from 'dashify';
import indefiniteArticle from 'indefinite-article';
import { IAWSError, IAugmentedError, IErrorTemplate, IParameterObject, IVariable } from './interfaces';

const applyModifiers = (name: string, modifiers: string[]) => {
    if (modifiers === undefined) {
        return name;
    }

    return modifiers.reduce((name, modifier) => {
        if (modifier === 'capitalize') {
            return name.charAt(0).toUpperCase() + name.slice(1);
        }

        if (modifier === 'dashify') {
            return dashify(name);
        }

        if (modifier === 'prependIndefiniteArticle') {
            return indefiniteArticle(name) + ' ' + name;
        }

        return name;
    }, name);
};

const buildRegex = (variable: IVariable) => {
    const expression = variable.name + variable.modifiers
        .map((modifier) => '\\.' + modifier + '\\(\\)')
        .join('');

    return new RegExp('\\${' + expression + '}', 'g');
};

const preRenderString = (string: string, parameters: IParameterObject) => {
    const expressionRegex = /\${([^.}]+)((\.[^(]+\(\))*)}/g;

    const variables: IVariable[] = [];

    let expressionResult = expressionRegex.exec(string);

    while (expressionResult !== null) {
        const variable: IVariable = {
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
            (parts: (string | Function)[], variable: IVariable) => parts
                .map((part) => {
                    if (typeof part === 'string') {
                        return part
                            .split(buildRegex(variable))
                            .reduce((prts: string[], part: string, index: number) => {
                                if (index === 0) {
                                    return [ part ];
                                }

                                if (variable.name in parameters) {
                                    return [ ...prts, applyModifiers(parameters[variable.name], variable.modifiers), part ];
                                }

                                return [ ...prts, (prmtrs: IParameterObject) => applyModifiers(prmtrs[variable.name], variable.modifiers), part ];
                            }, [ ]);
                    }

                    return [ part ];
                })
                .reduce((prts: (string | Function)[], part: (string | Function)[]) => [ ...prts, ...part ], []),
            [ string ]
        );

    return (missingParameters: IParameterObject) => preRenderedParts
        .reduce((renderedParts: string[], preRenderedPart: string | Function) => {
            if (typeof preRenderedPart === 'string') {
                return [ ...renderedParts, preRenderedPart ];
            }

            return [ ...renderedParts, preRenderedPart(missingParameters) ];
        }, [ ])
        .join('');
};

export const compile = (template: IErrorTemplate, knownParameters: IParameterObject = {}) => {
    const renderCode = (template.code === undefined) ? undefined : preRenderString(template.code, knownParameters);
    const renderMessage = (template.message === undefined) ? undefined : preRenderString(template.message, knownParameters);

    return (missingParameters: Error | IAWSError | IParameterObject = {}, cause?: Error | IAWSError) => {
        if (cause === undefined &&
                (missingParameters instanceof Error || ((<IAWSError> missingParameters).code !== undefined && (<IAWSError> missingParameters).code.slice(-9) === 'Exception'))) {
            cause = <Error | IAWSError> missingParameters;
            missingParameters = {};
        }

        const err: IAugmentedError = <IAugmentedError> ((renderMessage === undefined) ? new Error() : new Error(renderMessage(<IParameterObject> missingParameters)));

        if (cause !== undefined) {
            err.cause = cause;
        }

        if (renderCode !== undefined) {
            err.code = renderCode(<IParameterObject> missingParameters);
        }

        if (template.status !== undefined) {
            err.status = template.status;
        }

        return err;
    };
};
