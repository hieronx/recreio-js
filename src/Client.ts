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

declare var bluebird: any;

module RecreIO {

  export class Client {

    /** The host of the API. */
    static API_URL: string = "https://api.recre.io/";

    /** The number of mouse frames tracked per second. */
    static MOUSE_TRACKING_RATE: number = 10;

    private currentUser: RecreIO.User;
    private currentUserGroups: RecreIO.Group[];
    private translations: Translations = new Translations();
    private appId: number = 1;

    private achievementInstance: RecreIO.Achievements;

    /**
     * Create a new RecreIO client with your API key.
     */
    constructor(private apiKey: string) {
      this.getUser();
    }


    /**
     * Parse a parameter object to HttpRequest parameters
     */
    private parseParams = (params: any) => {
      var returnString = '';

      if(Object.keys(params).length == 0) {
        return returnString;
      }

      returnString += '?';
      for (var key in params) {
        var value = params[key];

        if(returnString.length > 1) {
          returnString += '&';
        }
        if(value instanceof Array) {
          value = value.join(",")
        }
        returnString += key + '=' + value;
      }

      return returnString;
    };

    /**
     * ...
     */
    public sendRequest = (method: string, to: string, payload?: any, params?: any, contentType?: string) => {
      return new Promise((resolve, reject) => {
        var httpRequest = new XMLHttpRequest();
        var _params = params || {};
        var _contentType = contentType || 'application/json';

        var url: string = 'https://api.recre.io/' + to + this.parseParams(_params);

        if (_contentType == 'application/json') {
          var encodedPayload: string = JSON.stringify(payload);
        } else {
          var encodedPayload: string = payload;
        }

        httpRequest.open(method, url, true);
        httpRequest.setRequestHeader('Content-Type', _contentType + ';charset=UTF-8');
        httpRequest.setRequestHeader('X-API-Key', this.apiKey);
        httpRequest.withCredentials = true; // Send cookies with CORS requests
        httpRequest.send(encodedPayload);

        httpRequest.onreadystatechange = () => {
          if (httpRequest.readyState === 4) {
            if (httpRequest.status === 200) {
              resolve(httpRequest.responseText);
            } else {
              reject(httpRequest.status);
            }
          }
        }
      });
    };

    /**
     * Sign in with your username and password
     */
    public signInWithUsername = (username: string, password: string): any => {
      var payload = {
        username: username,
        password: password
      };
      return this.sendRequest('POST', 'auth/callback/password', payload);
    };

    /**
     * Sign in with your email address and password
     */
    public signInWithEmail = (email: string, password: string): any => {
      var payload = {
        email: email,
        password: password
      };
      return this.sendRequest('POST', 'auth/callback/password', payload);
    };

    /**
     * ...
     */
    public getUser = (): Promise<any>  => {
      if (this.currentUser){
        return new Promise((resolve, reject) => {
          resolve(this.currentUser);
        })
      }
      else {
        return new Promise((resolve, reject) => {
          this.sendRequest('GET', 'users/me').then((body: string) => {
            var data = JSON.parse(body);

            this.currentUserGroups = [];

            data.groups.forEach((group: any) => {
              this.currentUserGroups.push(new Group(group.id, group.name, group.role, group.type, group.parentId));
            });
            this.currentUser = new User(data.id, data.firstName, data.lastName, data.displayName, data.permissions, data.avatar, data.language, data.gender, data.createdAt, data.createdBy, this.currentUserGroups, data.volume, data.email, data.username, data.visualPassword);

            resolve(data);

          }).catch(function(error) {
            console.error(error);
            reject(error);
          });
        });
      }
    };

    private getParameterByName = (name: string) => {
      name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    /**
     *
     */
    public getTranslations = (): Promise<any> => {
      if(this.translations.data) {
        return new Promise((resolve, reject) => {
          resolve(this.translations);
        })
      }
      else {
        return this.getUser().then((user:any) => {
          return new Promise((resolve, reject) => {
            this.sendRequest('GET', 'translations?lang=' + user.language).then((body: string) => {
              var translations = JSON.parse(body);
              this.translations.data = translations;
              resolve(translations)
            }).catch((error) => {
              reject(error);
            });
          })
        })
      }
    };

    /**
     * Content
     */
    public content = (): RecreIO.ContentQuery => {
        return new RecreIO.ContentQuery(this);
    }

    /**
     * Leaderboards
     */
    public leaderboard = (leaderboardId: number): RecreIO.Leaderboard => {
      return new RecreIO.Leaderboard(leaderboardId, this);
    }

    /**
     * Achievements
     */
    public achievements = (): RecreIO.Achievements => {
      if (!this.achievementInstance) {
        this.achievementInstance = new RecreIO.Achievements(this);
      }
      return this.achievementInstance;
    }

    /**
     * Send a notification
     */
    public notify = (title: string, text: string, icon: string = 'https://recre.io/assets/images/achievement-icon.png') => {
      // add inline css
      document.head.insertAdjacentHTML('beforeend', '<style>.notification { transition: opacity 1s ease-in-out; position: relative; bottom: 120px; margin: 0 auto; z-index: 9999; width: 260px; box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.1), 0px 8px 8px 0px rgba(0, 0, 0, 0.07), 0px 16px 8px -8px rgba(0, 0, 0, 0.06); background: rgba(51, 51, 51, 0.9); border-radius: 8px; height: 80px; } .notification img { height: 40px; width: 40px; display: inline-block; padding: 20px; float: left; } .notification .content { display: inline-block; padding: 0 20px 0 0; width: 160px; } .notification .content h2 { font-size: 11px; font-family: Arial, sans-serif; color: #ccc; text-transform: uppercase; letter-spacing: .05em; margin-top: 0; width: 160px; padding: 20px 10px 0 0; float: left; } .notification .content h3 { font-family: Arial, sans-serif; font-weight: normal; margin: 5px 0; color: white; }</style>');

      // add achievement element
      document.body.insertAdjacentHTML('beforeend', '<div class="notification notification-achievement" id="last-achievement" style="opacity: 0;"><img src="' + icon + '" alt=""><div class="content"><h2>' + title + '</h2><h3>' + text + '</h3></div></div>');

      // fade in now, fade out after 3s
      document.getElementById('last-achievement').style.opacity = '1';
      setTimeout(function(){ document.getElementById('last-achievement').style.opacity = '0'; }, 3000);
      setTimeout(function(){ document.getElementById('last-achievement').outerHTML = ''; }, 4000);
    }

    /**
     * Exit the game and return to Recreio
     */
    public exit = () => {
      window.history.go(-1);
    }

  }

}
