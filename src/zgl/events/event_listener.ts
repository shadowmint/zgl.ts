/// <reference path="__init__.ts"/>
module xn {

    /* Helper for objects that implement event listening */
    export class EventListenerBase implements xn.EventListener {

        /* Actual event bindings */
        private _bindings:{[key:string]:xn.List<any>} = {};

        /* Accepted event keys */
        private _keys:xn.List<string> = new xn.List<string>();

        /* Create an event listener with a finite set of accepting keys */
        constructor(keys:string[]) {
            this._keys.set(keys);
            this._keys.map((key:string) => { return key.toLocaleLowerCase(); });
            this._keys.each((key:string) => { this._bindings[key] = new xn.List<any>(); })
        }

        private _guard(key:string):void {
            if (!this._keys.any(key)) {
                throw xn.error('Invalid key for event listener: "' + key + '" (accepts: ' + this._keys.join(', ') + ')');
            }
        }

        /* Attach an event binding */
        public addEventListener(key:string, callback:any):void {
            this._guard(key);
            this._bindings[key].push(callback);
        }

        /* Remove an event listener */
        public removeEventListener(key:string, callback:any):void {
            this._guard(key);
            this._bindings[key].remove(callback);
        }

        /* Trigger events */
        public trigger(key:string, event:any):void {
            this._guard(key);
            this._bindings[key].each((callback) => { callback(event); });
        }
    }
}
