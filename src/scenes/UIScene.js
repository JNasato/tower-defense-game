import 'phaser';

export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UI', active: true });
    }

    init() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;

        // grab reference to gameScene
        this.gameScene = this.scene.get('Game');
    }

    create() {
        this.setupUIElements();
        this.setupEvents();
    }

    setupUIElements() {
        this.scoreText = this.add.text(5, 5, 'Score: 0', {
            fontSize: '16px',
            fill: '#000000'
        });
        
        this.healthText = this.add.text(10, 490, 'Base Health: 0', {
            fontSize: '16px',
            fill: '#000000'
        });

        this.turretsText = this.add.text(430, 5, 'Available Turrets: 0', {
            fontSize: '16px',
            fill: '#000000'
        });

        this.roundTimeText = this.add.text(180, 5, 'Round Starts In: 5', {
            fontSize: '16px',
            fill: '#000000'
        });
        
        this.enemiesText = this.add.text(10, 470, 'Enemies Remaining: 0', {
            fontSize: '16px',
            fill: '#000000'
        });

        this.levelText = this.add.text(0, 0, 'Level: 0', {
            fontSize: '40px',
            fill: '#000000'
        });

        // center level text
        Phaser.Display.Align.In.Center(
            this.levelText,
            this.add.zone(this.width / 2, this.height / 2, this.width, this.height)
        )

        this.hideUIElements();
    }

    hideUIElements() {
        this.scoreText.alpha = 0;
        this.healthText.alpha = 0;
        this.turretsText.alpha = 0;
        this.roundTimeText.alpha = 0;
        this.enemiesText.alpha = 0;
        this.levelText.alpha = 0;
    }
    
    setupEvents() {
        this.gameScene.events.on('displayUI', function() {
            this.scoreText.alpha = 1;
            this.healthText.alpha = 1;
            this.turretsText.alpha = 1;
            this.enemiesText.alpha = 1;
        }.bind(this));

        this.gameScene.events.on('hideUI', function() {
            this.hideUIElements();
        }.bind(this));

        this.gameScene.events.on('updateScore', function(score) {
            this.scoreText.setText(`Score: ${score}`)
        }.bind(this));

        this.gameScene.events.on('updateHealth', function(health) {
            this.healthText.setText(`Base Health: ${health}`)
        }.bind(this));

        this.gameScene.events.on('updateTurrets', function(turrets) {
            this.turretsText.setText(`Available Turrets: ${turrets}`)
        }.bind(this));

        this.gameScene.events.on('updateEnemies', function(enemies) {
            this.enemiesText.setText(`Enemies Remaining: ${enemies}`)
        }.bind(this));
        
        this.gameScene.events.on('startRound', function(level) {
            this.levelText.setText(`Level: ${level}`);
            this.levelText.alpha = 1;

            // fade level text
            this.add.tween({
                targets: this.levelText,
                ease: 'Sine.easeInOut',
                duration: 1000,
                delay: 2000,
                alpha: {
                    getStart: () => 1,
                    getEnd: () => 0
                },
                onComplete: function() {
                    this.roundTimeText.setText('Round Starts In: 5');
                    this.roundTimeText.alpha = 1;
                    const timedEvent = this.time.addEvent({
                        delay: 1000, 
                        repeat: 4,
                        callbackScope: this,
                        callback: function() {
                            this.roundTimeText.setText(`Round Starts In: ${timedEvent.repeatCount}`);
                            if (timedEvent.repeatCount === 0) {
                                this.events.emit('roundReady');
                                this.roundTimeText.alpha = 0;
                            }
                        }
                    });
                }.bind(this)
            });
        }.bind(this));
    }
}