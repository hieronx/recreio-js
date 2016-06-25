/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  export class Translations {
    public data: any = null;

    get(key: string) {
      if(this.data[key]) {
        return this.data[key];
      } else {
        return key
      }
    }
  }

}
