import { useEffect } from "react";
import { GameState } from "store/game";

interface Args {
  dispatchUpdate: () => void;
  game: GameState;
  frameRate: number;
}

export default ({ dispatchUpdate, game, frameRate }: Args) => {
  useEffect(
    () => {
      if (!game.paused && !game.lost && !game.won) {
        const interval = window.setInterval(() => {
          dispatchUpdate();
        }, 1000 / (60 * frameRate));
        return () => window.clearInterval(interval);
      }
      return () => null;
    },
    [game, frameRate]
  );
};
