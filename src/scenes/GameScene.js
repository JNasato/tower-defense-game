import 'phaser';
import map from '../config/map';
import Enemy from '../objects/Enemy';
import Turret from '../objects/Turret';
import Bullet from '../objects/Bullet';
import levelConfig from '../config/levelConfig';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    init() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        this.map = map.map(arr => arr.slice());
        this.roundStarted = false;
        this.level = 1;
        this.nextEnemy = 0;
        this.score = 0;
        this.baseHealth = levelConfig.initial.baseHealth;
        this.availableTurrets = levelConfig.initial.numOfTurrets;
        this.remainingEnemies = levelConfig.initial.numOfEnemies + this.level * levelConfig.incremental.numOfEnemies;

        this.events.emit('displayUI');
        this.events.emit('updateScore', this.score);
        this.events.emit('updateHealth', this.baseHealth);
        this.events.emit('updateTurrets', this.availableTurrets);
        this.events.emit('updateEnemies', this.remainingEnemies);

        // grab reference to the UIScene
        this.UIScene = this.scene.get('UI');
    }
      
    create() {
        this.events.emit('startRound', this.level);
        this.UIScene.events.on('roundReady', function() {
            this.roundStarted = true;
        }.bind(this));

        this.createMap();
        this.createPath();
        this.createCursor();
        this.createGroups();
    }

    update(time, delta) {
        // check if its time for next enemy
        if (time > this.nextEnemy && this.roundStarted && this.enemies.countActive(true) < this.remainingEnemies) {
            let enemy = this.enemies.getFirstDead(); 
            if (!enemy) {
                enemy = new Enemy(this, 0, 0, this.path);
                this.enemies.add(enemy);
            }

            if (enemy) {
                enemy.setActive(true);
                enemy.setVisible(true);

                // place enemy at the start of the path
                enemy.startOnPath(this.level);

                this.nextEnemy = time + 2000;   
            }
        }
    }

    updateScore(score) {
        this.score += score;
        this.events.emit('updateScore', this.score);
    }

    updateHealth(health) {
        this.baseHealth -= health;
        this.events.emit('updateHealth', this.baseHealth);

        if (this.baseHealth <= 0) {
            this.events.emit('hideUI');

            this.scene.start('Dead');
        }
    }

    updateTurrets(numOfTurrets) {
        this.availableTurrets += numOfTurrets;
        this.events.emit('updateTurrets', this.availableTurrets);
    }

    updateEnemies(numOfEnemies) {
        this.remainingEnemies += numOfEnemies;
        this.events.emit('updateEnemies', this.remainingEnemies);
        
        if (this.remainingEnemies <= 0) {
            this.updateScore(500);
            this.increaseLevel();
        }
    }

    increaseLevel() {
        //stop current round
        this.roundStarted = false;
        // increment level
        this.level++;
        // increment number of turrets
        this.updateTurrets(levelConfig.incremental.numOfTurrets);
        // increment number of enemies
        this.updateEnemies(levelConfig.initial.numOfEnemies + this.level * levelConfig.incremental.numOfEnemies);
        this.events.emit('startRound', this.level);
    }

    createGroups() {
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.turrets = this.add.group({ classType: Turret, runChildUpdate: true });
        this.bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

        this.physics.add.overlap(this.enemies, this.bullets, this.damageEnemy.bind(this));
        this.input.on('pointerdown', this.placeTurret.bind(this));  
    }

    createMap() {
        // create game map
        this.bgMap = this.make.tilemap({ key: 'level1' });
        // add tileset image
        this.tiles = this.bgMap.addTilesetImage('terrainTiles_default');
        // create background layer
        this.backgroundLayer = this.bgMap.createStaticLayer('Background', this.tiles, 0, 0);

        // add base
        this.add.image(480, 480, 'base');
    }

    createPath() {
        this.graphics = this.add.graphics();
        // the path the enemies follow
        this.path = this.add.path(96, -32);
        this.path.lineTo(96, 164);
        this.path.lineTo(480, 164);
        this.path.lineTo(480, 544);

        // visualizing the path (for development)
        // this.graphics.lineStyle(3, 0xffffff, 1);
        // this.path.draw(this.graphics);
    }

    createCursor() {
        this.cursor = this.add.image(32, 32, 'cursor');
        this.cursor.setScale(2).alpha = 0;

        this.input.on('pointermove', function(pointer) {
            let i = Math.floor(pointer.y / 64);
            let j = Math.floor(pointer.x / 64);

            if (this.canPlaceTurret(i, j)) {
                this.cursor.setPosition(j * 64 + 32, i * 64 + 32);
                this.cursor.alpha = 0.8;
            } else {
                this.cursor.alpha = 0;
            }
        }.bind(this));
    }

    canPlaceTurret(i, j) {
        return this.map[i][j] === 0 && this.availableTurrets > 0;
    }

    placeTurret(pointer) {
        let i = Math.floor(pointer.y / 64);
        let j = Math.floor(pointer.x / 64);

        if (this.canPlaceTurret(i, j)) {
            let turret = this.turrets.getFirstDead();
            if (!turret) {
                turret = new Turret(this, 0, 0, this.map);
                this.turrets.add(turret);
            }
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i, j);
            this.updateTurrets(-1);
        }
    }

    getEnemy(x, y, distance) {
        const enemyUnits = this.enemies.getChildren();
        for (let unit of enemyUnits) {
            if (unit.active && Phaser.Math.Distance.Between(x, y, unit.x, unit.y) <= distance) {
                return unit;
            }
        }
        return false;
    }

    addBullet(x, y, angle) {
        let bullet = this.bullets.getFirstDead();
        if (!bullet) {
            bullet = new Bullet(this, 0, 0);
            this.bullets.add(bullet);
        }
        bullet.fire(x, y, angle);
    }


    damageEnemy(enemy, bullet) {
        if (enemy.active && bullet.active) {
            bullet.setActive(false);
            bullet.setVisible(false);

            // decrease enemy HP
            enemy.receiveDamage(levelConfig.initial.bulletDamage);
        }
    }
}