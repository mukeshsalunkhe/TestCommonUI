import { Injectable } from "@angular/core";
@Injectable()
export class LoggerService {
    private isProduction: boolean = false;
    private noop = () => { };
    setProductionFlag(flag: boolean = false) {
        this.isProduction = flag;
    }
    constructor() {
    }
    get debug() {
        if (!this.isProduction) {
            return console.debug.bind(console);
        } else {
            return this.noop;
        }

    }
    get error() {
        return console.error.bind(console);
    }
    /* get log() {
        if (this.isProduction) return console.log.bind(console);
        return this.noop;
    } */
    get info() {
        return console.info.bind(console);
    }
    get warn() {
        return console.warn.bind(console);
    }
}