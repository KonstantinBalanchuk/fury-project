import { MovementState } from "./movement-state";
import { CharacterState } from "./character-state";
export class IdleState extends CharacterState {
    public idle(): CharacterState {
        return new IdleState();
    }
    public move(): CharacterState {
        return new MovementState();
    }
}