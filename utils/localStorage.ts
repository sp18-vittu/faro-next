import ls from "localstorage-slim";

class FaroLocalStorage {
    _prefix: string = '';
    _ttl: number = 1 * 24 * 60 * 60;
    constructor(storefrontTitle: string, rememberMeDurationInDays: number) {
        // // enable encryption
        // ls.config.encrypt = true;
        // // set a global secret
        // ls.config.secret = 'faro-storefront';
        this._prefix = storefrontTitle.toLowerCase();
        this._ttl = rememberMeDurationInDays * 24 * 60 * 60;
    }

    getItem = (name: string): any | null => {
        return ls.get(`${this._prefix}-${name}`);
    }

    setItem = (name: string, value: any, ttl?: Number) => {
        ls.set(`${this._prefix}-${name}`, value, {ttl: this._ttl})
    }

    removeItem = (name: string) => {
        ls.remove(`${this._prefix}-${name}`);
    }
}

export { FaroLocalStorage };