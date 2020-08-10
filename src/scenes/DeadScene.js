import 'phaser';

export default class DeadScene extends Phaser.Scene {
    constructor() {
        super('Dead');
    }

    init() {
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    }

    create() {
        this.destroyedText = this.add.text(0, 0, 'Your Base Was Destroyed', {
            fontSize: '40px',
            fill: '#8A0303'
        });
        Phaser.Display.Align.In.Center(
            this.destroyedText,
            this.add.zone(this.width / 2, this.height / 2, this.width, this.height)
        );
            
        this.add.tween({
            targets: this.destroyedText,
            ease: 'Sine.easeInOut',
            duration: 2000,
            delay: 1000,
            alpha: {
                getStart: () => 1,
                getEnd: () => 0
            },
            onComplete: function() {
                this.scene.start('Title');
            }.bind(this)
        });
    }
}