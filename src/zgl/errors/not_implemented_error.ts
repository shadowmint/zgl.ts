/// <reference path="__init__.ts"/>
module xn {

    /* For things not ready yet */
    export class NotImplementedError extends Error {
        constructor() {
            super('Not implemented', 'xn.NotImplementedError');
        }
    }
}
