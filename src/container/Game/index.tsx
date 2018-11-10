import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State, update } from 'store';
import { Entity, EntitiesState } from 'store/entities';
import { KeyboardState, keyboardUp, keyboardDown, Direction } from 'store/keyboard';
import { setWindowSize } from 'store/window';
import { togglePause, setGame, GameState } from 'store/game';
import useHandleKeyBoard from 'effects/useHandleKeyboard';
import useHandleWindowSize from 'effects/useHandleWindowSize';
import useHandleGameLoop from 'effects/useHandleGameLoop';
import useHandlePause from 'effects/useHandlePause';
import Level from 'container/Level';
import PauseOverlay from 'components/PauseOverlay';
import LostOverlay from 'components/LostOverlay';
import WonOverlay from 'components/WonOverlay';

interface Props {
  game: GameState;
  keyboard: KeyboardState;
  dispatchUpdate: () => void;
  dispatchKeyboardUp: (dir: Direction) => void;
  dispatchKeyboardDown: (dir: Direction) => void;
  dispatchSetWindowSize: (payload: { width: number, height: number }) => void;
  dispatchTogglePause: () => void;
  dispatchRestartGame: () => void;
};

const createPlateform = ({ id, x, y, width, height }: { id: string, x: number, y: number, width: number, height: number}) : Entity => ({
  x, y, id, width, height,
  speedX: 0, speedY: 0, jumpCount: 0,
  type: 'platform',
});

const initialEntities: EntitiesState = [
  {
    id: 'player',
    x: 0,
    y: 0,
    speedX: 0,
    speedY: 0,
    width: 50,
    height: 50,
    jumpCount: 0,
    type: 'player',
  }, {
    id: 'door',
    x: 1000,
    y: 200,
    speedX: 0,
    speedY: 0,
    width: 20,
    height: 50,
    jumpCount: 0,
    type: 'door',
  }, {
    id: 'door2',
    x: 1200,
    y: 0,
    speedX: 0,
    speedY: 0,
    width: 20,
    height: 50,
    jumpCount: 0,
    type: 'door',
  }, {
    id: 'trap',
    x: 900,
    y: 90,
    speedX: 0,
    speedY: 0,
    width: 20,
    height: 50,
    jumpCount: 0,
    type: 'trap',
  },
  createPlateform({
    id: 'platform',
    x: 200,
    y: 100,
    width: 30,
    height: 30,
  }), createPlateform({
    id: 'platform2',
    x: 400,
    y: 50,
    width: 300,
    height: 300,
  }),
];

const Game: React.SFC<Props> = (props) => {
  const {
    dispatchSetWindowSize,
    dispatchKeyboardUp,
    dispatchKeyboardDown,
    dispatchUpdate,
    dispatchTogglePause,
    dispatchRestartGame,
    game,
  } = props;

  useHandleKeyBoard({ dispatchKeyboardUp, dispatchKeyboardDown });
  useHandleWindowSize(dispatchSetWindowSize);
  useHandleGameLoop({ dispatchUpdate , game })

  const toggler = game.lost ? dispatchRestartGame : dispatchTogglePause;
  useHandlePause({ toggler });

  return (
    <div>
      {game.paused && !game.lost ? <PauseOverlay /> : null }
      {game.lost ? <LostOverlay /> : null }
      {game.won ? <WonOverlay /> : null }
      <span>Current level: {game.level}</span>
      <Level key={game.level} initialEntities={initialEntities} />
    </div>
  );
};

const mapStateToProps = (state: State) => {
  return {
    keyboard: state.keyboard,
    game: state.game,
  };
};

const mapDispatchToProps = {
  dispatchUpdate: update,
  dispatchKeyboardUp: keyboardUp,
  dispatchKeyboardDown: keyboardDown,
  dispatchSetWindowSize: setWindowSize,
  dispatchTogglePause: togglePause,
  dispatchRestartGame: () => setGame({ lost: false, level: 1 }),
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
