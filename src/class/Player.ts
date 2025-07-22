import Base from "./Base";
import Weapon from "./weapon";

class Player extends Base {
  public lastMoveDirection = { x: 1, y: 0 };
  public weapon: Weapon;

  constructor() {
    super();
    this.weapon = new Weapon({
      owner: this,
      attackDuration: {
        pre: 0.15,
        active: 0.3,
        recovery: 0.1,
      },
    });
  }

  public update(
    keysPressed: Record<string, boolean>,
    deltaTimeInSeconds: number
  ) {
    let xSpeed = 0;
    let ySpeed = 0;
    let xInput = 0;
    let yInput = 0;

    if (keysPressed.left) {
      xSpeed -= this.speed;
      xInput -= 1;
    }
    if (keysPressed.right) {
      xSpeed += this.speed;
      xInput += 1;
    }
    if (keysPressed.up) {
      ySpeed -= this.speed;
      yInput -= 1;
    }
    if (keysPressed.down) {
      ySpeed += this.speed;
      yInput += 1;
    }

    if (xInput !== 0 || yInput !== 0) {
      this.lastMoveDirection.x = xInput;
      this.lastMoveDirection.y = yInput;
    }

    this.weapon.update(deltaTimeInSeconds);

    const time = deltaTimeInSeconds * (this.timeRate ?? 1);

    const normalized = this.normalized(xSpeed, ySpeed);
    this.x += normalized.x * this.speed * time;
    this.y += normalized.y * this.speed * time;

    const newPos = this.checkBoundary(this.x, this.y);

    this.x = newPos.x;
    this.y = newPos.y;
  }

  public attack() {
    this.weapon.startAttack();
  }

  public draw(context: CanvasRenderingContext2D) {
    super.draw(context);
    this.weapon.draw(context);
  }
}

export default Player;
