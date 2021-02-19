import {Context} from "./context";

export abstract class State {
     protected context!: Context;

     public setContext(context: Context) {
          this.context = context;
     }

     public abstract move(): void;

     public abstract idle(): void;

     public abstract changeDirection(): void;
}