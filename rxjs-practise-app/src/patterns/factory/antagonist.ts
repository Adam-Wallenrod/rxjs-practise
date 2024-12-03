import { Character } from './character';

export class Antagonist extends Character {

   createSprite() {
    console.log('Create sprite of non-playable character in the game.')
  }

  override get isPlayable(): boolean {
    return false;
  }
}
