import Base from "./Base";

export default class Enemy extends Base {
  private moveDirection = { x: 0, y: 0 };
  private timeSinceLastDirectionChange = 0;
  private directionChangeInterval = 2;

  constructor(params) {
    super(params);
    this.randomizeDirection();
  }

  private randomizeDirection() {
    const angle = Math.random() * 2 * Math.PI;
    this.moveDirection.x = Math.cos(angle);
    this.moveDirection.y = Math.sin(angle);
  }

  public update(deltaTimeInSeconds: number): void {
    this.timeSinceLastDirectionChange += deltaTimeInSeconds;

    if (this.timeSinceLastDirectionChange > this.directionChangeInterval) {
      this.randomizeDirection();
      this.timeSinceLastDirectionChange = 0;
    }

    const time = deltaTimeInSeconds * this.timeRate;
    this.x += this.moveDirection.x * this.speed * time;
    this.y += this.moveDirection.y * this.speed * time;

    const newPos = this.checkBoundary(this.x, this.y);
    this.x = newPos.x;
    this.y = newPos.y;
    if (newPos.isHit) {
      this.randomizeDirection();
      this.timeSinceLastDirectionChange = 0;
    }
  }
}
