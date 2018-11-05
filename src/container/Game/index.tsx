import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { State } from 'store';
import { KeyboardState, keyboardUp, keyboardDown, Direction } from 'store/keyboard';
import { setWindowSize } from 'store/window';
import useHandleKeyBoard from 'effects/useHandleKeyboard';
import useHandleWindowSize from 'effects/useHandleWindowSize';

interface Props {
  keyboard: KeyboardState;
  dispatchKeyboardUp: (dir: Direction) => void;
  dispatchKeyboardDown: (dir: Direction) => void;
  dispatchSetWindowSize: (payload: { width: number, height: number }) => void;
};

const Game: React.SFC<Props> = (props) => {
  const {
    dispatchSetWindowSize,
    dispatchKeyboardUp,
    dispatchKeyboardDown,
  } = props;

  useHandleKeyBoard({ dispatchKeyboardUp, dispatchKeyboardDown });
  useHandleWindowSize(dispatchSetWindowSize);

  return (
    <pre>
      { JSON.stringify(props.keyboard) }
    </pre>
  );
};

const mapStateToProps = (state: State) => {
  return {
    keyboard: state.keyboard,
  };
};

const mapDispatchToProps = {
  dispatchKeyboardUp: keyboardUp,
  dispatchKeyboardDown: keyboardDown,
  dispatchSetWindowSize: setWindowSize,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
