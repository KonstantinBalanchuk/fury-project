import {MVC} from "../abstract_structure/MVC";
import {IProxy} from "./IProxy";

export class Proxy extends MVC implements IProxy {
    public VO: any;

    public setVO(vo: any) {
        this.VO = vo;
    }

    public getVO(): any {
        return this.VO;
    }
}