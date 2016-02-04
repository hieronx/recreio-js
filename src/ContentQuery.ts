/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  export class ContentQuery {

    constructor(private client: any) {}

    // content type
    private _template: string = '';
    private _patterns: string[] = [];
    private _types: string[] = [];

    // settings
    private _grouped: boolean = false;
    private _limit: number;
    private _sound: boolean = false;
    private _timed: boolean = false;

    public template = (template: string): RecreIO.ContentQuery => {
        this._template = template;
        return this;
    };

    public patterns = (patterns: string[]): RecreIO.ContentQuery => {
        this._patterns = patterns;
        return this;
    };

    public types = (types: string[]): RecreIO.ContentQuery => {
        this._types = types;
          return this;
    };

    public grouped = (grouped: boolean = true): RecreIO.ContentQuery => {
        this._grouped = grouped;
        return this;
    };

    public limit = (limit: number): RecreIO.ContentQuery => {
        this._limit = limit;
        return this;
    };

    public sound = (sound: boolean): RecreIO.ContentQuery => {
        this._sound = sound;
        return this;
    };

    public timed = (timed: boolean = false): RecreIO.ContentQuery => {
        this._timed = timed;
        return this;
    }

    public get = (): any => {
      return new Promise((resolve, reject) => {
        var exerciseParams: any = {};

        if (this._template) exerciseParams.template = this._template;
        if (this._patterns.length > 0) exerciseParams.patterns = this._patterns;
        if (this._types.length > 0) exerciseParams.types = this._types;

        if (this._grouped) exerciseParams.grouped = this._grouped;
        if (this._limit) exerciseParams.limit = this._limit;
        if (this._sound) exerciseParams.sound = this._sound;

        console.log(exerciseParams);

        this.client.sendRequest('GET', 'users/me/exercises', {}, exerciseParams).then((body: string) => {
          var data = JSON.parse(body);
          var exercises = [];

          data.forEach((exercise: any) => {
              exercises.push(new RecreIO.Exercise(this.client, this.client.currentUser, exercise, exercise.template, this._sound, this._timed));
          });

          resolve(exercises);

        }).catch(function(error) {
          reject(error);
        });
      });
    }

  }

}