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
    private _groupBy: string = 'none';
    private _groupSize: number = 10;

    private _count: number = 10;
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

    public groupBy = (groupBy: string = "item", groupSize: number): RecreIO.ContentQuery => {
      this._groupBy = groupBy;
      this._groupSize = groupSize;
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

    public get = (count: number): any => {
      return new Promise((resolve, reject) => {
        var exerciseParams: any = {};

        if (this._template) exerciseParams.template = this._template;
        if (this._patterns.length > 0) exerciseParams.patterns = this._patterns;
        if (this._types.length > 0) exerciseParams.types = this._types;

        if (this._groupBy) exerciseParams.group_by = this._groupBy;
        if (this._groupSize) exerciseParams.group_size = this._groupSize;

        if (this._count) exerciseParams.count = this._count;
        if (this._sound) exerciseParams.sound = this._sound || (this.client.currentUser.volume > 0);

        this.client.sendRequest('GET', 'exercises', {}, exerciseParams).then((body: string) => {
          var data = JSON.parse(body);
          var exercises: RecreIO.Exercise[] = [];
          var previousExercise: RecreIO.Exercise = null;

          for(var i = 0; i < data.length; i++) {
              let grouped = this._groupBy != 'none';
              var currentExercise = new RecreIO.Exercise(this.client, this.client.currentUser, data[i], data[i].template, this._sound, this._timed, grouped);

              if (previousExercise) {
                  previousExercise.next = currentExercise;
                  currentExercise.previous = previousExercise;
              }

              previousExercise = currentExercise;

              exercises.push(currentExercise);
          }

          resolve(exercises);

        }).catch((error: any) => {
          reject(error);
        });
      });
    }

  }

}
