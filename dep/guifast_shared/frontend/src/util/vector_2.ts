export class Vector2 {
    public x: number;
    public y: number;

    public static get zero(): Vector2 {
        return new Vector2(0, 0);
    }

    public add(rhs: Vector2): Vector2 {
        return new Vector2(
            this.x + rhs.x,
            this.y + rhs.y
        );
    }

    public divideNumber(rhs: number): Vector2 {
        return new Vector2 (
            this.x / rhs,
            this.y / rhs
        );
    }

    public multiplyNumber(rhs: number): Vector2 {
        return new Vector2 (
            this.x * rhs,
            this.y * rhs
        );
    }

    public multiplyVector(rhs: Vector2): Vector2 {
        return new Vector2(
            this.x * rhs.x,
            this.y * rhs.y
        );
    }

    public subtract(rhs: Vector2): Vector2 {
        return new Vector2(
            this.x - rhs.x,
            this.y - rhs.y
        );
    }

    public constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}
