import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State, update } from 'store';
import { Entity, EntitiesState } from 'store/entities';
import { KeyboardState, keyboardUp, keyboardDown, Direction } from 'store/keyboard';
import { setWindowSize } from 'store/window';
import { togglePause, GameState } from 'store/game';
import useHandleKeyBoard from 'effects/useHandleKeyboard';
import useHandleWindowSize from 'effects/useHandleWindowSize';
import useHandleGameLoop from 'effects/useHandleGameLoop';
import useHandlePause from 'effects/useHandlePause';
import Level from 'container/Level';
import PauseOverlay from 'components/PauseOverlay';

interface Props {
  game: GameState;
  keyboard: KeyboardState;
  dispatchUpdate: () => void;
  dispatchKeyboardUp: (dir: Direction) => void;
  dispatchKeyboardDown: (dir: Direction) => void;
  dispatchSetWindowSize: (payload: { width: number, height: number }) => void;
  dispatchTogglePause: () => void;
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
  }, createPlateform({
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
    game,
  } = props;

  useHandleKeyBoard({ dispatchKeyboardUp, dispatchKeyboardDown });
  useHandleWindowSize(dispatchSetWindowSize);
  useHandleGameLoop({ dispatchUpdate , game })
  useHandlePause({ dispatchTogglePause });

  return (
    <div>
      {game.paused ? <PauseOverlay /> : null }
      <Level initialEntities={initialEntities} />
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
