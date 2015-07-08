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

        /* Create an error object */
        this.errorResponse = function(title, message, code) {
            return { title: title, message: message, code: code };
        }

        this.request = function(type, path, data) {
            return new Promise(function(resolve, reject) {
                var httpRequest = new XMLHttpRequest();

                httpRequest.open(type, self.url + path, true);
                httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                httpRequest.withCredentials = true;

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

        /* Gets value from querystring */
        this.queryString = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
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
            globals.request('GET', '/users/me/assignments?status=open').then(function(body) {
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
            globals.request('GET', 'settings/me/apps/5bb424af3a8f20607ab384db88ea9ec0').then(function(data) {
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

            globals.request('PUT', 'settings/me/apps/5bb424af3a8f20607ab384db88ea9ec0', settings).then(function(data) {
                resolve(data);

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

})();