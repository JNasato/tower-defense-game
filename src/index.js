import Phaser from "phaser";

import config from './config/config';
import GameScene from './scenes/GameScene';
import BootScene from './scenes/BootScene';
import PreloaderScene from './scenes/PreloaderScene';
import TitleScene from './scenes/TitleScene';
import UIScene from './scenes/UIScene';
import DeadScene from './scenes/DeadScene';

const game = new Phaser.Game(config);

class Game extends Phaser.Game {
  constructor() {
    super(config);
    this.scene.add('Game', GameScene);
    this.scene.add('Boot', BootScene);
    this.scene.add('Preloader', PreloaderScene);
    this.scene.add('Title', TitleScene);
    this.scene.add('UI', UIScene);
    this.scene.add('Dead', DeadScene);
    this.scene.start('Boot');
  }
}

window.onload = () => {
  window.game = new Game();
  resize();
  window.addEventListener('resize', resize, false);
}

function resize() {
  const canvas = document.querySelector('canvas');
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;  
  const windowRatio = windowWidth / windowHeight;
  const gameRatio = config.width / config.height;

  if (windowRatio < gameRatio) {
    canvas.style.width = windowWidth + 'px';
    canvas.style.height = (windowWidth / gameRatio) + 'px';
  } else {
    canvas.style.width = (windowHeight * gameRatio) + 'px';
    canvas.style.height = windowHeight + 'px';
  }
}