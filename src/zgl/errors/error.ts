/// <reference path="__init__.ts"/>
module xn {

    /* Base type for meaningful errors */
    export class Error {

        /* Type of error */
        name:string;

        /* Error message */
        message:string;

        constructor(msg:string, type:string = 'xn.Error') {
            this.message = msg;
            this.name = type;
        }

        /* Public version */
        toString():string {
            return this.name + ": " + this.message
        }
    }
}
