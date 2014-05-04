/// <reference path="__init__.ts"/>
module xn {
    export module assets {

        /*
         * Loader for a specific asset type
         * When the asset is loaded a data object should be used to resolve the promise.
         */
        export interface AssetLoader {
            load(url):xn.Promise;
        }
    }
}
