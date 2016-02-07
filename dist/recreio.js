/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */
var RecreIO;
(function (RecreIO) {
    var Exercise = (function () {
        function Exercise(client, currentUser, exercise, template, soundEnabled, timed) {
            var _this = this;
            if (template === void 0) { template = 'true-false'; }
            if (soundEnabled === void 0) { soundEnabled = false; }
            if (timed === void 0) { timed = false; }
            this.client = client;
            this.currentUser = currentUser;
            this.exercise = exercise;
            this.template = template;
            this.soundEnabled = soundEnabled;
            this.timed = timed;
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
                    timed: _this.timed,
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
            this._template = '';
            this._patterns = [];
            this._types = [];
            // settings
            this._grouped = false;
            this._sound = false;
            this._timed = false;
            this.template = function (template) {
                _this._template = template;
                return _this;
            };
            this.patterns = function (patterns) {
                _this._patterns = patterns;
                return _this;
            };
            this.types = function (types) {
                _this._types = types;
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
            this.timed = function (timed) {
                if (timed === void 0) { timed = false; }
                _this._timed = timed;
                return _this;
            };
            this.get = function () {
                return new Promise(function (resolve, reject) {
                    var exerciseParams = {};
                    if (_this._template)
                        exerciseParams.template = _this._template;
                    if (_this._patterns.length > 0)
                        exerciseParams.patterns = _this._patterns;
                    if (_this._types.length > 0)
                        exerciseParams.types = _this._types;
                    if (_this._grouped)
                        exerciseParams.grouped = _this._grouped;
                    if (_this._limit)
                        exerciseParams.limit = _this._limit;
                    if (_this._sound)
                        exerciseParams.sound = _this._sound;
                    _this.client.sendRequest('GET', 'users/me/exercises', {}, exerciseParams).then(function (body) {
                        var data = JSON.parse(body);
                        var exercises = [];
                        data.forEach(function (exercise) {
                            exercises.push(new RecreIO.Exercise(_this.client, _this.client.currentUser, exercise, exercise.template, _this._sound, _this._timed));
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
var RecreIO;
(function (RecreIO) {
    var Group = (function () {
        function Group(id, name, role, type, parentId) {
            this.id = id;
            this.name = name;
            this.role = role;
            this.type = type;
            this.parentId = parentId;
        }
        return Group;
    })();
    RecreIO.Group = Group;
})(RecreIO || (RecreIO = {}));
/// <reference path="Group.ts" />
var RecreIO;
(function (RecreIO) {
    var User = (function () {
        function User(id, firstName, lastName, displayName, permissions, avatar, language, gender, createdAt, createdBy, groups, email, username, visualPassword) {
            var _this = this;
            this.id = id;
            this.firstName = firstName;
            this.lastName = lastName;
            this.displayName = displayName;
            this.permissions = permissions;
            this.avatar = avatar;
            this.language = language;
            this.gender = gender;
            this.createdAt = createdAt;
            this.createdBy = createdBy;
            this.groups = groups;
            this.email = email;
            this.username = username;
            this.visualPassword = visualPassword;
            this.getLanguage = function () {
                return _this.language;
            };
        }
        return User;
    })();
    RecreIO.User = User;
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
/// <reference path="User.ts" />
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
             * Parse a parameter object to HttpRequest parameters
             */
            this.parseParams = function (params) {
                var returnString = '';
                if (Object.keys(params).length == 0) {
                    return returnString;
                }
                returnString += '?';
                for (var key in params) {
                    var value = params[key];
                    if (returnString.length > 1) {
                        returnString += '&';
                    }
                    if (value instanceof Array) {
                        value = value.join(",");
                    }
                    returnString += key + '=' + value;
                }
                return returnString;
            };
            /**
             * ...
             */
            this.sendRequest = function (method, to, payload, params) {
                return new Promise(function (resolve, reject) {
                    var httpRequest = new XMLHttpRequest();
                    var _params = params || {};
                    var url = 'https://api.recre.io/' + to + _this.parseParams(_params);
                    var encodedPayload = JSON.stringify(payload);
                    httpRequest.open(method, url, true);
                    httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    httpRequest.setRequestHeader("X-API-Key", _this.apiKey);
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
                        _this.currentUserGroups = [];
                        data.groups.forEach(function (group) {
                            _this.currentUserGroups.push(new RecreIO.Group(group.id, group.name, group.role, group.type, group.parentId));
                        });
                        _this.currentUser = new RecreIO.User(data.id, data.firstName, data.lastName, data.displayName, data.permissions, data.avatar, data.language, data.gender, data.createdAt, data.createdBy, _this.currentUserGroups, data.email, data.username, data.visualPassword);
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
                            resolve(new RecreIO.Exercise(_this, _this.currentUser, _this.exercises[0], template, soundEnabled));
                        }).catch(function (error) {
                            reject(error);
                        });
                    }
                    else {
                        _this.exerciseIndex += 1;
                        resolve(new RecreIO.Exercise(_this, _this.currentUser, _this.exercises[_this.exerciseIndex], template, soundEnabled));
                    }
                });
            };
            this.getUser = function () {
                if (_this.currentUser) {
                    return new Promise(function (resolve, reject) {
                        resolve(_this.currentUser);
                    });
                }
                else {
                    return _this.getAccount();
                }
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
