module RecreIO {

    export class Group {

        constructor(private id: number,
                    private name: string,
                    private role: string,
                    private type: string,
                    private parentId: number) {}
    }

}