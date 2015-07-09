/**
 * FortyTwo JavaScript Library
 * Copyright 2015, 42 Education
 * Released under the MIT license.
 */
(function() {

    var Promise = require("bluebird");

    window.FortyTwo = window.FortyTwo || {};
    var FortyTwo = window.FortyTwo;

    // Globals functions
    FortyTwo.globals = function() {

        var self = this;

        // Configuration of the plugin
        self.url = "http://api.42education.com/";
        self.api_key = "abcdef";
        self.appId = "5bb424af3a8f20607ab384db88ea9ec0";

        this.request = function(type, path, data) {
            return new Promise(function(resolve, reject) {
                var httpRequest = new XMLHttpRequest();

                httpRequest.open(type, self.url + path, true);
                httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                httpRequest.setRequestHeader("X-42-Key", self.api_key);
                httpRequest.withCredentials = true; // Send cookies with CORS requests

                httpRequest.send(JSON.stringify(data));

                httpRequest.onreadystatechange = function() {
                    if (httpRequest.readyState === 4) {
                        if (httpRequest.status === 200) {
                            resolve(httpRequest.responseText);
                        } else {
                            reject(httpRequest.status);
                        }
                    }
                }
            });
        }
    };

    var globals = new FortyTwo.globals();

    FortyTwo.getAccount = function() {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'users/me').then(function(body) {
                var data = JSON.parse(body);
                resolve(data);

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    FortyTwo.signIn = function(provider) {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'auth/providers').then(function(url) {
                window.location.href = url;

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    FortyTwo.getNextUnit = function() {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'units').then(function(body) {
                var data = JSON.parse(body);
                resolve(data[0]);

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    FortyTwo.getAssignedUnits = function() {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'users/me/assignments?status=open').then(function(body) {
                var data = JSON.parse(body);
                resolve(data);

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    FortyTwo.findUnit = function(id) {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'units/' + id).then(function(data) {
                resolve(JSON.parse(data));

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }


    FortyTwo.get = function(key) {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'settings/me/apps/' + globals.appId).then(function(data) {
                var settings = JSON.parse(data);
                
                if (settings[key]) {
                    resolve(settings[key]);
                } else {
                    reject("Unable to find a value for this key");
                }

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    FortyTwo.set = function(key, value) {
        return new Promise(function(resolve, reject) {
            var settings = {};
            settings[key] = value;

            globals.request('PUT', 'settings/me/apps/' + globals.appId, settings).then(function(data) {
                resolve(data);

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

})();