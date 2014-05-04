/// <reference path="__init__.ts"/>
module xn {
    export module logger {

        /* Document append logger */
        export class DocumentLogger implements Handler {

            target:HTMLElement;

            /*
             * Creates a new logger
             * @param target If provided, the document element to log to.
             */
            constructor(target:HTMLElement = null) {
                if (target !== null) {
                    this.target = target;
                }
                else {
                    var e = document.createElement('div');
                    document.body.appendChild(e);
                    this.target = e;
                }
            }

            _append(prefix:string, msg:any):void {
                msg = msg == null ? 'null' : msg;
                var e = document.createElement('div');
                e.innerHTML = prefix + ": " + msg.toString();
                if (this.target.childNodes.length > 0) {
                    this.target.insertBefore(e, this.target.firstChild);
                }
                else {
                    this.target.appendChild(e);
                }
                if (window.console) {
                    window.console.log(msg);
                }
            }

            info(msg):void {
                this._append('info', msg);
            }

            warn(msg):void {
                this._append('warning', msg);
            }

            error(msg, e):void {
                e = e == null ? 'null' : e.toString();
                this._append('error', msg + ': ' + e)
                if (window.console) {
                    window.console.error(e);
                }
            }

            watch(key, msg):void {
                var e = this._find(key);
                e.innerHTML = msg.toString();
            }

            _find(key):HTMLElement {
                var rtn:HTMLElement = null;
                for (var i = 0; i < this.target.children.length; ++i) {
                    var value = this.target.children[i];
                    if (value.getAttribute('id') == key) {
                        rtn = <HTMLElement> value;
                        break;
                    }
                }
                if (rtn == null) {
                    rtn = document.createElement('div');
                    rtn.id = key;
                    this.target.appendChild(rtn);
                }
                return rtn;
            }
        }
    }
}
