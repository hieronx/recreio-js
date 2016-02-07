/// <reference path="Group.ts" />

module RecreIO {

    export class User {

        constructor(private id: number,
                    private firstName: string,
                    private lastName: string,
                    private displayName: string,
                    private permissions: number,
                    private avatar: number,
                    private language: string,
                    private gender: string,
                    private createdAt: string,
                    private createdBy: number,
                    private groups: RecreIO.Group[],
                    private email?: string,
                    private username?: string,
                    private visualPassword?: string) {}

        getLanguage = () => {
            return this.language;
        }
    }
}