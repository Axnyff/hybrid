import { useEffect } from 'react';

type Input = {
  dispatchTogglePause: () => void;
};

export default ({ dispatchTogglePause }: Input) => {
  useEffect(() => {
    let blocked = false;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 32 && !blocked) {
        blocked = true;
        dispatchTogglePause();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.keyCode === 32 ) {
        blocked = false;
      }

    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
};
