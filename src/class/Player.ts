import Base from "./Base";
import Weapon from "./weapon";

class Player extends Base {
  public lastMoveDirection = { x: 1, y: 0 };
  public weapon: Weapon;

  constructor() {
    super({ position: { x: 10, y: 240 } });
    this.weapon = new Weapon({
      owner: this,
      attackDuration: {
        pre: 0.2,
        active: 0.1,
        recovery: 0.2,
      },
    });
  }

  public update(
    keysPressed: Record<string, boolean>,
    deltaTimeInSeconds: number
  ) {
    this.applyGravity(deltaTimeInSeconds);

    let xInput = 0;

    if (keysPressed.left) {
      xInput -= 1;
    }
    if (keysPressed.right) {
      xInput += 1;
    }

    if (xInput !== 0) {
      this.lastMoveDirection.x = xInput;
    }

    this.x += xInput * this.speed * deltaTimeInSeconds;

    const newPos = this.checkBoundary(this.x, this.y);

    this.x = newPos.x;
    this.y = newPos.y;
    this.weapon.update(deltaTimeInSeconds);
  }

  public attack() {
    this.weapon.startAttack();
  }

  public throwAttack() {
    this.weapon.throwAttack();
  }

  public jump() {
    if (this.onGround) {
      this.onGround = false;
      this.vz = 600;
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    super.draw(context);
    this.weapon.draw(context);
  }
}

export default Player;
