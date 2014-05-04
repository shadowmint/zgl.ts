/// <reference path="__init__.ts"/>
module xn {
    export module assets {
        export class ImageLoader implements xn.assets.AssetLoader {
            load(url):xn.Promise {
                var def = new xn.Promise();
                var data = new Image();
                xn.dom.addEventListener(data, 'load', () => {
                    def.resolve(data);
                });
                xn.dom.addEventListener(data, 'error', (e) => {
                    def.reject(e);
                });
                data.src = url;
                return def;
            }
        }
    }
}
