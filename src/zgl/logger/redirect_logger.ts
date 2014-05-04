/// <reference path="__init__.ts"/>
module xn {
    export module logger {

        /* Redirect logger; redirects to real impl */
        export class RedirectLogger implements Handler {

            /* Actual logger to invoke */
            target:Handler = new xn.logger.ConsoleLogger();

            info(msg):void {
                this.target.info(msg);
            }

            warn(msg):void {
                this.target.warn(msg);
            }

            error(msg, e):void {
                this.target.error(msg, e);
                var st = this._getStackTrace(e);
                if (st) {
                    for (var i = 0; i < st.length; ++i) {
                        this.target.info(st[i]);
                    }
                }
            }

            watch(key, msg):void {
                this.target.watch(key, msg);
            }

            /* Try to dump an object as a string */
            dump(data:any):string {
                try {
                    var rtn = '';
                    for (var key in data) {
                        if (!this._isFunc(data[key])) {
                            rtn += '( ' + key;
                            if (this._isObj(data[key])) {
                                rtn += ': ' + this.dump(data[key]) + ' )';
                            }
                            else {
                                rtn += ': ' + data[key] + ' )';
                            }
                        }
                    }
                    return rtn;
                }
                catch (e) {
                }
                return data.toString();
            }

            private _isFunc(t:any):boolean {
                var getType = {};
                return t && getType.toString.call(t) === '[object Function]';
            }

            private _isObj(t:any):boolean {
                var getType = {};
                return t && getType.toString.call(t) === '[object Object]';
            }

            private _getStackTrace(e:any):string[] {
                var rtn:string[] = null;
                if (e.stack) {
                    rtn = e.stack.split('\n');
                }
                else if (window['opera'] && e.message) {
                    rtn = e.message.split('\n');
                }
                return rtn;
            }
        }
    }
}
