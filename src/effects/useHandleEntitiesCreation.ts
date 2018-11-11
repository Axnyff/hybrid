import { useEffect } from "react";
import { Entity, EntitiesState } from "store/entities";
import { GameState } from "store/game";
import { WindowState } from "store/window";
import { allPills } from "store/pills";
import { hasOverlap } from "store/epics/helpers";

interface Args {
  entities: EntitiesState;
  dispatchInitEntities: (entities: EntitiesState) => void;
  dispatchInitPills: (payload: { x: number; y: number; id: string }[]) => void;
  game: GameState;
  window: WindowState;
}

const randBounded = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

const randPill = (window: WindowState) => {
  return {
    x: randBounded(0, window.width),
    y: randBounded(0, window.height),
    width: 15,
    height: 15
  } as Entity;
};

const findCoords = (window: WindowState, entities: EntitiesState) => {
  let pill = randPill(window);

  while (entities.find(entity => hasOverlap(pill, entity))) {
    pill = randPill(window);
  }
  return pill;
};

export default ({
  dispatchInitEntities,
  entities,
  game,
  window,
  dispatchInitPills
}: Args) => {
  useEffect(
    () => {
      if (!game.lost) {
        dispatchInitEntities(entities);
        const { x, y } = findCoords(window, entities);
        const pillIndex = randBounded(0, allPills.length);
        dispatchInitPills([
          {
            x,
            y,
            id: allPills[pillIndex]
          }
        ]);
      }
    },
    [entities, game.lost]
  );
};
