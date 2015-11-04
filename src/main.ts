/**
 * recre.io JavaScript SDK
 * Copyright 2015, recre.io
 * Released under the MIT license.
 */

/// <reference path="../typings/superagent/superagent.d.ts" />
/// <reference path="../typings/bluebird/bluebird.d.ts" />

declare var bluebird: any;

module RecreIO {

  /**
   * ...
   */
  interface Exercise {
    template: string;
    pattern?: string;
    instruction?: string;
    curriculum?: any;

    begin(): Exercise;
    save(success: boolean): any;
  }

  /**
   * ...
   */
  export class Client {

    /** The host of the API. */
    static API_URL: string = "https://api.recre.io/";
      
    /** The number of mouse frames tracked per second. */
    static MOUSE_TRACKING_RATE: number = 10;

    /**
     * Create a new RecreIO client with your API key.
     */
    constructor(private apikey: string) {}

    /**
     * ...
     */
    private sendRequest(method: string, to: string, payload?: any) {
      var promise: any = new Promise(function(resolve, reject) {
        var httpRequest = new XMLHttpRequest();

        var url: string = this.API_URL + to;
        var encodedPayload: string = JSON.stringify(payload);

        httpRequest.open(method, url, true);
        httpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        httpRequest.setRequestHeader("X-API-Key", this.apikey);
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
      return promise.bind(this);
    }

    /**
     * ...
     */
    signInWithUsername(username: string, password: string): any {
      var payload = {
        login: username,
        password: password,
        isUsername: true
      }
      return this.sendRequest('POST', '/auth/callback/password', payload);
    }

    /**
     * ...
     */
    getAccount(): any { 
      return this.sendRequest('GET', '/users/me');
    }

    /**
     * ...
     */
    getNextExercise(template: string, soundEnabled: boolean = false): any {
      return this.sendRequest('GET', '/users/me/exercises?template=' + template + '&sound=' + soundEnabled);
    }

  };

};