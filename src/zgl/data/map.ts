/// <reference path="../__init__.ts"/>
module xn {

    /* A map wrapper with some extra features and browser support */
    export class Map<U, V> {

        /* Internal data array */
        private _data:any;

        /* Create a map from a dictionary */
        constructor(data:any = {}) {
            this._data = data;
        }

        /* Set a value */
        public set(key:U, value:V):void {
            this._data[key] = value;
        }

        /* Get a value */
        public get(key:U):V {
            return <V> this._data[key];
        }

        /* Check if a key exists */
        public hasKey(key:U):boolean {
            return xn.data.has(this._data, key);
        }

        /* Internal smart each operator */
        private _each(apply:{(key:U, item:V):boolean}):void {
            for (var key in this._data) {
                if (!apply(key, this._data[key])) {
                    break;
                }
            }
        }

        /* Do something on each element */
        public each(apply:{(key:U, value:V):void}):void {
            this._each((k:U, v:V) => { apply(k, v); return true; });
        }

        /* Value the values to new values */
        public map(map:{(value:V):V}):void {
            var _data:any = {};
            this.each((k:U, v:V) => { _data[k] = map(v); return true; });
            this.setInternal(_data);
        }

        /* Update the internal data */
        public setInternal(data:any):void {
            this._data = data;
        }

        /* Get keys as a list */
        public keys():xn.List<U> {
            var rtn = new xn.List<U>();
            this.each((k:U, v:V) => { rtn.push(k); });
            return rtn;
        }

        /* Get values as a list */
        public values():xn.List<V> {
            var rtn = new xn.List<V>();
            this.each((k:U, v:V) => { rtn.push(v); });
            return rtn;
        }

        /* All the values in the map */
        public all():any {
            return this._data;
        }
    }
}
