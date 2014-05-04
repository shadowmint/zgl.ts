/// <reference path="__init__.ts"/>
module xn {


    /* Known types of assets */
    export enum AssetType {
        UNKNOWN,
        JSON,
        IMAGE,
        BUNDLE
    }

    /* An individual asset */
    export interface Asset {
        data:any;
        url:string;
        type:AssetType;
    }

    /* Path controlled asset loader */
    export class Assets {

        /* Path prefix for assets to load */
        public prefix:string;

        /* The set of known bindings for asset types */
        private _types:any = {};

        /* Create an instance with a given root prefix for assets */
        constructor(root:string) {
            root = root.replace(/^\/*/, '');
            root = root.replace(/\/*$/, '');
            this.prefix = '/' + root + '/';
            this.prefix = this.prefix.replace('//', '/');
            this._types[AssetType.IMAGE] = xn.assets.ImageLoader;
            this._types[AssetType.JSON] = xn.assets.JsonLoader;
        }

        /* Get the current binding */
        private _binding(type:AssetType):any {
            var rtn = <xn.assets.AssetLoader> this._types[type];
            rtn = rtn ? rtn : null;
            return rtn;
        }

        /* Load all the assets async and dispatch an event when they're ready */
        public load(url:string, type:AssetType):xn.Promise {
            var factory = this._binding(type);
            if (!factory) {
                throw xn.error("Invalid type: '" + type +"' is not a known asset type");
            }
            var def = new xn.Promise();
            var loader = xn.data.make<xn.assets.AssetLoader>(factory);
            loader.load(this._url(url)).then((data) => {
                var asset = <Asset> { type: type, url: url, data: data };
                def.resolve(asset);
            });
            return def;
        }

        /* Make url specific to this asset loader */
        private _url(url:string):string {
            url = url.replace(/^\/*/, '');
            url = this.prefix + url;
            return url;
        }
    }
}
