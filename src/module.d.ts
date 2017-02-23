export declare const compile: (template: string, parameters?: { [ key: string ]: string }) => ((parameters?: { [ key: string ]: string }, cause?: Error) => Error) | ((cause: Error) => Error);
