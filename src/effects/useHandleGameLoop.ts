import { GameState } from 'store/game';
import { useEffect } from 'react';
import { interval } from 'rxjs';

interface Args {
  dispatchUpdate: () => void;
  game: GameState;
};

export default ({ dispatchUpdate, game} : Args) => {
  useEffect(() => {
    if (!game.paused && !game.lost && !game.won) {
      const interval = window.setInterval(() => {
        dispatchUpdate();
      }, 1000 / 60);
      return () => window.clearInterval(interval);
    }
  }, [game]);
};
