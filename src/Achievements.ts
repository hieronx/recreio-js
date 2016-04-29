/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  export class Achievements {

    private achievements: any[];

    private achievementPromise: any;

    constructor(private client: RecreIO.Client) {
      this.achievementPromise = new Promise((resolve, reject) => {
        this.client.sendRequest('GET', 'achievements').then((body: string) => {
          this.achievements = JSON.parse(body);
          resolve(this.achievements);
        }).catch((error) => {
          reject(error);
        });
      })

      return this;
    }

    public get = (achievementId: number): any => {
      if (this.achievements) {
        return this.achievements.filter((achievement: any) => { return achievement.id == achievementId })[0];
      } else {
        this.achievementPromise.then((achievements: any[]) => {
          return achievements.filter((achievement: any) => { return achievement.id == achievementId })[0];
        });
      }
    }

  }

}
