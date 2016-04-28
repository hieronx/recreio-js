/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  export class Translations {

    private translations: any = null;

    constructor(private client: Recreio.Client): any {
      this.client.getUser().then((user: any) => {
        return new Promise((resolve, reject) => {
          this.client().sendRequest('GET', 'translations?lang=' + user.language).then((body: string) => {
            var translations = JSON.parse(body);
            this.translations = translations;
            resolve(translations);
          }).catch((error) => {
            reject(error);
          });
        })
      });
    }

    public get = (key: string, parameters: any = null): string => {
      if (this.translations[key]) {
        return this.translations[key];
      } else {
        return key
      }
    }

  }

}
