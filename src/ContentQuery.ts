/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  export class ContentQuery {

    constructor(private client: any) {}

    // content type
    private _templates: string[] = [];
    private _patterns: string[] = [];
    private _type: string;

    // settings
    private _grouped: boolean = false;
    private _limit: number;
    private _sound: boolean = false;

    public templates = (templates: string[]): RecreIO.ContentQuery => {
        this._templates = templates;
        return this;
    }

    public patterns = (patterns: string[]): RecreIO.ContentQuery => {
        this._patterns = patterns;
        return this;
    }

    public type = (type: string): RecreIO.ContentQuery => {
        this._type = type;
          return this;
    }

    public grouped = (grouped: boolean = true): RecreIO.ContentQuery => {
        this._grouped = grouped;
        return this;
    }

    public limit = (limit: number): RecreIO.ContentQuery => {
        this._limit = limit;
        return this;
    }

    public sound = (sound: boolean): RecreIO.ContentQuery => {
        this._sound = sound;
        return this;
    }

    public get = (): any => {
      return new Promise((resolve, reject) => {
        var exerciseParams: any = {};

        if (this._templates.length > 0) exerciseParams.templates = this._templates;
        if (this._patterns.length > 0) exerciseParams.patterns = this._patterns;
        if (this._type) exerciseParams.type = this._type;

        if (this._grouped) exerciseParams.grouped = this._grouped;
        if (this._limit) exerciseParams.limit = this._limit;
        if (this._sound) exerciseParams.sound = this._sound;

        console.log(exerciseParams);

        this.client.sendRequest('GET', 'users/me/exercises', exerciseParams).then((body: string) => {
          var data = JSON.parse(body);
          var exercises = [];

          data.forEach((exercise: any) => {
              exercises.push(new RecreIO.Exercise(this.client, this.client.currentUser, exercise.template, this._sound, exercise));
          });

          resolve(exercises);

        }).catch(function(error) {
          reject(error);
        });
      });
    }

  }

}