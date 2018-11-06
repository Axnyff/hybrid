import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State, update } from 'store';
import { EntitiesState } from 'store/entities';
import { KeyboardState, keyboardUp, keyboardDown, Direction } from 'store/keyboard';
import { setWindowSize } from 'store/window';
import { GameState } from 'store/game';
import useHandleKeyBoard from 'effects/useHandleKeyboard';
import useHandleWindowSize from 'effects/useHandleWindowSize';
import useHandleGameLoop from 'effects/useHandleGameLoop';
import Level from 'container/Level';

interface Props {
  game: GameState;
  keyboard: KeyboardState;
  dispatchUpdate: () => void;
  dispatchKeyboardUp: (dir: Direction) => void;
  dispatchKeyboardDown: (dir: Direction) => void;
  dispatchSetWindowSize: (payload: { width: number, height: number }) => void;
};

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
  },
  {
    id: 'platform',
    x: 200,
    y: 100,
    speedX: 0,
    speedY: 0,
    width: 30,
    height: 30,
    jumpCount: 0,
    type: 'platform',
  },
  {
    id: 'platform2',
    x: 400,
    y: 50,
    speedX: 0,
    speedY: 0,
    width: 300,
    height: 300,
    jumpCount: 0,
    type: 'platform',
  },
];

const Game: React.SFC<Props> = (props) => {
  const {
    dispatchSetWindowSize,
    dispatchKeyboardUp,
    dispatchKeyboardDown,
    dispatchUpdate,
    game,
  } = props;

  useHandleKeyBoard({ dispatchKeyboardUp, dispatchKeyboardDown });
  useHandleWindowSize(dispatchSetWindowSize);
  useHandleGameLoop({ dispatchUpdate , game })

  return (
    <div>
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
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
