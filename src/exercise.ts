/**
 * recre.io JavaScript SDK
 * Copyright 2015, recre.io
 * Released under the MIT license.
 */

module RecreIO {

  export class Exercise {

    constructor(private client: any, private currentUser: any, private exercise: any) {}

    private startTime: number;
    private endTime: number;
    private duration: number;

    private user: any;

    private mousePosition: any = {};
    private mouseMovement: any[] = new Array();
    private mouseInterval = 0;

    public begin = (): Exercise => {
      // if (!user) {
      //     console.error("Not yet authenticated.")
      //     // return false;
      // }

      this.startTime = new Date().getTime();

      // Save mouse position 10 times per second
      document.onmousemove = this.handleMouseMove;
      this.mouseInterval = setInterval(this.getMousePosition, 1000 / this.client.MOUSE_TRACKING_RATE);

      return this;
    }

    public save = (success): any => {
      if (!this.startTime) {
          console.error("Exercise hasn't started yet.")
          return false;
      }

      this.endTime = new Date().getTime();
      this.duration = this.endTime - this.startTime;

      clearInterval(this.mouseInterval);

      var statement = {
          actor: {
              name: this.currentUser.name,
              account: {
                  id: this.currentUser.id
              }
          },
          verb: {
              id: "completed"
          },
          object: {
              id: 42,
              definition: {
                  name: ""
              }
          },
          result: {
              completion: true,
              success: success,
              duration: Math.floor(Math.abs(this.duration / 1000)) + "S"
          },
          context: {
              extensions: {
                  app: this.client.appId,
                  mouseMovement: this.mouseMovement
              }
          },
          timestamp: new Date().toISOString()
      }

      this.client.sendRequest('POST', 'statements', statement).then((body) => {
        // do nothing
      }).catch((error) => {
          console.error(error);
      });

      return statement;
    }

    private handleMouseMove = (event: any): void => {
      var dot, eventDoc, doc, body, pageX, pageY;
      event = event || window.event; // IE-ism

      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      if (event.pageX == null && event.clientX != null) {
        eventDoc = (event.target && event.target.ownerDocument) || document;
        doc = eventDoc.documentElement;
        body = eventDoc.body;

        event.pageX = event.clientX +
          (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
          (doc && doc.clientLeft || body && body.clientLeft || 0);

        event.pageY = event.clientY +
          (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
          (doc && doc.clientTop  || body && body.clientTop  || 0 );
      }

      this.mousePosition = {
        x: event.pageX,
        y: event.pageY
      };
    }
    
    private getMousePosition = (): void => {
      if (this.mousePosition && this.mousePosition.x && this.mousePosition.y) {
        this.mouseMovement[this.mouseInterval] = { x: this.mousePosition.x, y: this.mousePosition.y }
        this.mouseInterval++;
      }
    }
  }

};