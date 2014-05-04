/// <reference path="../__init__.ts"/>
/// <reference path="error.ts"/>
/// <reference path="not_implemented_error.ts"/>
module xn {

    /* Easy exception creation */
    export function error(msg:string, type:string = 'xn.Error'):xn.Error {
        return new xn.Error(msg, type);
    }

    /* Easy exception creation */
    export function notImplemented():xn.Error {
        return new xn.NotImplementedError();
    }
}
