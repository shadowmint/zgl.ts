/// <reference path="__init__.ts"/>
module xn {

    /* A single event binding */
    export class EventBinding {

        /* The callback */
        handler:any;

        /* The event removal token */
        token:any;

        /* The event type */
        type:any;

        /* The target for this event */
        target:any;

        constructor(target:any, type:string, handler:{(e:any):boolean}) {
            this.target= target;
            this.type = type;
            this.handler = handler;
            this.token = null;
        }

        /* Add/remove this event target */
        public setActive(active:boolean = true):void {
            if ((active) && (!this.token)) {
                this.token = (e) => {  e = e || window.event; return this.handler(e);  };
                xn.dom.addEventListener(this.target, this.type, this.token);
            }
            else if ((!active) && this.token) {
                xn.dom.removeEventListener(this.target, this.type, this.token);
            }
        }
    }

    /* A collection of events which can easily be turned on or off */
    export class Events {

        /* Set of bindings we currently have */
        public bindings:xn.List<EventBinding> = new xn.List<EventBinding>();

        /*
         * Add an event binding
         * @param target The target element to attach an event to.
         * @param event The event code; eg. keydown
         * @param handler The callback to invoke when the event happens.
         * @return This call returns the object itself to as to be chainable.
         */
        public bind(target:any, event:string, handler:{(e:any):boolean}):Events {
            this.bindings.push(new EventBinding(target, event, handler));
            return this;
        }

        /* Turn all events on */
        public activate():void {
            this.bindings.each((b:EventBinding) => { b.setActive(true); });
        }

        /* Turn all events off */
        public clear():void {
            this.bindings.each((b:EventBinding) => { b.setActive(false); });
        }
    }
}
