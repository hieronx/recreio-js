// Type definitions for recreio-js
// Project: https://github.com/recreio/recreio-js
// Definitions by: Jeroen Offerijns <https://github.com/offerijns>, Gert Spek <https://github.com/spekkie1994>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/// <reference path="typings/bluebird/bluebird.d.ts" />

declare module RecreIO {

    interface Exercise {
        template: string;
        pattern?: string;
        instruction?: string;
        curriculum?: any;

        begin(): Exercise;
        save(success: boolean): any;
    }

    function signIn(provider: any): Promise<any>;
    function signInWithUsername(username: string, password: string): Promise<any>;
    function signInWithEmail(email: string, password: string): Promise<any>;
    function getAccount(): Promise<any>;
    
    function getNextExercise(template: string): Promise<Exercise>;
    
}
