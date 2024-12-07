import { Character } from './character';

export class Protagonist extends Character {

  createSprite() {
    console.log('Creates sprite of playable character.')
  }

   get isPlayable(): boolean {
    return true;
  }
}
