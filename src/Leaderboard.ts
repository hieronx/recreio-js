/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  export class Leaderboard {

    constructor(private id: number, private client: RecreIO.Client) {}

    public submitResult = (result: string): void => {
      this.client.sendRequest('POST', 'leaderboards/' + this.id + '/results', result, {}, 'text/plain').catch((exception: any) => {
        console.error('Oops, submitting the result did not work..');
      });
    }

  }

}
