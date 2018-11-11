import { useEffect } from "react";
import { EntitiesState } from "store/entities";
import { GameState } from "store/game";

interface Args {
  entities: EntitiesState;
  dispatchInitEntities: (entities: EntitiesState) => void;
  game: GameState;
}

export default ({ dispatchInitEntities, entities, game }: Args) => {
  useEffect(
    () => {
      if (!game.lost) {
        dispatchInitEntities(entities);
      }
    },
    [entities, game.lost]
  );
};
