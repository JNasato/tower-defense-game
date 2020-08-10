import 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        this.readyCount = 0;
        this.width = this.cameras.main.width;
        this.height = this.cameras.main.height;
    }

    preload() {
        // time event for logo
        this.timedEvent = this.time.delayedCall(2000, this.ready, [], this);

        this.createPreloader();
        this.loadAssets();
    }

    loadAssets() {
        // load assets
        this.load.image('bullet', 'assets/level/bulletDark2_outline.png');
        this.load.image('tower', 'assets/level/tank_bigRed.png');
        this.load.image('enemy', 'assets/level/tank_sand.png');
        this.load.image('base', 'assets/level/tankBody_darkLarge_outline.png');
        this.load.image('title', 'assets/ui/title.png');
        this.load.image('cursor', 'assets/ui/cursor.png');
        this.load.image('blueButton1', 'assets/ui/blue_button02.png');
        this.load.image('blueButton2', 'assets/ui/blue_button03.png');

        // FOR PROGRESS BAR TESTING
        for (let i = 0; i < 312; i++) {
            this.load.image('file.0' + i, 'assets/logo.png')
        }

        // tile map in JSON format
        this.load.tilemapTiledJSON('level1', 'assets/level/level1.json');
        this.load.spritesheet('terrainTiles_default', 'assets/level/terrainTiles_default.png', {
            frameWidth: 64,
            frameHeight: 64
        });
    }

    createPreloader() {
        // add logo image
        this.add.image(this.width / 2, this.height / 2 - 150, 'logo', 0);
        this.add.image(this.width / 2, this.height / 2 + 130, 'logo', 1);

        // display progress bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(this.width / 2 - 160, this.height / 2 - 30, 320, 50);

        // loading text
        const loadingText = this.make.text({
            x: this.width / 2,
            y: this.height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5);

        // percent text
        const percentText = this.make.text({
            x: this.width / 2,
            y: this.height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5);

        // asset text
        const assetText = this.make.text({
            x: this.width / 2,
            y: this.height / 2 + 40,
            text: '',
            style: {
                font: '16px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5);

        // update progress bar
        this.load.on('progress', (value) => {
            percentText.setText(`${parseInt(value * 100)}%`);
            progressBar.clear();
            progressBox.fillStyle(0x9999aa, 1);
            progressBox.fillRect(this.width / 2 - 150, this.height / 2 - 20, 300 * value, 30);
        });

        // update file progress
        this.load.on('fileprogress', (file) => {
            assetText.setText(`Loading Asset: ${file.key}`);
        });

        // remove progress bar when complete
        this.load.on('complete', function () {
            progressBox.destroy();
            progressBar.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
            this.ready();
        }.bind(this));
    }

    ready() {
        this.readyCount++;

        if (this.readyCount === 1) {
            this.add.image(this.width / 2, this.height / 2 - 5, 'phaser').setScale(0.4);
        }
        if (this.readyCount === 2) {
            this.scene.start('Title');
        }
    }
}