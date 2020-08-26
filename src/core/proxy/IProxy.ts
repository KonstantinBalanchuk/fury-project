import {IMVC} from "../abstract_structure/IMVC";

export interface IProxy extends IMVC {
    VO: any;

    setVO(vo: any): void

    getVO(): any
}
