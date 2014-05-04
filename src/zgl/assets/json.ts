/// <reference path="__init__.ts"/>
module xn {
    export module assets {
        export class JsonLoader implements xn.assets.AssetLoader {
            load(url):xn.Promise {
                var def = new xn.Promise();
                var request = new xn.Xhr();
                request.open('GET', url);
                request.send().then((data) => {
                    try {
                        var data = JSON.parse(data);
                        def.resolve(data);
                    }
                    catch(e) {
                        def.reject(e);
                    }
                }, (reason) => {
                    def.reject(reason);
                });
                return def;
            }
        }
    }
}
