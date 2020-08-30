import { IdleState } from "./idle-state";
import { CharacterState } from "./character-state";

export class MovementState extends CharacterState {
    public idle(): CharacterState {
        return new IdleState();
    }
    public move(): CharacterState {
        return new MovementState();
    }
}