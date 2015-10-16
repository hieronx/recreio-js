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
        curriculum?: string;

        begin(): Exercise;
        save(success: boolean): any;
    }

    getAccount(): Promise<any>;
    signIn(provider: any): Promise<any>
    signInWithUsername(username: string, password: string): Promise<any>
    signInWithEmail(email: string, password: string): Promise<any>
    getNextExercise(template: string): Promise<Exercise>;


}