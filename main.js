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
        self.version = "v1";
        self.client_id = "FaQg1U6Krm";
        self.client_secret = "914acd359adc4dc968aa433cbc4ac6c5a3a48b7bade6b4512550a77df5fac651c4d0d272d2a08d03ce9088cb18265ba1";
        self.redirect_uri = null;

        self.db_name = "db-42education";

        /* Create an error object */
        this.errorResponse = function(title, message, code) {
            return { title: title, message: message, code: code };
        }

        this.request = function(type, path, data) {
            return new Promise(function(resolve, reject) {
                var httpRequest = new XMLHttpRequest();
                httpRequest.open(type, self.url + self.version + "/" + path, true);
                httpRequest.send(data);

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

    /* User management */
    FortyTwo.User = function() {

        var globals = new FortyTwo.globals();

        // Users methods

        /* simple method for registering a user */
        this.register = function(success, error) {
            globals.request("PUT", "register", success, error);

        }

        var login = function(error) {
            globals.request("PUT", "login", function(data) {
                if (data.status = 'success') {
                    window.location = this.url + 'dialog/authorize?client_id=' + this.client_id + '&redirect_uri='+ this.redirect_uri + '&response_type=code';
                }
            }, function(status) {
               error(status);
            });
        }

        /* method for verifying user login based on session */
        var verifyCode = function(success, error, data) {
            if (globals.queryString("code") != undefined) {
                globals.request("PUT", "oauth/token", success, error, data);

            } else {
                error(globals.errorResponse("No code", "No code in querystring", 1));
            }
        }

    };

    /* Unit */
    FortyTwo.Unit = function() {
        var self = this;
        var globals = new FortyTwo.globals();

        // Retrieve all units
        this.all = function() {
            return new Promise(function(resolve, reject) {
                globals.request('GET', 'units').then(function(body) {
                    var data = JSON.parse(body);
                    resolve(data);

                }).catch(function(error) {
                    console.log(error);
                    reject(error);
                });
            });
        }

        // Find a unit
        this.find = function(id) {
            return new Promise(function(resolve, reject) {
                globals.request('GET', 'units/' + id).then(function(body) {
                    var data = JSON.parse(body);
                    resolve(data);

                }).catch(function(error) {
                    console.log(error);
                    reject(error);
                });
            });
        }

        // Update a unit
        this.find = function(id, updatedParams) {
            return new Promise(function(resolve, reject) {
                globals.request('PUT', 'units/' + id, updatedParams).then(function(body) {
                    var data = JSON.parse(body);
                    resolve(data);

                }).catch(function(error) {
                    console.log(error);
                    reject(error);
                });
            });
        }
    };

    /* Group management */
    FortyTwo.Group = function() {

    };

    /* Statements  */
    FortyTwo.Statement = function() {

    };

    window.FortyTwo.User = new FortyTwo.User();
    window.FortyTwo.Unit = new FortyTwo.Unit();
    window.FortyTwo.Group = new FortyTwo.Group();
    window.FortyTwo.Statement = new FortyTwo.Statement();

})();