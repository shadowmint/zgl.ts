module xn {

    /* Simple ajax wrapper */
    export class Xhr {

        private _xhr:XMLHttpRequest;

        private _def:xn.Promise = null;

        constructor() {
            this._xhr = Xhr.factory();
            xn.dom.addEventListener(this._xhr, 'readystatechange', (e) => {
                this._stateChange();
            });
        }

        /* Changes on state */
        private _stateChange():void {
            if (this._xhr.readyState == 4) {
                if (this._xhr.status == 200) {
                    this._def.resolve(this._xhr.responseText);
                }
                else {
                    this._def.reject(this._xhr.statusText);
                }
            }
        }

        /* Open a url */
        public open(method:string, url:string):void {
            this._xhr.open(method, url);
        }

        /* Send the request */
        public send(data?:any):xn.Promise {
            if (this._def != null) {
                throw xn.error("Invalid request; this object is already busy");
            }
            this._xhr.send(data);
            this._def = new xn.Promise();
            return this._def;
        }

        /* Create and return an XHR object */
        public static factory() {
            try {
                return new XMLHttpRequest();
            } catch (e) {
            }
            try {
                return new ActiveXObject("Msxml3.XMLHTTP");
            } catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.6.0");
            } catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP.3.0");
            } catch (e) {
            }
            try {
                return new ActiveXObject("Msxml2.XMLHTTP");
            } catch (e) {
            }
            try {
                return new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
            }
            return null;
        }
    }
}
