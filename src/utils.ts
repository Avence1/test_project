import { Player, Enemy } from "./class";

const checkCollision = (
  rectA: Player | Enemy,
  rectB: Player | Enemy
): boolean => {
  if (rectA.x > rectB.x + rectB.width) {
    return false;
  }
  if (rectA.x + rectA.width < rectB.x) {
    return false;
  }
  if (rectA.y > rectB.y + rectB.height) {
    return false;
  }
  if (rectA.y + rectA.height < rectB.y) {
    return false;
  }
  return true;
};

export { checkCollision };
