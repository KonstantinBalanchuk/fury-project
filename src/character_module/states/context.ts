import {State} from "./state";

export class Context {
    /**
     * @type {State} A reference to the current state of the Context.
     */
    private state!: State;

    constructor(state: State) {
        this.transitionTo(state);
    }

    /**
     * The Context allows changing the State object at runtime.
     */
    public transitionTo(state: State): void {
        this.state = state;
        this.state.setContext(this);
    }

    /**
     * The Context delegates part of its behavior to the current State object.
     */
    public move(direction: { [name: string]: boolean }): void {
        this.state.move();
    }

    public idle(): void {
        this.state.idle();
    }

    public changeDirection(prevDirection: { [name: string]: boolean }, newDirection: { [name: string]: boolean }): void {
        //changeDirection
        this.state.changeDirection();
    }
}