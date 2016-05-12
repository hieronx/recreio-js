/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */
var RecreIO;
(function (RecreIO) {
    var Exercise = (function () {
        function Exercise(client, currentUser, exercise, template, soundEnabled, timed, grouped) {
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
            this.grouped = grouped;
            this.next = null;
            this.previous = null;
            this.mousePosition = {};
            this.mouseMovement = [];
            this.mouseInterval = 0;
            this.begin = function () {
                _this.startTime = new Date().getTime();
                // Save mouse position 10 times per second
                document.onmousemove = _this.handleMouseMove;
                _this.mouseInterval = setInterval(_this.getMousePosition, 1000 / _this.client.MOUSE_TRACKING_RATE);
                if ((_this.soundEnabled || _this.currentUser.volume > 0) && _this.content.sound) {
                    if (_this.previous == null) {
                        var instructionUtterance = new SpeechSynthesisUtterance();
                        instructionUtterance.text = _this.instruction;
                        instructionUtterance.lang = _this.currentUser.language;
                        instructionUtterance.rate = 1;
                        speechSynthesis.speak(instructionUtterance);
                    }
                    else {
                        if (!_this.grouped && (_this.previous.instruction != _this.instruction)) {
                            var instructionUtterance = new SpeechSynthesisUtterance();
                            instructionUtterance.text = _this.instruction;
                            instructionUtterance.lang = _this.currentUser.language;
                            instructionUtterance.rate = 1;
                            speechSynthesis.speak(instructionUtterance);
                        }
                    }
                    var contentUtterance = new SpeechSynthesisUtterance();
                    contentUtterance.text = _this.content.sound;
                    contentUtterance.lang = _this.currentUser.language;
                    contentUtterance.rate = 1;
                    speechSynthesis.speak(contentUtterance);
                }
                _this.isTesting = (_this.client.getParameterByName('testing') == 'true');
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
                    template: _this.template,
                    timed: _this.timed,
                    sound: _this.soundEnabled,
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
                        exerciseParams.sound = _this._sound || (_this.client.currentUser.volume > 0);
                    _this.client.sendRequest('GET', 'users/me/exercises', {}, exerciseParams).then(function (body) {
                        var data = JSON.parse(body);
                        var exercises = [];
                        var previousExercise = null;
                        for (var i = 0; i < data.length; i++) {
                            var currentExercise = new RecreIO.Exercise(_this.client, _this.client.currentUser, data[i], data[i].template, _this._sound, _this._timed, _this._grouped);
                            if (previousExercise) {
                                previousExercise.next = currentExercise;
                                currentExercise.previous = previousExercise;
                            }
                            previousExercise = currentExercise;
                            exercises.push(currentExercise);
                        }
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
        function User(id, firstName, lastName, displayName, permissions, avatar, language, gender, createdAt, createdBy, groups, volume, email, username, visualPassword) {
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
            this.volume = volume;
            this.email = email;
            this.username = username;
            this.visualPassword = visualPassword;
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
var RecreIO;
(function (RecreIO) {
    var Achievements = (function () {
        function Achievements(client) {
            var _this = this;
            this.client = client;
            this.achievements = [];
            this.get = function (achievementId) {
                var results = _this.achievements.filter(function (achievement) { return achievement.id == achievementId; });
                if (results[0])
                    return results[0];
                else
                    return null;
            };
            this.client.sendRequest('GET', 'achievements').then(function (body) {
                var achievements = JSON.parse(body);
                for (var i = 0; i < achievements.length; i++) {
                    _this.achievements.push(new RecreIO.Achievement(_this.client, achievements[i]));
                }
            }).catch(function (error) {
                console.error('Failed to retrieve the achievements');
            });
            return this;
        }
        return Achievements;
    })();
    RecreIO.Achievements = Achievements;
    var Achievement = (function () {
        function Achievement(client, achievement) {
            var _this = this;
            this.client = client;
            this.achievement = achievement;
            this.completed = false;
            this.achievementSound = new Audio('http://offerijns.nl/AchievementUnlocked.mp3');
            this.reveal = function () {
                _this.updateState('visible');
            };
            this.complete = function () {
                if (!_this.completed) {
                    _this.completed = true;
                    _this.achievementSound.play();
                    _this.updateState('completed');
                    // add inline css
                    document.head.insertAdjacentHTML('beforeend', '<style>.notification { transition: opacity 1s ease-in-out; position: relative; bottom: 120px; margin: 0 auto; z-index: 9999; width: 260px; box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1), 0px 8px 8px 0px rgba(0, 0, 0, 0.07), 0px 16px 8px -8px rgba(0, 0, 0, 0.06); background: rgba(51, 51, 51, 0.9); border-radius: 8px; height: 80px; } .notification img { height: 40px; width: 40px; display: inline-block; padding: 20px; float: left; } .notification .content { display: inline-block; padding: 0 20px 0 0; width: 160px; } .notification .content h2 { font-size: 11px; font-family: Arial, sans-serif; color: #ccc; text-transform: uppercase; letter-spacing: .05em; margin-top: 0; width: 160px; padding: 20px 10px 0 0; float: left; } .notification .content h3 { font-family: Arial, sans-serif; font-weight: normal; margin: 5px 0; color: white; }</style>');
                    // add achievement element
                    document.body.insertAdjacentHTML('beforeend', '<div class="notification notification-achievement" id="last-achievement" style="opacity: 0;"><img src="http://offerijns.nl/achievement-icon.png" alt=""><div class="content"><h2>Achievement unlocked</h2><h3>' + _this.name + '</h3></div></div>');
                    // fade in now, fade out after 3s
                    document.getElementById('last-achievement').style.opacity = '1';
                    setTimeout(function () { document.getElementById('last-achievement').style.opacity = '0'; }, 3000);
                    setTimeout(function () { document.getElementById('last-achievement').outerHTML = ''; }, 4000);
                }
            };
            this.updateState = function (newState) {
                if (newState === void 0) { newState = 'completed'; }
                return _this.client.sendRequest('PUT', 'users/me/achievements/' + _this.id + '/state', newState, {}, 'text/plain');
            };
            for (var k in achievement)
                this[k] = achievement[k];
            delete this.achievement;
        }
        return Achievement;
    })();
    RecreIO.Achievement = Achievement;
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
/// <reference path="Achievements.ts" />
var RecreIO;
(function (RecreIO) {
    var Translations = (function () {
        function Translations() {
            this.data = null;
        }
        Translations.prototype.get = function (key) {
            if (this.data[key]) {
                return this.data[key];
            }
            else {
                return key;
            }
        };
        return Translations;
    })();
    RecreIO.Translations = Translations;
    var Client = (function () {
        /**
         * Create a new RecreIO client with your API key.
         */
        function Client(apiKey) {
            var _this = this;
            this.apiKey = apiKey;
            this.translations = new Translations();
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
            this.sendRequest = function (method, to, payload, params, contentType) {
                return new Promise(function (resolve, reject) {
                    var httpRequest = new XMLHttpRequest();
                    var _params = params || {};
                    var _contentType = contentType || 'application/json';
                    var url = 'https://api.recre.io/' + to + _this.parseParams(_params);
                    if (_contentType == 'application/json') {
                        var encodedPayload = JSON.stringify(payload);
                    }
                    else {
                        var encodedPayload = payload;
                    }
                    httpRequest.open(method, url, true);
                    httpRequest.setRequestHeader('Content-Type', _contentType + ';charset=UTF-8');
                    httpRequest.setRequestHeader('X-API-Key', _this.apiKey);
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
            };
            this.getUser = function () {
                if (_this.currentUser) {
                    return new Promise(function (resolve, reject) {
                        resolve(_this.currentUser);
                    });
                }
                else {
                    return new Promise(function (resolve, reject) {
                        _this.sendRequest('GET', 'users/me').then(function (body) {
                            var data = JSON.parse(body);
                            _this.currentUserGroups = [];
                            data.groups.forEach(function (group) {
                                _this.currentUserGroups.push(new RecreIO.Group(group.id, group.name, group.role, group.type, group.parentId));
                            });
                            _this.currentUser = new RecreIO.User(data.id, data.firstName, data.lastName, data.displayName, data.permissions, data.avatar, data.language, data.gender, data.createdAt, data.createdBy, _this.currentUserGroups, data.volume, data.email, data.username, data.visualPassword);
                            resolve(data);
                        }).catch(function (error) {
                            console.error(error);
                            reject(error);
                        });
                    });
                }
            };
            this.getParameterByName = function (name) {
                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"), results = regex.exec(location.search);
                return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
            };
            /**
             *
             */
            this.getTranslations = function () {
                if (_this.translations.data) {
                    return new Promise(function (resolve, reject) {
                        resolve(_this.translations);
                    });
                }
                else {
                    return _this.getUser().then(function (user) {
                        return new Promise(function (resolve, reject) {
                            _this.sendRequest('GET', 'translations?lang=' + user.language).then(function (body) {
                                var translations = JSON.parse(body);
                                _this.translations.data = translations;
                                resolve(translations);
                            }).catch(function (error) {
                                reject(error);
                            });
                        });
                    });
                }
            };
            /**
             *
             */
            this.content = function () {
                return new RecreIO.ContentQuery(_this);
            };
            /**
             *
             */
            this.achievements = function () {
                return new RecreIO.Achievements(_this);
            };
            this.getUser();
        }
        /** The host of the API. */
        Client.API_URL = "https://api.recre.io/";
        /** The number of mouse frames tracked per second. */
        Client.MOUSE_TRACKING_RATE = 10;
        return Client;
    })();
    RecreIO.Client = Client;
})(RecreIO || (RecreIO = {}));
