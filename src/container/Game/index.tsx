import LostOverlay from "components/LostOverlay";
import PauseOverlay from "components/PauseOverlay";
import WonOverlay from "components/WonOverlay";
import GameWonOverlay from "components/GameWonOverlay";
import Hub from "components/Hub";
import Level from "container/Level";
import useHandleGameLoop from "effects/useHandleGameLoop";
import useHandleKeyBoard from "effects/useHandleKeyboard";
import useHandlePause from "effects/useHandlePause";
import useHandleWindowSize from "effects/useHandleWindowSize";
import useHandleMusic from "effects/useHandleMusic";
import React from "react";
import { connect } from "react-redux";
import { State, update } from "store";
import { PlayerState } from "store/player";
import { GameState, setGame, togglePause } from "store/game";
import {
  Direction,
  keyboardDown,
  KeyboardState,
  keyboardUp
} from "store/keyboard";
import { setWindowSize } from "store/window";
import levels from "levels";

interface Props {
  game: GameState;
  player: PlayerState;
  keyboard: KeyboardState;
  dispatchUpdate: () => void;
  dispatchKeyboardUp: (dir: Direction) => void;
  dispatchKeyboardDown: (dir: Direction) => void;
  dispatchSetWindowSize: (payload: { width: number; height: number }) => void;
  dispatchTogglePause: () => void;
  dispatchRestartGame: () => void;
}

const Game: React.SFC<Props> = props => {
  const {
    dispatchSetWindowSize,
    dispatchKeyboardUp,
    dispatchKeyboardDown,
    dispatchUpdate,
    dispatchTogglePause,
    dispatchRestartGame,
    game,
    player
  } = props;

  useHandleMusic(game.paused, player.frameRate);
  useHandleKeyBoard({ dispatchKeyboardUp, dispatchKeyboardDown });
  useHandleWindowSize(dispatchSetWindowSize);
  useHandleGameLoop({ dispatchUpdate, game, frameRate: player.frameRate });

  const toggler = game.lost ? dispatchRestartGame : dispatchTogglePause;
  useHandlePause({ toggler });

  if (!levels[game.level]) {
    return <GameWonOverlay />;
  }

  return (
    <div>
      {game.paused && !game.lost ? <PauseOverlay /> : null}
      {game.lost ? <LostOverlay /> : null}
      {game.won ? <WonOverlay /> : null}
      <Hub level={game.level} eatenPills={player.eatenPills} />
      <Level key={game.level} pillCount={levels[game.level].pillCount} initialEntities={levels[game.level].entities} />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    keyboard: state.keyboard,
    game: state.game,
    player: state.player
  };
};

const mapDispatchToProps = {
  dispatchUpdate: update,
  dispatchKeyboardUp: keyboardUp,
  dispatchKeyboardDown: keyboardDown,
  dispatchSetWindowSize: setWindowSize,
  dispatchTogglePause: togglePause,
  dispatchRestartGame: () => setGame({ lost: false })
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
