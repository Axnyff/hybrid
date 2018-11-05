import { useEffect } from 'react';
import { Direction } from 'store/keyboard';

type Input = {
  dispatchKeyboardUp: (dir: Direction) => void;
  dispatchKeyboardDown: (dir: Direction) => void;
};

const keyCodeMap : {[K: number]: Direction } = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down',
};

export default ({ dispatchKeyboardUp, dispatchKeyboardDown }: Input) => {
  useEffect(() => {
    const handleKeyboardUp = (event: KeyboardEvent) => {
      const direction : Direction = keyCodeMap[event.keyCode];
      if (direction) {
        dispatchKeyboardUp(direction);
      }
    };

    const handleKeyboardDown = (event: KeyboardEvent) => {
      const direction : Direction = keyCodeMap[event.keyCode];
      if (direction) {
        dispatchKeyboardDown(direction);
      }
    };

    window.addEventListener('keyup', handleKeyboardUp);
    window.addEventListener('keydown', handleKeyboardDown);

    return () => {
      window.removeEventListener('keyup', handleKeyboardUp);
      window.removeEventListener('keydown', handleKeyboardUp);
    };
  }, []);
};
