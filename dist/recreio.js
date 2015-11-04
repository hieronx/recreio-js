/**
 * recre.io JavaScript SDK
 * Copyright 2015, recre.io
 * Released under the MIT license.
 */
/// <reference path="../typings/superagent/superagent.d.ts" />
/// <reference path="../typings/bluebird/bluebird.d.ts" />
var RecreIO;
(function (RecreIO) {
    /**
     * ...
     */
    var Client = (function () {
        /**
         * Create a new RecreIO client with your API key.
         */
        function Client(apikey) {
            this.apikey = apikey;
        }
        /**
         * ...
         */
        Client.prototype.sendRequest = function (method, to, payload) {
            var promise = new Promise(function (resolve, reject) {
                var httpRequest = new XMLHttpRequest();
                var url = 'https://api.recre.io/' + to;
                var encodedPayload = JSON.stringify(payload);
                httpRequest.open(method, url, true);
                httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                httpRequest.setRequestHeader("X-API-Key", 'wzHb9a2YjLPQWAMyxSSjLuy9XsPAV3e3');
                httpRequest.withCredentials = true; // Send cookies with CORS requests
                httpRequest.send(encodedPayload);
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200) {
                            resolve(httpRequest.responseText);
                        }
                        else {
                            reject(httpRequest.status);
                        }
                    }
                };
            });
            return promise.bind({ apiKey: this.apikey, apiUrl: 'https://api.recre.io/' });
        };
        /**
         * ...
         */
        Client.prototype.signInWithUsername = function (username, password) {
            var payload = {
                login: username,
                password: password,
                isUsername: true
            };
            return this.sendRequest('POST', 'auth/callback/password', payload);
        };
        /**
         * ...
         */
        Client.prototype.getAccount = function () {
            return this.sendRequest('GET', 'users/me');
        };
        /**
         * ...
         */
        Client.prototype.getNextExercise = function (template, soundEnabled) {
            if (soundEnabled === void 0) { soundEnabled = false; }
            return this.sendRequest('GET', 'users/me/exercises?template=' + template + '&sound=' + soundEnabled);
        };
        /** The host of the API. */
        Client.API_URL = "https://api.recre.io/";
        /** The number of mouse frames tracked per second. */
        Client.MOUSE_TRACKING_RATE = 10;
        return Client;
    })();
    RecreIO.Client = Client;
    ;
})(RecreIO || (RecreIO = {}));
;
