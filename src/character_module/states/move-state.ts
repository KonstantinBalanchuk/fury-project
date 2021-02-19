import {IdleState} from './idle-state';

import {State} from "./state";
import {DirectionState} from "./direction-state";

export class MoveState extends State {
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