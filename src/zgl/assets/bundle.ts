/// <reference path="__init__.ts"/>
module xn {

    /*
     * Handles loading groups of assets
     *
     * It can be convenient to load a group of assets all at once.
     * To do this, extend bundler and give the subclass a set of public
     * properties that are of type any with a value:
     *
     *      [type, data]
     *
     * Where type is one of AssetType and data is as appropriate for the type;
     * usually a url. The Bundle.key() shortcut exists for formatting these
     * correctly:
     *
     *      public mything:any = Bundle.key(AssetType.IMAGE, '/blah/image.png');
     *      public myjson:any = Bundle.key(AssetType.JSON//png, '/blah/images.json');
     *      public mybundle:any = Bundle.key(AssetType.BUNDLE, OtherBundle);
     *
     * Bundle load is recursive and will break things if you have cycles in
     * the binding of child-parents.
     */
    export class Bundle {

        /* The asset manager this bundle uses  */
        private _assets:xn.Assets;

        /* Counter of waiting objects */
        private _total:number;
        private _loaded:number;

        constructor(url:string) {
            this._assets = new xn.Assets(url);
            this._total = 0;
            this._loaded = 0;
        }

        /*
         * Loads and then resolves with the Bundle
         * @param T The bundle type to load.
         * @param url The base url to assets.
         * @param ticks A callback invoked everytime an asset is loaded.
         */
        public static load(T:any, url:string = '/', ticks:{(e:TickEvent):void} = null):xn.Promise {
            var i = xn.data.make<Bundle>(T, [url]);
            return i.reload(ticks);
        }

        /* Generate an appropriate key */
        public static key(T:xn.AssetType, data:any):any {
            return [T, data];
        }

        /* Parse as a valid asset type */
        private _asType(v:any):xn.AssetType {
            var rtn = xn.AssetType.UNKNOWN;
            try {
                rtn = <xn.AssetType> Number(v);
            }
            catch(e) {
            }
            return rtn;
        }

        /* Load the assets for this instance */
        public reload(ticks:{(e:TickEvent):void}):xn.Promise {
            var def = new xn.Promise();
            for (var key in this) {
                var value = this[key];
                if (value instanceof Array) {
                    try {
                        var t = this._asType(value[0]);
                        var v = value[1];
                        if (t == xn.AssetType.BUNDLE) {
                            this._loadBundle(key, v, t, def, ticks);
                        }
                        else {
                            this._loadAsset(key, v, t, def, ticks);
                        }
                        this._total += 1;
                    }
                    catch(e) {
                        xn.log("Error invoking bundler", e);
                    }
                }
            }
            return def;
        }

        /* Dispatch a tick event */
        private _dispatchTick(asset:Asset, promise:xn.Promise, handler:{(e:TickEvent):void}) {
            handler({
                bundle: this,
                assetsLoaded: this._loaded,
                assetsTotal: this._total,
                asset: asset
            });
            if (this._loaded == this._total) {
                promise.resolve(this);
            }
        }

        /* Load an actual asset */
        private _loadAsset(key:string, url:string, t:xn.AssetType, promise:xn.Promise, handler:{(e:TickEvent):void}):void {
            this._assets.load(url, t).then((asset) => {
                this._loaded += 1;
                this[key] = asset.data;
                this._dispatchTick(asset, promise, handler);
            });
        }

        /* Load a bundle */
        private _loadBundle(key:string, target:any, t:xn.AssetType, promise:xn.Promise, handler:{(e:TickEvent):void}):void {
            Bundle.load(target, this._assets.prefix, handler).then((bundle) => {
                this._loaded += 1;
                var asset = {
                    url: null,
                    data: bundle,
                    type: xn.AssetType.BUNDLE
                };
                this[key] = bundle;
                this._dispatchTick(asset, promise, handler);
            });
        }
    }

    /* The event type for the ticks callback */
    export interface TickEvent {
        bundle:Bundle;
        assetsLoaded:number;
        assetsTotal:number;
        asset:Asset;
    }
}
