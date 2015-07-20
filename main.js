/**
 * FortyTwo JavaScript Library
 * Copyright 2015, 42 Education
 * Released under the MIT license.
 */
(function() {

    var Promise = require("bluebird");

    window.FortyTwo = window.FortyTwo || {};
    var FortyTwo = window.FortyTwo;

    // Settings
    var API_URL = "http://api.42education.com/";
    var MOUSE_TRACKING_RATE = 10; // times per second

    // Globals functions
    FortyTwo.globals = function() {

        var self = this;

        // Configuration of the plugin
        self.api_key = "abcdef";
        self.appId = "5bb424af3a8f20607ab384db88ea9ec0";
        self.appName = "flashcards";

        this.request = function(type, path, data) {
            return new Promise(function(resolve, reject) {
                var httpRequest = new XMLHttpRequest();

                httpRequest.open(type, API_URL + path, true);
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

    var globals = new FortyTwo.globals();

    /**
     * [getAccount description]
     * @return {[type]} [description]
     */
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

    /**
     * [signIn description]
     * @param  {[type]} provider [description]
     * @return {[type]}          [description]
     */
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

    /**
     * Get the next assigned unit that hasn't been completed
     * @return Unit
     */
    FortyTwo.getNextUnit = function() {
        return new Promise(function(resolve, reject) {
            var data = {
                "name": "unit",
                "id": "c32d2b9351c318db70c87693b435edfa",
                "inLanguage": "NL",
                "typicalAgeRange": "10-12",
                "objects": [
                    {
                      "template": "multiple-choice",
                      "subtemplate": "choose-the-verb",
                      "preInstruction": "Choose the verb",
                      "answer": "talk",
                      "image": "https://assets.42education.com/home1.jpg",
                      "options": ["boy", "apple", "talk", "car"],
                      "active": true
                    }
                ],
                "alignments": [
                    {
                        "name": "CCSS.ELA-Literacy.RST.11-12.3",
                        "url": "http://www.corestandards.org/ELA-Literacy/RST/11-12/3",
                        "description": "Follow precisely a complex multistep procedure when carrying out experiments, taking measurements, or performing technical tasks; analyze the specific results based on explanations in the text."
                    }
                ]
            };

            resolve(new Unit(data));

            // TODO: change path to users/me/assignments?status=open
            globals.request('GET', 'units').then(function(body) {
                resolve(new Unit(JSON.parse(body)));
            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    function Unit(unit) {
        this.id = unit.id;
        this.name = unit.name;

        this.objects = [];
        for (var objectKey in unit.objects) {
            this.objects.push(new LearningObject(unit, unit.objects[objectKey]));
        }
    }

    function LearningObject(parentUnit, learningObject) {
        var user = {};
        var unit = parentUnit;

        this.template = learningObject.template;
        this.subtemplate = learningObject.subtemplate;

        this.preInstruction = learningObject.preInstruction;
        this.instruction = learningObject.instruction;
        this.postInstruction = learningObject.postInstruction;

        this.options = learningObject.options;
        this.answer = learningObject.answer;
        this.image = learningObject.image;
        this.active = learningObject.active;

        var mousePosition = {};
        var mouseMovement = new Array();
        var mouseInterval = 0;

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
            if (!user) {
                console.error("Not yet authenticated.")
                // return false;
            }

            this.startTime = new Date().getTime();

            // Save mouse position 10 times per second
            document.onmousemove = this.handleMouseMove;
            this.mouseInterval = setInterval(this.getMousePosition, 1000 / MOUSE_TRACKING_RATE);

            FortyTwo.getAccount().then(function(account) {
                user = account;
            }).error(function(error) {
                user = { id: 42, name: "John Doe" };
            });

            return this;
        }

        this.save = function(result) {
            if (!this.startTime) {
                console.error("Learning object hasn't started yet.")
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
                    id: unit.id,
                    definition: {
                        name: unit.name
                    }
                },
                result: {
                    completion: true,
                    success: (result == this.answer),
                    duration: Math.floor(Math.abs(this.duration / 1000)) + "S"
                },
                context: {
                    extensions: {
                        app: globals.appName,
                        mouseMovement: mouseMovement
                    }
                },
                timestamp: globals.getISODateString(new Date())
            }

            return statement;
        }
    }

    /**
     * [findUnit description]
     * @param  Integer id 
     * @return Unit
     */
    FortyTwo.getUnit = function(id) {
        return new Promise(function(resolve, reject) {
            globals.request('GET', 'units/' + id).then(function(data) {
                resolve(new Unit(JSON.parse(data)));

            }).catch(function(error) {
                console.log(error);
                reject(error);
            });
        });
    }

    FortyTwo.userStorage = function() {
        var self = this;
        var globals = new FortyTwo.globals();

        /**
         * [get description]
         * @param  {[type]} key [description]
         * @return {[type]}     [description]
         */
        this.get = function(key) {
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

        /**
         * [set description]
         * @param {[type]} key   [description]
         * @param {[type]} value [description]
         */
        this.set = function(key, value) {
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
    };

    window.FortyTwo.userStorage = new FortyTwo.userStorage();

})();