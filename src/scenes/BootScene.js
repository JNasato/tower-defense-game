import 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('Boot');
    }

    preload() {
        this.load.image('phaser', 'assets/logo.png');
        this.load.spritesheet("logo", 'assets/ui/title.png', {
            frameWidth: 600,
            frameHeight: 196
        });
      }
      
    create() {
        this.scene.start('Preloader');
    }
}