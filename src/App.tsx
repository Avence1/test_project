import React, { useRef, useEffect, useState } from "react";

import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./const";

import { Player, Enemy } from "./class";

import { checkCollision } from "./utils";

const KEY_MAP = {
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const App: React.FC = () => {
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  const canvasElRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasElRef.current) {
      setContext(canvasElRef.current.getContext("2d"));
    } else {
      setContext(null);
    }
  }, []);

  useEffect(() => {
    if (!context) return;
    const player = new Player();
    const enemy = new Enemy({
      color: "red",
      position: {
        x: Math.random() * (CANVAS_WIDTH - PLAYER_WIDTH),
        y: Math.random() * (CANVAS_HEIGHT - PLAYER_HEIGHT),
      },
      speed: 150,
      timeRate: 0.5,
    });

    const keysPressed: Record<string, boolean> = {
      up: false,
      down: false,
      left: false,
      right: false,
    };

    let lastTime: number = Date.now();
    let animationFrameId: number;

    const loopFun = () => {
      const now = Date.now();
      const deltaTimeInSeconds = (now - lastTime) / 1000;
      lastTime = now;

      player.update(keysPressed, deltaTimeInSeconds);
      enemy.update(deltaTimeInSeconds);

      context?.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      context.fillStyle = "black";
      context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      if (checkCollision(player, enemy)) {
        document.body.style.backgroundColor = "darkred";
      } else {
        document.body.style.backgroundColor = "#282c34";
      }

      player.draw(context);
      enemy.draw(context);

      animationFrameId = requestAnimationFrame(loopFun);
    };
    const keyDownHandle = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.key as keyof typeof KEY_MAP];
      if (key) {
        keysPressed[key] = true;
      }
      if (e.key === "j") {
        player.attack();
      }
    };
    const keyUpHandle = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.key as keyof typeof KEY_MAP];
      if (key) {
        keysPressed[key] = false;
      }
    };

    window.addEventListener("keydown", keyDownHandle);
    window.addEventListener("keyup", keyUpHandle);

    animationFrameId = requestAnimationFrame(loopFun);

    return () => {
      window.removeEventListener("keydown", keyDownHandle);
      window.removeEventListener("keyup", keyUpHandle);
      cancelAnimationFrame(animationFrameId);
    };
  }, [context]);

  return (
    <div>
      <canvas ref={canvasElRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
    </div>
  );
};

export default App;
