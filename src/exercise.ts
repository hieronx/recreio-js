/**
 * Recreio JavaScript SDK
 * Copyright 2015-2016, Recreio
 * Released under the MIT license.
 */

module RecreIO {

  interface Window {
    getSpeechSynthesis(): any;
    getSpeechSynthesisUtterance(): any;
  }

  export class Exercise {

    constructor(private client: any, private currentUser: any, private exercise: any, private template: string = 'true-false', private soundEnabled: boolean = false, private timed: boolean = false, private grouped: boolean) {
      for (var k in exercise) this[k] = exercise[k];
        delete this.exercise;
    }

    public next: Exercise = null;
    public previous: Exercise = null;

    public id: number;
    public knowledgeObjectId: number;
    public instruction: string;
    public content: any;

    private startTime: number;
    private endTime: number;
    private duration: number;

    private user: any;

    private mousePosition: any = {};
    private mouseMovement: any[] = [];
    private mouseInterval = 0;

    private isTesting: boolean;

    public begin = (): Exercise => {
      this.startTime = new Date().getTime();

      // Save mouse position 10 times per second
      document.onmousemove = this.handleMouseMove;
      this.mouseInterval = setInterval(this.getMousePosition, 1000 / this.client.MOUSE_TRACKING_RATE);

      if ((this.soundEnabled || this.currentUser.volume > 0) && this.content.sound) {

        if (this.previous == null) {
          var instructionUtterance = new SpeechSynthesisUtterance();
          instructionUtterance.text = this.instruction;
          instructionUtterance.lang = this.currentUser.language;
          instructionUtterance.rate = 1;
          speechSynthesis.speak(instructionUtterance);
        }
        else {
          if(!this.grouped && (this.previous.instruction != this.instruction)) {
            var instructionUtterance = new SpeechSynthesisUtterance();
            instructionUtterance.text = this.instruction;
            instructionUtterance.lang = this.currentUser.language;
            instructionUtterance.rate = 1;
            speechSynthesis.speak(instructionUtterance);
          }
        }

        var contentUtterance = new SpeechSynthesisUtterance();
        contentUtterance.text = this.content.sound;
        contentUtterance.lang = this.currentUser.language;
        contentUtterance.rate = 1;
        speechSynthesis.speak(contentUtterance);
      }

      this.isTesting = (this.client.getParameterByName('testing') == 'true');

      return this;
    };

    public save = (success: boolean): any => {
      if (!this.startTime) {
          console.error("Exercise hasn't started yet.");
          return false;
      }

      if (this.isTesting) {
          console.log("Results are not saved when in testing mode.");
          return false;
      }

      if (success) {
        this.client.achievements().incrementStreak();
      } else {
        this.client.achievements().clearStreak();
      }

      this.endTime = new Date().getTime();
      this.duration = this.endTime - this.startTime;

      clearInterval(this.mouseInterval);

      var statement = {
        id: this.id,
        template: this.template,
        timed: this.timed,
        sound: this.soundEnabled,
        success: success,
        sentAt: new Date().toISOString(),
        processedAt: new Date().toISOString(),
        context: {
          duration: this.duration / 1000,
          mouseMovement: this.mouseMovement
        },
        instruction: this.instruction,
        content: this.content
      };

      this.client.sendRequest('POST', 'statements', statement).then((body) => {
        // do nothing
      }).catch((error) => {
          console.error(error);
      });

      return statement;
    };

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
    };

    private getMousePosition = (): void => {
      if (this.mousePosition && this.mousePosition.x && this.mousePosition.y) {
        this.mouseMovement[this.mouseInterval] = { x: this.mousePosition.x, y: this.mousePosition.y };
        this.mouseInterval++;
      }
    };
  }

}
