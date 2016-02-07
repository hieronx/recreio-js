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

declare var bluebird: any;

module RecreIO {

  export class Client {

    /** The host of the API. */
    static API_URL: string = "https://api.recre.io/";
      
    /** The number of mouse frames tracked per second. */
    static MOUSE_TRACKING_RATE: number = 10;

    private currentUser: RecreIO.User;
    private currentUserGroups: RecreIO.Group[];
    private appId: number = 1;

    /**
     * Create a new RecreIO client with your API key.
     */
    constructor(private apiKey: string) {
      this.getAccount()
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
    private sendRequest = (method: string, to: string, payload?: any, params?: any) => {
      return new Promise((resolve, reject) => {
        var httpRequest = new XMLHttpRequest();
        var _params = params || {};

        var url: string = 'https://api.recre.io/' + to + this.parseParams(_params);
        var encodedPayload: string = JSON.stringify(payload);

        httpRequest.open(method, url, true);
        httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        httpRequest.setRequestHeader("X-API-Key", this.apiKey);
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
    }

    /**
     * ...
     */
    public signInWithUsername = (username: string, password: string): any => {
      var payload = {
        login: username,
        password: password,
        isUsername: true
      }
      return this.sendRequest('POST', 'auth/callback/password', payload);
    }

    /**
     * ...
     */
    public getAccount = (): any => {
      return new Promise((resolve, reject) => {
        this.sendRequest('GET', 'users/me').then((body: string) => {
          var data = JSON.parse(body);

          this.currentUserGroups = []

          data.groups.forEach((group: any) => {
            this.currentUserGroups.push(new Group(group.id, group.name, group.role, group.type, group.parentId));
          });
          this.currentUser = new User(data.id, data.firstName, data.lastName, data.displayName, data.permissions, data.avatar, data.language, data.gender, data.createdAt, data.createdBy, this.currentUserGroups, data.email, data.username, data.visualPassword);

          resolve(data);

        }).catch(function(error) {
          console.error(error);
          reject(error);
        });
      });
    }

    private exercises: any[] = [];
    private exerciseIndex: number = 0;

    /**
     * ...
     */
    public getNextExercise = (template: string = 'true-false', soundEnabled: boolean = false): any => {
      return new Promise((resolve, reject) => {
        if (this.exercises.length == 0 || this.exerciseIndex == this.exercises.length - 1) {
            this.exerciseIndex = 0;

            this.sendRequest('GET', 'users/me/exercises?template=' + template + '&sound=' + soundEnabled).then((body: string) => {
                this.exercises = JSON.parse(body);
                resolve(new RecreIO.Exercise(this, this.currentUser, this.exercises[0], template, soundEnabled));
            }).catch((error) => {
                reject(error);
            });

        } else {
            this.exerciseIndex += 1;
            resolve(new RecreIO.Exercise(this, this.currentUser, this.exercises[this.exerciseIndex], template, soundEnabled));
        }
      });
    }

    public getUser = (): User  => {
      if (this.currentUser){
        return this.currentUser;
      }
      else {
        return this.getAccount();
      }
    }

    /**
     * 
     */
    public content = (): RecreIO.ContentQuery => {
        return new RecreIO.ContentQuery(this);
    }

  };

};