import 'phaser';
import levelConfig from '../config/levelConfig';

export default class Enemy extends Phaser.GameObjects.Image {
    constructor(scene, x, y, path) {
        super(scene, x, y, 'enemy');
        
        this.scene = scene;
        this.path = path;
        this.hp = 0;
        this.enemySpeed = 0;
        this.follower = {
            t: 0, 
            vec: new Phaser.Math.Vector2()
        };

        // add enemy to our scene
        this.scene.add.existing(this);
    }

    update(time, delta) {
        // move the t point along the path
        this.follower.t += this.enemySpeed * delta;

        // get x and y of the given t point
        this.path.getPoint(this.follower.t, this.follower.vec);

        // rotate enemy
        if (this.follower.vec.y > this.y && this.follower.vec.y != this.y) this.angle = 0;
        if (this.follower.vec.x > this.x && this.follower.vec.x != this.x) this.angle = -90;

        // set x and y pos of enemy
        this.setPosition(this.follower.vec.x, this.follower.vec.y);

        // if enemy reaches end of path, remove it
        if (this.follower.t >= 1) {
            this.setActive(false);
            this.setVisible(false);

            this.scene.updateHealth(100);
        }
    }

    startOnPath(level) {
        // reset health
        this.hp = levelConfig.initial.enemyHealth + (levelConfig.incremental.enemyHealth * level);
        // reset speed
        this.enemySpeed = levelConfig.initial.enemySpeed * (levelConfig.incremental.enemySpeed * level);

        // set t parameter at the start of path
        this.follower.t = 0

        // get x and y of the given t point
        this.path.getPoint(this.follower.t, this.follower.vec);

        // set x and y pos of enemy
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    }

    receiveDamage(damage) {
        this.hp -= damage;
        this.scene.updateScore(damage / 5);

        // if hp drops below 0, deactivate this enemy
        if (this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);

            this.scene.updateScore(100);
            this.scene.updateEnemies(-1);
        } 
    } 
}