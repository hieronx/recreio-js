// Type definitions for recreio-js
// Project: https://github.com/recreio/recreio-js
// Definitions by: Jeroen Offerijns <https://github.com/offerijns>, Gert Spek <https://github.com/spekkie1994>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="bluebird/bluebird.d.ts" />
/// <reference path="webspeechapi/webspeechapi.d.ts" />

declare module RecreIO {
   class Client {
       constructor(apiKey: string);

       // signIn(provider: any): Promise<any>;
       signInWithUsername(username: string, password: string): Promise<any>;
       // signInWithEmail(email: string, password: string): Promise<any>;

       getUser(): Promise<any>;
       getNextExercise(template: string, soundEnabled: boolean): Promise<Exercise>;
       getTranslations(): Promise<any>;

       content(): ContentQuery;
       achievements(): Achievements;
    }

    class Translations {
      public data: any

      get(key: String): string;
    }

    class Achievements {
      constructor(client: RecreIO.Client);

      get(achievementId: number): any;
    }

    class Exercise {

        public access: string;
        public active: boolean;
        public content: any;
        public instruction: string;
        public pattern: string;
        public soundEnabled: boolean;
        public template: string;
        public timed: boolean;

        public next: Exercise;
        public previous: Exercise;

        private startTime: number;
        private endTime: number;
        private duration: number;

        private user: any;

        private mousePosition: any;
        private mouseMovement: any[];
        private mouseInterval;

        constructor(template: string, pattern?: string, instruction?: string, exercise?: any, timed?: boolean);

        begin(): Exercise;
        save(success: boolean): any;
    }

    class ContentQuery {
        public template(template: string): RecreIO.ContentQuery;
        public patterns(patterns: string): RecreIO.ContentQuery;
        public types(types: string): RecreIO.ContentQuery;
        public groupBy(by: string, size: number): RecreIO.ContentQuery;
        public sound(sound: boolean): RecreIO.ContentQuery;

        public get(count: number): any;
    }

    class User {
        public id: number;
        private firstName: number;
        private lastName: number;
        public displayName: number;
        private premissions: number;
        public avatar: number;
        public language: string;
        public gender: string;
        private createdAt: string;
        private createdBy: number;
        private groups: RecreIO.Group[];
        public volume: number;
        private email: string;
        private username: string;
        private visualPassword: string;
    }

    class Group {
        private id: number;
        private name: string;
        private role: string;
        private type: string;
        private parentId: number;
    }

}
