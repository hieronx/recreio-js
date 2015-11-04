/**
 * recre.io JavaScript SDK
 * Copyright 2015, recre.io
 * Released under the MIT license.
 */

/// <reference path="../typings/superagent/superagent.d.ts" />
/// <reference path="../typings/bluebird/bluebird.d.ts" />

declare var superagent: any;
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
    private API_URL: string = "https://api.recre.io/";
      
    /** The number of mouse frames tracked per second. */
    private MOUSE_TRACKING_RATE: number = 10;

    /**
     * Create a new RecreIO client with your API key.
     */
    constructor(private apikey: string) {}

    /**
     * ...
     */
    private sendRequest(method: string, to: string, payload?: any): any {
      var url: string = this.API_URL + to;
      var encodedPayload: string = JSON.stringify(payload);

      superagent(method, url)
        .type('application/json')
        .send(payload)
        .timeout(5000)
        .set('X-API-Key', this.apikey)
        .end(function(err: any, res: any) {
          if (res.ok) {
            bluebird.resolve(res.body);
          } else {
            bluebird.reject(res.body);
          }
        });
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