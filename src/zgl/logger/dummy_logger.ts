/// <reference path="__init__.ts"/>
module xn {
    export module logger {

        /* Dummy logger */
        export class DummyLogger implements Handler {

            log(msg):void {
            }

            info(msg):void {
            }

            warn(msg):void {
            }

            error(msg, e):void {
            }

            watch(key, msg):void {
            }
        }
    }
}
