import Player from "./Player";

import {
  SWORD_WIDTH,
  SWORD_HEIGHT,
  ATTACK_DURATION,
  ATTACK_PRE_DELAY,
  ATTACK_RECOVERY_DELAY,
} from "../const";

interface WeaponOption {
  owner: Player;
  width?: number;
  height?: number;
  attackDuration?: {
    pre?: number;
    active?: number;
    recovery?: number;
  };
}

type actionKeyType = "pre" | "active" | "recovery";

class Weapon {
  private owner: Player;
  private x: number;
  private y: number;
  private width = SWORD_WIDTH;
  private height = SWORD_HEIGHT;
  private isAttacking = false;
  private actionStatus: Record<actionKeyType, boolean> = {
    pre: false,
    active: false,
    recovery: false,
  };
  private attackDuration: Record<actionKeyType, number> = {
    pre: ATTACK_PRE_DELAY,
    active: ATTACK_DURATION,
    recovery: ATTACK_RECOVERY_DELAY,
  };
  private attackTimer: Record<actionKeyType, number> = {
    pre: 0,
    active: 0,
    recovery: 0,
  };

  constructor(params: WeaponOption) {
    this.width = params.width ?? SWORD_WIDTH;
    this.height = params.height ?? SWORD_HEIGHT;
    this.attackDuration = {
      pre: params.attackDuration?.pre ?? ATTACK_PRE_DELAY,
      active: params.attackDuration?.active ?? ATTACK_DURATION,
      recovery: params.attackDuration?.recovery ?? ATTACK_RECOVERY_DELAY,
    };
    this.owner = params.owner;
    this.x = 0;
    this.y = 0;
  }

  private consumeAction(leftTime: number) {
    if (this.attackTimer.pre > 0) {
      if (leftTime > this.attackTimer.pre) {
        this.attackTimer.pre = 0;
        this.consumeAction(leftTime - this.attackTimer.pre);
      } else {
        this.attackTimer.pre = this.attackTimer.pre - leftTime;
      }
      return;
    }

    if (this.attackTimer.active > 0) {
      if (leftTime > this.attackTimer.active) {
        this.attackTimer.active = 0;
        this.consumeAction(leftTime - this.attackTimer.active);
      } else {
        this.attackTimer.active = this.attackTimer.active - leftTime;
      }
      return;
    }

    if (this.attackTimer.recovery > 0) {
      if (leftTime > this.attackTimer.recovery) {
        this.attackTimer.recovery = 0;
        this.consumeAction(leftTime - this.attackTimer.recovery);
      } else {
        this.attackTimer.recovery = this.attackTimer.recovery - leftTime;
      }
      return;
    }
  }

  public startAttack() {
    if (!this.isAttacking) {
      this.isAttacking = true;
      this.actionStatus = {
        pre: true,
        active: false,
        recovery: false,
      };
      this.attackTimer = { ...this.attackDuration };
    }
  }

  public update(deltaTimeInSeconds: number) {
    if (this.isAttacking) {
      this.consumeAction(deltaTimeInSeconds);

      this.actionStatus = {
        pre: this.attackTimer.pre > 0,
        active: this.attackTimer.active > 0 && this.attackTimer.pre <= 0,
        recovery:
          this.attackTimer.recovery > 0 &&
          this.attackTimer.pre <= 0 &&
          this.attackTimer.active <= 0,
      };

      if (
        Object.values(this.attackTimer).reduce((p, c) => {
          return Number(p) + Number(c);
        }, 0) <= 0
      ) {
        this.isAttacking = false;
        this.attackTimer = { ...this.attackDuration };
      }
    } else {
      this.attackTimer = {
        pre: 0,
        active: 0,
        recovery: 0,
      };

      this.actionStatus = {
        pre: false,
        active: false,
        recovery: false,
      };
    }

    const dirLength = Math.sqrt(
      this.owner.lastMoveDirection.x ** 2 + this.owner.lastMoveDirection.y ** 2
    );
    const normalizedDirX =
      dirLength > 0 ? this.owner.lastMoveDirection.x / dirLength : 1;
    const normalizedDirY =
      dirLength > 0 ? this.owner.lastMoveDirection.y / dirLength : 0;
    this.x = this.owner.x + this.owner.width / 2 + normalizedDirX * 20;
    this.y = this.owner.y + this.owner.height / 2 + normalizedDirY * 20;

    if (this.actionStatus.pre) {
      this.x += normalizedDirX * 0;
      this.y += normalizedDirY * 0;
    }

    if (this.actionStatus.active) {
      this.x += normalizedDirX * 20;
      this.y += normalizedDirY * 20;
    }

    if (this.actionStatus.recovery) {
      this.x += normalizedDirX * 20;
      this.y += normalizedDirY * 20;
    }
  }

  public draw(context: CanvasRenderingContext2D) {
    context.fillStyle = "silver";
    // 这里的绘制逻辑可以更复杂，比如根据方向旋转剑
    context.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }
}
export default Weapon;
