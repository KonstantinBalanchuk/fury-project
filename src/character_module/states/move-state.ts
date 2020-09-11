import {IdleState} from './idle-state';
import gsap from "gsap";
import {TweenMax} from 'gsap/all';

import {State} from "./state";
import {DirectionState} from "./direction-state";

export class MoveState extends State {
    public move(): void {
        this.context.transitionTo(new MoveState());
        // @ts-ignore
        // TweenMax.delayedCall(0.5, () => {
        //     this.context.transitionTo(new IdleState());
        // });
    }

    public idle(): void {
        //stop
        this.context.transitionTo(new IdleState());
    }

    public changeDirection(): void {
        this.context.transitionTo(new DirectionState());
    }
}