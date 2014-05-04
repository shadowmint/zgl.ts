/// <reference path="__init__.ts"/>
module xn {
    export module data {

        /*
         * Make an instance from a class object
         * @param t The class to make one of
         * @param args The constructor arguments
         */
        export function make<T>(t:any, args:any[] = []):T {
            var instance = Object.create(t.prototype);
            instance.constructor.apply(instance, args);
            return instance;
        }

        /* Check if an object t has property prop which is not a method */
        export function has(obj:any, prop:any):boolean {
            var proto = obj.__proto__ || obj.constructor.prototype;
            return (prop in obj) && (!(prop in proto) || proto[prop] !== obj[prop]);
        }

        /* Return the value of a property, with default value */
        export function get(obj:any, prop:any, defaultValue:any = null):any {
            return has(obj, prop) ? obj[prop] : defaultValue;
        }

    }
}
