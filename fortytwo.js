/**
 * FortyTwo JavaScript Library
 * Copyright 2015, 42 Education
 * Released under the MIT license.
 */
(function() {

    window.FortyTwo = window.FortyTwo || {};
    var FortyTwo = window.FortyTwo;

    // Configuration of the plugin
    url: "http://api.42education.com/";
    version: "v1";
    client_id: "FaQg1U6Krm";
    client_secret: "914acd359adc4dc968aa433cbc4ac6c5a3a48b7bade6b4512550a77df5fac651c4d0d272d2a08d03ce9088cb18265ba1";
    redirect_uri: null;

    db_name: "db-42education";

    // Globals functions
    FortyTwo.globals = function() {

        var self = this;

        /* Create an error object */
        this.errorResponse = function(title, message, code) {
            return { title: title, message: message, code: code };
        }

        this.request = function(type, path, callback, error, data) {

            var req = new XMLHttpRequest();
            req.open(type, this.url + version + "/" + path, true);
            req.send(data);

            req.onreadystatechange = function() {
                if (req.readyState === 4) {
                    if (req.status === 200) {
                        callback(req.responseText);
                        console.log(req.responseText)
                    } else {
                        error(self.errorResponse("", req.statusText, -1));
                    }
                }
            }
        }

        /* Gets value from querystring */
        this.queryString = function(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

        var db = new PouchDB(this.db_name);

        this.put = function(document) {
            self.db.put(document);
        }

        this.get = function(id, callback) {
            self.db.get(id).then(function (doc) {
              callback(doc);
            });
        }
    };

    /* User management */
    FortyTwo.user = function() {

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

        var globals = new FortyTwo.globals();

        // Retrieve all units
        function all(success, error) {
            globals.request("GET", "units", function(data) {
                console.log(data.rows);
                success(data.rows);
            }, error);
        }

        this.all = all;

        return this;

    };

    /* Group management */
    FortyTwo.Group = function() {

    };

    /* Statements  */
    FortyTwo.Statement = function() {

    };

})();