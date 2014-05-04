/// <reference path="__init__.ts"/>
declare var window:Window;
module xn {
    export module logger {

        /* Console logger */
        export class ConsoleLogger implements Handler {
            info(msg):void {
                this._console().log(msg);
            }

            warn(msg):void {
                this._console().warn(msg);
            }

            error(msg, e):void {
                this._console().error(msg, e);
            }

            watch(key, msg):void {
                // Watching not possible on the console, sorry!
            }

            private _console():any {
                try {
                    return window.console;
                }
                catch (e) {
                    try {
                        return console;
                    }
                    catch (e) {
                        return new DummyLogger();
                    }
                }
            }
        }
    }
}
