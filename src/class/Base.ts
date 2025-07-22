import {
  PLAYER_WIDTH,
  PLAYER_HEIGHT,
  SPEED,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "../const";

export default class Base {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
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
  }

  public draw(context: CanvasRenderingContext2D): void {
    if (context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.width, this.height);
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
}
