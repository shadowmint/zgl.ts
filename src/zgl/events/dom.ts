/// <reference path="__init__.ts"/>
module xn {
    export module dom {

        /* Browser agnostic remove events */
        export function removeEventListener(e:any, key:string, callback:any):void {
            if (e.removeEventListener) {
                e.removeEventListener(key, callback, false);
            }
            else if (e.detachEvent) {
                e.detachEvent('on' + key, callback);
            }
        }

        /* Browser agnostic add events */
        export function addEventListener(e:any, key:string, callback:any):void {
            if (e.addEventListener) {
                e.addEventListener(key, callback, false);
            }
            else if (e.attachEvent) {
                e.attachEvent('on' + key, callback);
            }
        }

        /* Reload the page periodically */
        export function reload(timeout:number):void {
            setTimeout(() => {
                xn.log("Reloading...");
                setTimeout(() => {
                    window.location.reload(true);
                }, timeout/2);
            }, timeout/2);
        }
    }
}
