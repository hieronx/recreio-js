/**
 * recre.io JavaScript SDK
 * Copyright 2015, recre.io
 * Released under the MIT license.
 */

/// <reference path="../typings/bluebird/bluebird.d.ts" />
/// <reference path="exercise.ts" />

declare var bluebird: any;

module RecreIO {

  export class Client {

    /** The host of the API. */
    static API_URL: string = "https://api.recre.io/";
      
    /** The number of mouse frames tracked per second. */
    static MOUSE_TRACKING_RATE: number = 10;

    /**
     * Create a new RecreIO client with your API key.
     */
    constructor(private apiKey: string, private appId: number) {}

    /**
     * ...
     */
    public sendRequest(method: string, to: string, payload?: any) {
      var promise: any = new Promise(function(resolve, reject) {
        var httpRequest = new XMLHttpRequest();

        var url: string = 'https://api.recre.io/' + to;
        var encodedPayload: string = JSON.stringify(payload);

        httpRequest.open(method, url, true);
        httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        httpRequest.setRequestHeader("X-API-Key", 'wzHb9a2YjLPQWAMyxSSjLuy9XsPAV3e3');
        httpRequest.withCredentials = true; // Send cookies with CORS requests
        httpRequest.send(encodedPayload);
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
      return promise.bind({apiKey: this.apiKey, apiUrl: 'https://api.recre.io/'});
    }

    /**
     * ...
     */
    public signInWithUsername(username: string, password: string): any {
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
    public getAccount(): any {
      return this.sendRequest('GET', 'users/me');
    }

    private  exercises: any[] = [];
    private  exerciseIndex: number = 0;

    /**
     * ...
     */
    public getNextExercise(template: string = 'true-false', soundEnabled: boolean = false): any {
      return new Promise(function(resolve, reject) {
        if (this.exercises.length == 0 || this.exerciseIndex == this.exercises.length - 1) {
            this.exerciseIndex = 0;

            this.sendRequest('GET', 'users/me/exercises?template=' + template + '&sound=' + soundEnabled).then(function(body) {
                this.exercises = JSON.parse(body);
                resolve(new RecreIO.Exercise(this, this.exercises[0]));
            }).catch(function(error) {
                console.error(error);
                reject(error);
            });

        } else {
            this.exerciseIndex += 1;
            resolve(new RecreIO.Exercise(this, this.exercises[this.exerciseIndex]));
        }
      });
    }

  };

};