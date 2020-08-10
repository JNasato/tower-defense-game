import 'phaser';

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super('Title');
    }

    init() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    }
      
    create() { 
        this.createTitle();
        this.createPlayButton();

        this.tower = this.add.image(-50, this.height / 2 - 50, 'tower').setAngle(-90);
        this.enemy = this.add.image(this.width + 150, this.height / 2 + 190, 'enemy').setAngle(90);
    }

    update() {
        this.tower.x += 2.5;
        this.enemy.x -= 3;
    }

    createTitle() {
        // title image
        this.add.image(this.width / 2, this.height / 2 - 150, 'logo', 0);
        this.add.image(this.width / 2, this.height / 2 + 130, 'logo', 1);
    }

    createPlayButton() {
        // play button
        this.gameButton = this.add.sprite(this.width / 2, this.height / 2, 'blueButton1').setInteractive();
        
        this.gameText = this.add.text(this.width / 2, this.height / 2, 'Play', {
            font: '32px monospace', 
            fill: '#ffffff'
        });
        Phaser.Display.Align.In.Center(this.gameText, this.gameButton);

        this.gameButton.on('pointerdown', function() {
            this.scene.start('Game');
        }.bind(this));

        this.gameButton.on('pointerover', function() {
            this.gameButton.setTexture('blueButton2');
        }.bind(this));
        
        this.gameButton.on('pointerout', function() {
            this.gameButton.setTexture('blueButton1');
        }.bind(this));
    }
}