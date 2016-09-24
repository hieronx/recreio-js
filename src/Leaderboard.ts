/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  interface ILeaderboardReport {
    personal: IPersonalLeaderboardReport;
  }

  interface IPersonalLeaderboardReport {
    latest: number;
    currentBest: number;
    previousBest?: number;
  }

  export class Leaderboard {

    constructor(private id: number, private client: RecreIO.Client) {}

    public submitResult = (result: string): void => {
      this.client.sendRequest('POST', 'leaderboards/' + this.id + '/results', result, {}, 'text/plain').then((body: string) => {
        var report: ILeaderboardReport = JSON.parse(body);

        if (report.personal.previousBest && report.personal.currentBest > report.personal.previousBest) {
          let difference = report.personal.currentBest - report.personal.previousBest;
          this.client.notify('Nieuw record', 'Hooray! ' + difference + ' hoger dan eerst.');
        }
      }).catch((exception: any) => {
        console.error('Oops, submitting the result did not work..');
      });
    }

  }

}
