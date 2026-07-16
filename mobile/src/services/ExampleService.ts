import type { Character } from "types/ExampleTypes";

import BaseService from "./BaseService";

export const apiGetCharacter = (id: number) => {
  return BaseService("/character/" + id).get() as Promise<Character>;
};
