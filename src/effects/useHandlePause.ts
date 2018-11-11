import { useEffect } from "react";

interface Input {
  toggler: () => void;
}

export default ({ toggler }: Input) => {
  useEffect(() => {
    let blocked = false;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.keyCode === 32 && !blocked) {
        blocked = true;
        toggler();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.keyCode === 32) {
        blocked = false;
      }

    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [toggler]);
};
