/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */
var RecreIO;
(function (RecreIO) {
    var Exercise = (function () {
        function Exercise(client, currentUser, template, soundEnabled, exercise) {
            var _this = this;
            if (template === void 0) { template = 'true-false'; }
            if (soundEnabled === void 0) { soundEnabled = false; }
            this.client = client;
            this.currentUser = currentUser;
            this.template = template;
            this.soundEnabled = soundEnabled;
            this.exercise = exercise;
            this.mousePosition = {};
            this.mouseMovement = [];
            this.mouseInterval = 0;
            this.begin = function () {
                _this.startTime = new Date().getTime();
                // Save mouse position 10 times per second
                document.onmousemove = _this.handleMouseMove;
                _this.mouseInterval = setInterval(_this.getMousePosition, 1000 / _this.client.MOUSE_TRACKING_RATE);
                if (_this.soundEnabled && _this.content.sound) {
                    var instructionUtterance = new SpeechSynthesisUtterance();
                    instructionUtterance.text = _this.instruction;
                    instructionUtterance.lang = _this.currentUser.language;
                    instructionUtterance.rate = 1;
                    speechSynthesis.speak(instructionUtterance);
                    var contentUtterance = new SpeechSynthesisUtterance();
                    contentUtterance.text = _this.content.sound;
                    contentUtterance.lang = _this.currentUser.language;
                    contentUtterance.rate = 1;
                    speechSynthesis.speak(contentUtterance);
                }
                _this.isTesting = (_this.getParameterByName('testing') == 'true');
                return _this;
            };
            this.save = function (success) {
                if (!_this.startTime) {
                    console.error("Exercise hasn't started yet.");
                    return false;
                }
                if (_this.isTesting) {
                    console.log("Results are not saved when in testing mode.");
                    return false;
                }
                _this.endTime = new Date().getTime();
                _this.duration = _this.endTime - _this.startTime;
                clearInterval(_this.mouseInterval);
                var statement = {
                    id: _this.id,
                    knowledgeObjectId: _this.knowledgeObjectId,
                    template: _this.template,
                    success: success,
                    sentAt: new Date().toISOString(),
                    processedAt: new Date().toISOString(),
                    context: {
                        duration: _this.duration / 1000,
                        mouseMovement: _this.mouseMovement
                    },
                    instruction: _this.instruction,
                    content: _this.content
                };
                _this.client.sendRequest('POST', 'statements', statement).then(function (body) {
                    // do nothing
                }).catch(function (error) {
                    console.error(error);
                });
                return statement;
            };
            this.handleMouseMove = function (event) {
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
                        (doc && doc.scrollTop || body && body.scrollTop || 0) -
                        (doc && doc.clientTop || body && body.clientTop || 0);
                }
                _this.mousePosition = {
                    x: event.pageX,
                    y: event.pageY
                };
            };
            this.getMousePosition = function () {
                if (_this.mousePosition && _this.mousePosition.x && _this.mousePosition.y) {
                    _this.mouseMovement[_this.mouseInterval] = { x: _this.mousePosition.x, y: _this.mousePosition.y };
                    _this.mouseInterval++;
                }
            };
            this.getParameterByName = function (name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            };
            for (var k in exercise)
                this[k] = exercise[k];
            delete this.exercise;
        }
        return Exercise;
    })();
    RecreIO.Exercise = Exercise;
})(RecreIO || (RecreIO = {}));
/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */
var RecreIO;
(function (RecreIO) {
    var ContentQuery = (function () {
        function ContentQuery(client) {
            var _this = this;
            this.client = client;
            // content type
            this._templates = [];
            this._patterns = [];
            // settings
            this._grouped = false;
            this._sound = false;
            this.templates = function (templates) {
                _this._templates = templates;
                return _this;
            };
            this.patterns = function (patterns) {
                _this._patterns = patterns;
                return _this;
            };
            this.type = function (type) {
                _this._type = type;
                return _this;
            };
            this.grouped = function (grouped) {
                if (grouped === void 0) { grouped = true; }
                _this._grouped = grouped;
                return _this;
            };
            this.limit = function (limit) {
                _this._limit = limit;
                return _this;
            };
            this.sound = function (sound) {
                _this._sound = sound;
                return _this;
            };
            this.get = function () {
                return new Promise(function (resolve, reject) {
                    var exerciseParams = {};
                    if (_this._templates.length > 0)
                        exerciseParams.templates = _this._templates;
                    if (_this._patterns.length > 0)
                        exerciseParams.patterns = _this._patterns;
                    if (_this._type)
                        exerciseParams.type = _this._type;
                    if (_this._grouped)
                        exerciseParams.grouped = _this._grouped;
                    if (_this._limit)
                        exerciseParams.limit = _this._limit;
                    if (_this._sound)
                        exerciseParams.sound = _this._sound;
                    console.log(exerciseParams);
                    _this.client.sendRequest('GET', 'users/me/exercises', exerciseParams).then(function (body) {
                        var data = JSON.parse(body);
                        var exercises = [];
                        data.forEach(function (exercise) {
                            exercises.push(new RecreIO.Exercise(_this.client, _this.client.currentUser, exercise.template, _this._sound, exercise));
                        });
                        resolve(exercises);
                    }).catch(function (error) {
                        reject(error);
                    });
                });
            };
        }
        return ContentQuery;
    })();
    RecreIO.ContentQuery = ContentQuery;
})(RecreIO || (RecreIO = {}));
/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */
/// <reference path="../typings/bluebird/bluebird.d.ts" />
/// <reference path="../typings/webspeechapi/webspeechapi.d.ts" />
/// <reference path="Exercise.ts" />
/// <reference path="ContentQuery.ts" />
var RecreIO;
(function (RecreIO) {
    var Client = (function () {
        /**
         * Create a new RecreIO client with your API key.
         */
        function Client(apiKey) {
            var _this = this;
            this.apiKey = apiKey;
            this.appId = 1;
            /**
             * ...
             */
            this.sendRequest = function (method, to, payload) {
                return new Promise(function (resolve, reject) {
                    console.log(payload);
                    var httpRequest = new XMLHttpRequest();
                    var url = 'https://api.recre.io/' + to;
                    var encodedPayload = JSON.stringify(payload);
                    console.log(encodedPayload);
                    httpRequest.open(method, url, true);
                    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    httpRequest.setRequestHeader("X-API-Key", _this.apiKey);
                    httpRequest.withCredentials = true; // Send cookies with CORS requests
                    httpRequest.send(encodedPayload);
                    console.log(httpRequest);
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
            };
            /**
             * ...
             */
            this.signInWithUsername = function (username, password) {
                var payload = {
                    login: username,
                    password: password,
                    isUsername: true
                };
                return _this.sendRequest('POST', 'auth/callback/password', payload);
            };
            /**
             * ...
             */
            this.getAccount = function () {
                return new Promise(function (resolve, reject) {
                    _this.sendRequest('GET', 'users/me').then(function (body) {
                        var data = JSON.parse(body);
                        _this.currentUser = data;
                        _this.currentUserGroups = data.groups;
                        resolve(data);
                    }).catch(function (error) {
                        console.error(error);
                        reject(error);
                    });
                });
            };
            this.exercises = [];
            this.exerciseIndex = 0;
            /**
             * ...
             */
            this.getNextExercise = function (template, soundEnabled) {
                if (template === void 0) { template = 'true-false'; }
                if (soundEnabled === void 0) { soundEnabled = false; }
                return new Promise(function (resolve, reject) {
                    if (_this.exercises.length == 0 || _this.exerciseIndex == _this.exercises.length - 1) {
                        _this.exerciseIndex = 0;
                        _this.sendRequest('GET', 'users/me/exercises?template=' + template + '&sound=' + soundEnabled).then(function (body) {
                            _this.exercises = JSON.parse(body);
                            resolve(new RecreIO.Exercise(_this, _this.currentUser, template, soundEnabled, _this.exercises[0]));
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                    else {
                        _this.exerciseIndex += 1;
                        resolve(new RecreIO.Exercise(_this, _this.currentUser, template, soundEnabled, _this.exercises[_this.exerciseIndex]));
                    }
                });
            };
            /**
             *
             */
            this.content = function () {
                return new RecreIO.ContentQuery(_this);
            };
            this.getAccount();
        }
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
