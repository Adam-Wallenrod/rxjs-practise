import { Character } from './character';

export class Antagonist extends Character {

  createSprite() {
    console.log('Creates sprite of playable character.')
  }

   get isPlayable(): boolean {
    return true;
  }
}
