import {IdleState} from './idle-state';

import {State} from "./state";
import {MoveState} from "./move-state";

export class DirectionState extends State {
    public move(): void {
        this.context.transitionTo(new MoveState());
    }

    public idle(): void {
        //stop
        this.context.transitionTo(new IdleState());
    }

    public changeDirection(): void {
        this.context.transitionTo(new DirectionState());
    }
}