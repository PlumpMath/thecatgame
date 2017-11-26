import Phaser from 'phaser';
import config from '../config';
import Cat from '../objects/cat';

export default class extends Phaser.State {
  create() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
    this.game.physics.arcade.gravity.y = 9810;

    this.cat = new Cat({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + (this.world.centerY * 0.4),
    });

    this.addEnergyCounter();

    const jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.game.input.onUp.add(() => this.cat.speedUp());
    jumpKey.onDown.add(() => this.cat.jump());
  }

  addEnergyCounter() {
    this.counter = this.add.text(20, 20, this.energyText(), {
      font: `50px ${config.font}`,
      fill: config.fontColor,
      align: 'left',
    });
  }

  energyText() {
    return `Cat energy: ${this.cat.speed()}`;
  }

  update() {
    this.startY = this.cat.sprite.y;
    this.cat.update();
    this.counter.text = this.energyText();
  }

  resize() {
    this.restart();
  }
}
