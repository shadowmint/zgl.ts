/// <reference path="__init__.ts"/>
module xn {
    export module prim {

        // Utility functions
        export class Utility {

            // Check if a function
            public static isFunc(target:any):boolean {
                return !!(target && target.constructor && target.call && target.apply);
            }

            // Check if an object
            public static isObj(target:any):boolean {
                return (!!target) && (typeof(target) === 'object');
            }

            // Check if object is a promise
            public static isPromise(target:any):boolean {
                return target instanceof Promise;
            }
        }

        // Safe aggregate of objects
        export class Collection {

            // Actual data
            public _data:Promised[] = [];

            // Add an item
            public add(item:Promised):Promise {
                this._data.push(item);
                return item.child;
            }

            // Any items left?
            public any():number {
                return this._data.length;
            }

            // Get the next item or raise exception
            public next():Promised {
                if (this._data.length == 0) {
                    throw new Error('Invalid attempt read empty dataset');
                }
                return this._data.shift();
            }
        }

        // Promise states
        export enum State {
            PENDING = 0,
            FORFILLED = 1,
            REJECTED = 2
        }

        // A promised action set and its associated promise
        export class Promised {
            resolve:{(value:any):any
            };
            reject:{(value:any):any
            };
            child:Promise;
            accept:boolean;

            constructor(resolve:any, reject:any) {
                this.resolve = resolve;
                this.reject = reject;
                this.child = new Promise();
                this.accept = true;
            }
        }

        // The internal state collections of a promise
        export class Internal {
            public id:number;
            public state:State = State.PENDING;
            public children:Collection = new Collection();
            public value:any;
            public reason:any;
            private static _id = 0;

            constructor() {
                Internal._id += 1;
                this.id = Internal._id;
            }
        }
    }

    // Promise type
    export class Promise {

        // Internal state collection
        public _state:prim.Internal = new prim.Internal();

        // Chain promises
        public then(resolve:any = undefined, reject:any = undefined):Promise {
            return this._state.children.add(new prim.Promised(resolve, reject));
        }

        // Resolve this promise
        public resolve(value:any = undefined):Promise {
            if (this._state.state == prim.State.PENDING) {
                if (this === value) {
                    throw TypeError('Cannot resolve promise with itself');
                }
                this._state.value = value;
                this._state.state = prim.State.FORFILLED;
                xn.asap(() => {
                    Promise._resolvePromise(this, value);
                });
            }
            return this;
        }

        // Reject this promise
        public reject(reason:any = undefined):Promise {
            if (this._state.state == prim.State.PENDING) {
                if (this === reason) {
                    throw TypeError('Cannot reject promise with itself');
                }
                this._state.reason = reason;
                this._state.state = prim.State.REJECTED;
                xn.asap(() => {
                    Promise._resolvePromise(this, reason);
                });
            }
            return this;
        }

        // Run the resolution action for a promise, and return the correct return value
        private _executePromisedAction(promised:prim.Promised):any {
            try {
                var action:{(value:any):any
                } = null;
                var value:any;
                if (promised.accept) {
                    value = this._state.value;
                    action = promised.resolve;
                }
                else {
                    value = this._state.reason;
                    action = promised.reject;
                }
                if (prim.Utility.isFunc(action)) {
                    return action(value);
                }
                else {
                    return value; // spec: 2.2.7.3, 2.2.7.4
                }
            }
            catch (e) {
                promised.accept = false;
                return e;
            }
        }

        // Run the next promise resolution for this promise
        // Update internal promise state from the result
        // @return true if a new next promise should be scheduled
        private _nextPromisedAction():boolean {
            var rtn = false;
            if (this._state.state != prim.State.PENDING) {
                if (this._state.children.any()) {
                    rtn = true; // If we have an action, we need to poll for actions added by children
                    var promised = this._state.children.next();
                    promised.accept = this._state.state == prim.State.FORFILLED;
                    var promise_rtn = this._executePromisedAction(promised);

                    try {
                        if (promised.accept) {
                            var child = promised.child;
                            child.resolve(promise_rtn);
                        }
                        else {
                            var child = promised.child;
                            child.reject(promise_rtn);
                        }
                    }
                    catch (e) {
                        promised.child.reject(e);

                        // An error of this type rejects this promise too for
                        // the rest of the internal promise chain
                        this._state.state = prim.State.REJECTED;
                        this._state.reason = e;
                    }
                }
            }
            return rtn;
        }

        // Fullfill this promise with the given value
        private _fullfillPromise():void {
            if (this._nextPromisedAction()) {
                xn.asap(() => {
                    this._fullfillPromise();
                });
            }
        }

        // Compliant resolve promise.
        private static _resolvePromise(promise:Promise, value:any):void {
            if (prim.Utility.isPromise(value)) {
                promise._state.state = value._state.state;
            }
            else if (prim.Utility.isFunc(value) || prim.Utility.isObj(value)) {
                try {
                    var then = value.then;
                    if (prim.Utility.isFunc(then)) {
                        var resolved = false;
                        try {
                            then.call(value, (v) => {
                                if (!resolved) {
                                    resolved = true;
                                    Promise._resolvePromise(promise, v);
                                }
                            }, (r) => {
                                if (!resolved) {
                                    resolved = true;
                                    Promise._resolvePromise(promise, r);
                                }
                            });
                        }
                        catch (e) {
                            if (!resolved) {
                                resolved = true;
                                promise._state.state = prim.State.REJECTED;
                                promise._state.state = e;
                                promise._fullfillPromise();
                            }
                        }
                    }
                    else {
                        promise._fullfillPromise();
                    }
                }
                catch (e) {
                    promise._state.state = prim.State.REJECTED;
                    promise._state.state = e;
                    promise._fullfillPromise();
                }
            }
            else {
                promise._fullfillPromise();
            }
        }
    }

    /* Invoke an async callback */
    export function asap(target:any) {
        setTimeout(target, 0);
    }
}
