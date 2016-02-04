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
        getAccount(): Promise<any>;
    
        getNextExercise(template: string, soundEnabled: boolean): Promise<Exercise>;

       content(): ContentQuery;
    }

    class Exercise {

        public access: string;
        public active: boolean;
        public content: any;
        public instruction: string;
        public pattern: string;
        public soundEnabled: boolean;
        public template: string;

        private startTime: number;
        private endTime: number;
        private duration: number;

        private user: any;

        private mousePosition: any;
        private mouseMovement: any[];
        private mouseInterval;

        constructor(template: string, pattern?: string, instruction?: string, curriculum?: any);
        
        begin(): Exercise;
        save(success: boolean): any;
    }

    class ContentQuery {
        public template(template: string): RecreIO.ContentQuery;
        public patterns(patterns: string): RecreIO.ContentQuery;
        public types(types: string): RecreIO.ContentQuery;
        public grouped(grouped: boolean): RecreIO.ContentQuery;
        public limit(limit: number): RecreIO.ContentQuery;
        public sound(sound: boolean): RecreIO.ContentQuery;

        public get(): any;
    }
    
}
