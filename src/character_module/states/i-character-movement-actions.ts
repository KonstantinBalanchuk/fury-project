export interface ICharacterActions {
    idle(): void
    move(direction: { [name: string]: boolean }): void
}