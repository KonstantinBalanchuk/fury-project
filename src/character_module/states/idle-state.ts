import { MovementState } from "./movement-state";
import { CharacterState } from "./character-state";
export class IdleState extends CharacterState {
    public move(): CharacterState {
        return new MovementState();
    }
}