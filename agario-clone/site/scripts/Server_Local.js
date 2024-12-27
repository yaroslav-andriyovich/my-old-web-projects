export default class LocalServer {
    constructor() {
        if (LocalServer.instance) {
            return LocalServer.instance;
        }
        LocalServer.instance = this;
        console.log("LocalServer initialized.");
    }
}
LocalServer.instance = null;
;
