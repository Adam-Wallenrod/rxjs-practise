export abstract class Character {
  #color: string;

  #name: string;

  constructor(name: string, color: string) {
    this.#name = name;
    this.#color = color;
  }

  get color(): string {
    return this.#color;
  }

  get name(): string {
    return this.#name;
  }


  abstract createSprite(): void;

  abstract get isPlayable(): boolean;
}
