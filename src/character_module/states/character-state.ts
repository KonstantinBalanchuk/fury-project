import { ICharacterActions } from "./i-character-movement-actions";

export class CharacterState implements ICharacterActions {
    public idle(): CharacterState {
        throw new Error("Invalid operation")
    }
    public move(): CharacterState {
        throw new Error("Invalid operation")
    }
}