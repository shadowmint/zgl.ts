/// <reference path="../__init__.ts"/>
/// <reference path="handler.ts"/>
/// <reference path="dummy_logger.ts"/>
/// <reference path="console_logger.ts"/>
/// <reference path="redirect_logger.ts"/>
/// <reference path="document_logger.ts"/>
module xn {
    export module logger {

        /* Public logger handle; allows rebinding in init */
        var _logger:RedirectLogger;

        /**
         * Returns the logger implementation.
         * If no impl is provided, the dummy logger is used.
         * @param impl The logger Handler implementation if required.
         */
        export function init(impl:any) {
            var logger = get();
            logger.target = impl;
        }

        /**
         * Returns the logger implementation.
         * If no impl is provided, the dummy logger is used.
         */
        export function get():RedirectLogger {
            if (_logger == null) {
                _logger = new xn.logger.RedirectLogger();
            }
            return _logger;
        }
    }

    /* Public logger instance for anyone to use */
    export var console:xn.logger.RedirectLogger = <xn.logger.RedirectLogger> xn.logger.get();

    /* A simple info trace helper */
    export function log(...msgs:any[]):void {
        for (var i = 0; i < msgs.length; ++i) {
            xn.console.info(msgs[i]);
        }
    }

    /* Print all properties on a target */
    export function dump(target:any):string {
        try {
            return JSON.stringify(target);
        }
        catch(e) {
            return('Failed to iterate over target: ' + e);
        }
    }
}

