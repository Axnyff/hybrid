import { useEffect } from "react";
import { Entity, EntitiesState } from "store/entities";
import { GameState } from "store/game";
import { WindowState } from "store/window";
import { allPills } from "store/pills";
import { hasOverlap } from "store/epics/helpers";

export type PillPayload = {
  x: number;
  y: number;
  type: string;
  id: number;
}[];

interface Args {
  entities: EntitiesState;
  dispatchInitEntities: (entities: EntitiesState) => void;
  dispatchInitPills: (payload: PillPayload) => void;
  game: GameState;
  pillCount: number;
  window: WindowState;
}

const randBounded = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min) + min);

const randPill = (window: WindowState) => {
  return {
    x: randBounded(0, Math.min(window.width, 1000) - 15),
    y: randBounded(0, window.height - 15),
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

let pillsCount = 0;
const genPills = (
  count: number,
  window: WindowState,
  entities: EntitiesState
): PillPayload =>
  Array.from({ length: count }).map(() => {
    const { x, y } = findCoords(window, entities);
    const pillIndex = randBounded(0, allPills.length);
    return {
      x,
      y,
      type: allPills[pillIndex],
      id: pillsCount++
    };
  });

export default ({
  dispatchInitEntities,
  entities,
  pillCount,
  game,
  window,
  dispatchInitPills
}: Args) => {
  useEffect(
    () => {
      if (!game.lost) {
        dispatchInitEntities(entities);
        dispatchInitPills(genPills(pillCount, window, entities));
      }
    },
    [entities, game.lost]
  );
};
