/// <reference path="Group.ts" />

module RecreIO {

    export class User {

        constructor(public id: number,
                    private firstName: string,
                    private lastName: string,
                    public displayName: string,
                    private permissions: number,
                    public avatar: number,
                    public language: string,
                    public gender: string,
                    private createdAt: string,
                    private createdBy: number,
                    private groups: RecreIO.Group[],
                    public volume: number,
                    private email?: string,
                    private username?: string,
                    private visualPassword?: string) {}

    }
}