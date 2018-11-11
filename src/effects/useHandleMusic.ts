import { useEffect } from "react";
import music from "./zic.mp3";

const audio = new Audio(music);
audio.loop = true;

export default (paused: boolean) =>
  useEffect(
    () => {
      if (paused) {
        audio.pause();
      } else {
        audio.play();
      }
    },
    [paused]
  );
