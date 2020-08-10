export default {
    type: Phaser.AUTO,
    parent: "phaser-example",
    width: 640,
    height: 512,
    pixelArt: true,
    roundPixels: true,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
        debug: false
      }
    }
  };