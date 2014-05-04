/// <reference path="__init__.ts"/>
module xn {
    export module logger {

        /* Logger base */
        export interface Handler {

            /* Info messages */
            info(msg:any): void;

            /* Warnings */
            warn(msg:any): void;

            /* Errors */
            error(msg:any, e:any): void;

            /* Watch */
            watch(key:string, msg:any):void;
        }
    }
}
