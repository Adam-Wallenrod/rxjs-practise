import { Character } from './character';

export const createCharacter = (type: string, data: { name: string, color: string }): Character => {
  switch (type) {


    default: {
      throw new Error(`createCharacter: unsupported type ${type}`);
    }
  }
};
