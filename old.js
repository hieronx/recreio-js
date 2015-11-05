/**
 * RecreIO JavaScript Library
 * Copyright 2015, 42 Education
 * Released under the MIT license.
 */
(function() {

    var Promise = require("bluebird");

    window.RecreIO = window.RecreIO || {};
    var RecreIO = window.RecreIO;

    // Settings
    var API_URL = "https://api.recre.io/";
    var MOUSE_TRACKING_RATE = 10; // times per second

    // Globals functions
    RecreIO.globals = function() {

        var self = this;

        // Configuration of the plugin
        self.api_key = "LWSQBugvzYB5xS9ZV8y6xrurGZmqCqDb";
        self.appId = "1";

        this.request = function(type, path, data) {
            return new Promise(function(resolve, reject) {
                var httpRequest = new XMLHttpRequest();

                httpRequest.open(type, API_URL + path, true);
                httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                httpRequest.setRequestHeader("X-API-Key", self.api_key);
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

        this.getISODateString = function(d) {
            function pad (val, n) {
                var padder,
                    tempVal;
                if (typeof val === "undefined" || val === null) {
                    val = 0;
                }
                if (typeof n === "undefined" || n === null) {
                    n = 2;
                }
                padder = Math.pow(10, n-1);
                tempVal = val.toString();

                while (val < padder && padder > 1) {
                    tempVal = "0" + tempVal;
                    padder = padder / 10;
                }

                return tempVal;
            }

            return d.getUTCFullYear() + "-" +
                pad(d.getUTCMonth() + 1) + "-" +
                pad(d.getUTCDate()) + "T" +
                pad(d.getUTCHours()) + ":" +
                pad(d.getUTCMinutes()) + ":" +
                pad(d.getUTCSeconds()) + "." +
                pad(d.getUTCMilliseconds(), 3) + "Z";
        }
    };

    var globals = new RecreIO.globals();

    /**
     * [getAccount description]
     * @return {[type]} [description]
     */
    RecreIO.getAccount = function() {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'users/me').then(function(body) {
                var data = JSON.parse(body);
                resolve(data);

            }).catch(function(error) {
                console.error(error);
                reject(error);
            });
        });
    }

    /**
     * [signIn description]
     * @param  {[type]} provider [description]
     * @return {[type]}          [description]
     */
    RecreIO.signIn = function(provider) {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'auth/providers').then(function(url) {
                window.location.href = url;

            }).catch(function(error) {
                console.error(error);
                reject(error);
            });
        });
    }

    /**
     * [signIn description]
     * @param  {[type]} provider [description]
     * @return {[type]}          [description]
     */
    RecreIO.signInWithUsername = function(username, password) {
        return new Promise(function(resolve, reject) {
            globals.request('POST', 'auth/callback/password', { login: username, password: password, isUsername: true }).then(function(response) {
                resolve(JSON.parse(body));

            }).catch(function(error) {
                console.error(error);
                reject(error);
            });
        });
    }

    /**
     * [signIn description]
     * @param  {[type]} provider [description]
     * @return {[type]}          [description]
     */
    RecreIO.signInWithEmail = function(email, password) {
        return new Promise(function(resolve, reject) {
            globals.request('POST', 'auth/callback/password', { login: email, password: password, isUsername: false }).then(function(response) {
                resolve(JSON.parse(body));

            }).catch(function(error) {
                console.error(error);
                reject(error);
            });
        });
    }

    var exercises = [];
    var exerciseIndex = 0;

    /**
     * Get the next assigned exercise that hasn't been completed
     * @return Exercise
     */
    RecreIO.getNextExercise = function(template) {
        if (typeof template === 'undefined') { template = 'true-false'; }

        return new Promise(function(resolve, reject) {
            if (exercises.length == 0 || exerciseIndex == exercises.length - 1) {
                exerciseIndex = 0;

                globals.request('GET', 'users/me/exercises?template=' + template).then(function(body) {
                    exercises = JSON.parse(body);
                    resolve(new Exercise(exercises[0]));
                }).catch(function(error) {
                    console.error(error);
                    reject(error);
                });

            } else {
                exerciseIndex += 1;
                resolve(new Exercise(exercises[exerciseIndex]));
            }
        });
    }

    function Exercise(exercise) {
        this.template = exercise.template;
        this.pattern = exercise.pattern;
        this.instruction = exercise.instruction;
        this.curriculum = exercise.curriculum;

        var mousePosition = {};
        var mouseMovement = new Array();
        var mouseInterval = 0;

        var startTime: any;
        var endTime: any;
        var duration: any;

        this.handleMouseMove = function(event) {
            var dot, eventDoc, doc, body, pageX, pageY;

            event = event || window.event; // IE-ism

            // If pageX/Y aren't available and clientX/Y are,
            // calculate pageX/Y - logic taken from jQuery.
            // (This is to support old IE)
            if (event.pageX == null && event.clientX != null) {
                eventDoc = (event.target && event.target.ownerDocument) || document;
                doc = eventDoc.documentElement;
                body = eventDoc.body;

                event.pageX = event.clientX +
                  (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
                  (doc && doc.clientLeft || body && body.clientLeft || 0);
                event.pageY = event.clientY +
                  (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
                  (doc && doc.clientTop  || body && body.clientTop  || 0 );
            }

            mousePosition = {
                x: event.pageX,
                y: event.pageY
            };
        }
        this.getMousePosition = function() {
            if (mousePosition.x && mousePosition.y) {
                mouseMovement[mouseInterval] = { x: mousePosition.x, y: mousePosition.y }
                mouseInterval++;   
            }
        }

        this.begin = function() {
            // if (!user) {
            //     console.error("Not yet authenticated.")
            //     // return false;
            // }

            this.startTime = new Date().getTime();

            // Save mouse position 10 times per second
            document.onmousemove = this.handleMouseMove;
            this.mouseInterval = setInterval(this.getMousePosition, 1000 / MOUSE_TRACKING_RATE);

            RecreIO.getAccount().then(function(account) {
                user = account;
            }).catch(function(exception) {
                user = { id: 42, name: "John Doe" };
            });

            return this;
        }

        this.save = function(success) {
            if (!this.startTime) {
                console.error("Exercise hasn't started yet.")
                return false;
            }

            this.endTime = new Date().getTime();
            this.duration = this.endTime - this.startTime;

            clearInterval(this.mouseInterval);

            var statement = {
                actor: {
                    name: user.name,
                    account: {
                        id: user.id
                    }
                },
                verb: {
                    id: "completed"
                },
                object: {
                    id: exercise.id,
                    definition: {
                        name: ""
                    }
                },
                result: {
                    completion: true,
                    success: success,
                    duration: Math.floor(Math.abs(this.duration / 1000)) + "S"
                },
                context: {
                    extensions: {
                        app: globals.appId,
                        mouseMovement: mouseMovement
                    }
                },
                timestamp: globals.getISODateString(new Date())
            }

            globals.request('POST', 'statements', statement).then(function(body) {
                // do nothing
            }).catch(function(error) {
                console.error(error);
            });

            return statement;
        }
    }

    RecreIO.userStorage = function() {
        var self = this;
        var globals = new RecreIO.globals();

        RecreIO.getAccount().then(function(account) {
            user = account;
        }).catch(function(exception) {
            user = { id: 42, name: "John Doe" };
        });

        /**
         * [get description]
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
        this.get = function(key) {
            return new Promise(function(resolve, reject) {
                globals.request('GET', 'users/' + user.id + '/storage/' + key).then(function(data) {
                    var settings = JSON.parse(data);
                    
                    if (settings[key]) {
                        resolve(settings[key]);
                    } else {
                        reject("Unable to find a value for this key");
                    }

                }).catch(function(error) {
                    console.error(error);
                    reject(error);
                });
            });
        }

        /**
         * [set description]
         * @param {[type]} key   [description]
         * @param {[type]} value [description]
         */
        this.set = function(key, value) {
            return new Promise(function(resolve, reject) {
                var settings = {};
                settings[key] = value;

                globals.request('PUT', 'users/' + user.id + '/storage/' + key, settings).then(function(data) {
                    resolve(data);

                }).catch(function(error) {
                    console.error(error);
                    reject(error);
                });
            });
        }
    };

    window.RecreIO.userStorage = new RecreIO.userStorage();

})();