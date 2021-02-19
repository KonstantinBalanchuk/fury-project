import {State} from "./state";
import {MoveState} from "./move-state";
import {DirectionState} from "./direction-state";

export class IdleState extends State {
    public move(): void {
        this.context.transitionTo(new MoveState());
    }

    public idle(): void {
        throw new Error('Idle')
    }

    public changeDirection(): void {
        this.context.transitionTo(new DirectionState());
    }
}