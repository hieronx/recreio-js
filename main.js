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
        this.name = unit.name;

        this.objects = [];
        for (var objectKey in unit.objects) {
            this.objects.push(new LearningObject(unit.objects[objectKey]));
        }

        this.begin = function() {
            this.startTime = new Date().getTime();
        }

        this.end = function() {
            this.endTime = new Date().getTime();
            this.duration = this.endTime - this.startTime;

            console.log(this.name + " took you " + this.duration + "s");
        }
    }

    function LearningObject(learningObject) {
        this.template = learningObject.template;
        this.subtemplate = learningObject.subtemplate;

        this.preInstruction = learningObject.preInstruction;
        this.instruction = learningObject.instruction;
        this.postInstruction = learningObject.postInstruction;

        this.options = learningObject.options;
        this.answer = learningObject.answer;
        this.image = learningObject.image;
        this.active = learningObject.active;

        this.save = function(result) {
            if (result == this.answer) {
                console.log("That's right!");

            } else {
                console.log("Hmm, that's wrong..");
            }
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