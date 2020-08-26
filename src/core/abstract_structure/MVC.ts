import {IMVC} from "./IMVC";

export class MVC implements IMVC {
    public name: string;
    protected notifications: Array<{}> = new Array<{}>();

    constructor(name: string) {
        this.name = name;
    }
}
