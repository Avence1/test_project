import Player from "./Player";

import {
  SWORD_WIDTH,
  SWORD_HEIGHT,
  ATTACK_DURATION,
  ATTACK_PRE_DELAY,
  ATTACK_RECOVERY_DELAY,
} from "../const";

type WeaponState = "idle" | "swinging" | "throwing";

interface WeaponOption {
  owner: Player;
  width?: number;
  height?: number;
  attackDuration?: {
    pre: number;
    active: number;
    recovery: number;
  };
}

type actionKeyType = "pre" | "active" | "recovery";

class Weapon {
  private owner: Player;
  private x: number;
  private y: number;
  private z: number;
  private vz: number;
  private width: number;
  private height: number;

  private currentState: WeaponState = "idle";
  private actionTimer: number = 0;
  private attackDuration: Record<actionKeyType, number> = {
    pre: ATTACK_PRE_DELAY,
    active: ATTACK_DURATION,
    recovery: ATTACK_RECOVERY_DELAY,
  };

  private throwStartX: number = 0;
  private throwStartY: number = 0;
  private throwDirection = { x: 1, y: 0 };

  constructor(params: WeaponOption) {
    this.width = params.width ?? SWORD_WIDTH;
    this.height = params.height ?? SWORD_HEIGHT;

    this.owner = params.owner;
    this.x = 0;
    this.y = 0;
    this.z = this.owner.z;
    this.vz = this.owner.vz;
    if (params.attackDuration) {
      this.attackDuration = { ...params.attackDuration };
    }
  }

  private updateIdleState() {
    const dir = this.normalized(
      this.owner.lastMoveDirection.x,
      this.owner.lastMoveDirection.y
    );
    this.x = this.owner.x + this.owner.width / 2 + dir.x * 10;
    this.y = this.owner.y + this.owner.height / 2 + dir.y * 10;
    this.z = this.owner.z;
  }

  private updateSwingingState() {
    this.updateIdleState();
    const totalDuration =
      this.attackDuration.pre +
      this.attackDuration.active +
      this.attackDuration.recovery;
    if (this.actionTimer > totalDuration) {
      this.currentState = "idle";
    }
  }

  private updateThrowingState() {
    const throwDuration = 0.5;
    const halfThrow = throwDuration / 2;
    if (this.actionTimer < halfThrow) {
      const progress = this.actionTimer / halfThrow;
      this.x = this.throwStartX + this.throwDirection.x * 200 * progress;
      this.y = this.throwStartY + this.throwDirection.y * 200 * progress;
    } else {
      const progress = (this.actionTimer - halfThrow) / halfThrow;
      this.x = this.throwStartX + this.throwDirection.x * 200 * (1 - progress);
      this.y = this.throwStartY + this.throwDirection.y * 200 * (1 - progress);
    }
    this.z = this.owner.z;
    if (this.actionTimer > throwDuration) {
      this.currentState = "idle";
    }
  }

  public startAttack() {
    if (this.currentState === "idle") {
      this.currentState = "swinging";
      this.actionTimer = 0;
    }
  }
  public throwAttack() {
    if (this.currentState === "idle") {
      this.currentState = "throwing";
      this.actionTimer = 0;

      this.throwStartX = this.owner.x;
      this.throwStartY = this.owner.y;

      this.throwDirection.x = this.owner.lastMoveDirection.x;
      this.throwDirection.y = this.owner.lastMoveDirection.y;
    }
  }

  public update(deltaTimeInSeconds: number) {
    this.actionTimer += deltaTimeInSeconds;
    switch (this.currentState) {
      case "idle":
        this.updateIdleState();
        break;
      case "swinging":
        this.updateSwingingState();
        break;
      case "throwing":
        this.updateThrowingState();
        break;
    }
  }

  public checkStatus(): {
    pre: boolean;
    active: boolean;
    recovery: boolean;
  } {
    if (this.currentState !== "swinging") {
      return { pre: false, active: false, recovery: false };
    }
    const preTime = this.attackDuration.pre;
    const activeTime = preTime + this.attackDuration.active;
    const recoveryTime = activeTime + this.attackDuration.recovery;
    const timeLine = [preTime, activeTime, recoveryTime, this.actionTimer].sort(
      (a, b) => a - b
    );
    const currentIndex = timeLine.findIndex((t) => t === this.actionTimer);
    return {
      pre: currentIndex < 1,
      active: currentIndex >= 1 && currentIndex < 2,
      recovery: currentIndex >= 2 && currentIndex < 3,
    };
  }

  public draw(context: CanvasRenderingContext2D) {
    let angle = Math.atan2(
      this.owner.lastMoveDirection.y,
      this.owner.lastMoveDirection.x
    );

    const preTime = this.attackDuration.pre;
    const activeTime = preTime + this.attackDuration.active;
    const recoveryTime = activeTime + this.attackDuration.recovery;

    if (this.currentState === "swinging") {
      if (this.actionTimer < preTime) {
        const preProcess = this.actionTimer / this.attackDuration.pre;
        angle -= (Math.PI / 180) * 60 * preProcess;
      } else if (this.actionTimer < activeTime) {
        const activeProcess =
          (this.actionTimer - preTime) / this.attackDuration.active;
        angle -= (Math.PI / 180) * 60;
        angle += (Math.PI / 180) * (60 * 2) * activeProcess;
      } else if (this.actionTimer < recoveryTime) {
        const recoveryProgress =
          (this.actionTimer - activeTime) / this.attackDuration.recovery;
        angle += (Math.PI / 180) * 60;
        angle -= (Math.PI / 180) * 60 * recoveryProgress;
      }
    }
    if (this.currentState === "throwing") {
      angle += this.actionTimer * 20;
    }

    context.save();
    context.translate(this.x, this.y - this.z);
    context.rotate(angle);
    context.fillStyle = "silver";
    context.fillRect(0, -this.height / 2, this.width, this.height);
    context.restore();
  }

  private normalized(x: number, y: number): { x: number; y: number } {
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
export default Weapon;
