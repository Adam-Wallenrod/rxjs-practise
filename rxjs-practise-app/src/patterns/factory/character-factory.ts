import { Antagonist } from './antagonist';
import { Character } from './character';
import { GameCharacter } from './game-characters.enum';
import { Protagonist } from './protagonist';



export const createCharacter = (type: GameCharacter, data: { name: string, color: string }): Character => {
  switch (type) {
    case GameCharacter.ANTAGONIST:
      return new Antagonist(data.name, data.color);

    case GameCharacter.PROTAGONIST:
      return new Protagonist(data.name, data.color);

    default: {
      throw new Error(`createCharacter: unsupported type ${type}`);
    }
  }
};
