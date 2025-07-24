import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  SPEED,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GRAVITY,
} from "../const";

export default class Base {
  public x: number;
  public y: number;
  public z: number;
  public vz: number;
  public width: number;
  public height: number;

  protected onGround: boolean;
  protected speed: number;
  protected color: string;
  protected timeRate: number;

  constructor(params?: {
    color?: string;
    position?: { x?: number; y?: number };
    style?: {
      width?: number;
      height?: number;
    };
    speed?: number;
    timeRate?: number;
  }) {
    this.x = params?.position?.x ?? 0;
    this.y = params?.position?.y ?? 0;
    this.width = params?.style?.width ?? PLAYER_WIDTH;
    this.height = params?.style?.height ?? PLAYER_HEIGHT;
    this.speed = params?.speed ?? SPEED;
    this.color = params?.color ?? "white";
    this.timeRate = params?.timeRate ?? 1;
    this.z = 0;
    this.vz = 0;
    this.onGround = true;
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (context) {
      context.fillStyle = "rgba(0, 0, 0, 0.3)";
      context.beginPath();
      context.ellipse(
        this.x + this.width / 2,
        this.y + this.height,
        this.width / 2,
        this.width / 4,
        0,
        0,
        2 * Math.PI
      );
      context.fill();
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y - this.z, this.width, this.height);
    }
  }
  public checkBoundary(
    x: number,
    y: number
  ): { x: number; y: number; isHit: boolean } {
    const res = { x, y };
    let hitBoundary = false;
    if (x >= CANVAS_WIDTH - PLAYER_WIDTH) {
      res.x = CANVAS_WIDTH - PLAYER_WIDTH;
      hitBoundary = true;
    } else if (x <= 0) {
      res.x = 0;
      hitBoundary = true;
    }
    if (y >= CANVAS_HEIGHT - PLAYER_HEIGHT) {
      res.y = CANVAS_HEIGHT - PLAYER_HEIGHT;
      hitBoundary = true;
    } else if (y <= 0) {
      res.y = 0;
      hitBoundary = true;
    }
    return { ...res, isHit: hitBoundary };
  }
  protected normalized(x: number, y: number): { x: number; y: number } {
    const length = Math.sqrt(x ** 2 + y ** 2);
    if (length > 0) {
      // 归一化
      const normalizedX = x / length;
      const normalizedY = y / length;
      return {
        x: normalizedX,
        y: normalizedY,
      };
    }
    return {
      x,
      y,
    };
  }
  protected applyGravity(deltaTime: number) {
    this.z += this.vz * deltaTime - 0.5 * GRAVITY * deltaTime ** 2;

    if (!this.onGround) {
      this.vz -= GRAVITY * deltaTime;
    }
    if (this.z <= 0) {
      this.z = 0;
      this.vz = 0;
      this.onGround = true;
      // if (Math.abs(this.vz) <= 120) {
      //   this.vz = 0;
      //   this.onGround = true;
      // } else {
      //   this.vz = -this.vz * 0.5;
      //   this.onGround = false;
      // }
    }
  }
}
