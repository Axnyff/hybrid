import { useEffect } from "react";
import music from "./zic.mp3";

const audio = new Audio(music);
audio.loop = true;

export default (paused: boolean, frameRate: number = 1) =>
  useEffect(
    () => {
      audio.playbackRate = frameRate;
      if (paused) {
        audio.pause();
      } else {
        audio.play();
      }
    },
    [paused, frameRate]
  );
