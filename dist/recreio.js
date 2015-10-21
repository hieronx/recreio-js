(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
            /** The host of the API. */
            this.API_URL = "https://api.recre.io/";
            /** The number of mouse frames tracked per second. */
            this.MOUSE_TRACKING_RATE = 10;
        }
        /**
         * ...
         */
        Client.prototype.sendRequest = function (method, to, payload) {
            var url = this.API_URL + to;
            var encodedPayload = JSON.stringify(payload);
            superagent(method, url)
                .type('application/json')
                .send(payload)
                .timeout(5000)
                .set('X-API-Key', this.apikey)
                .end(function (err, res) {
                if (res.ok) {
                    bluebird.resolve(res.body);
                }
                else {
                    bluebird.reject(res.body);
                }
            });
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
            return this.sendRequest('POST', '/auth/callback/password', payload);
        };
        ;
        /**
         * ...
         */
        Client.prototype.getAccount = function () {
            return this.sendRequest('GET', '/users/me');
        };
        ;
        /**
         * ...
         */
        Client.prototype.getNextExercise = function (template) {
            return this.sendRequest('GET', '/users/me/exercises?template=' + template);
        };
        ;
        return Client;
    })();
    RecreIO.Client = Client;
    ;
})(RecreIO || (RecreIO = {}));
;

},{}]},{},[1]);
