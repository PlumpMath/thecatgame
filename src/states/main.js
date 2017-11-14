import Phaser from 'phaser';
import config from '../config';
import CatWalking from '../sprites/cat-walking';

export default class extends Phaser.State {
  init() {
    this.energy = 0;
    this.addEnergyCounter();
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();
    const jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

    this.cat = new CatWalking({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + (this.world.centerY * 0.4),
      asset: 'catWalking',
    });

    this.game.add.existing(this.cat);
    this.game.input.onUp.add(this.storeEnergy, this);
    jumpKey.onDown.add(this.jump, this);
    this.game.physics.enable(this.cat, Phaser.Physics.ARCADE);
    this.cat.body.gravity.y = 500;
    this.cat.body.collideWorldBounds = true;
  }

  storeEnergy() {
    if (this.energy < 1000) {
      this.energy += 20;
    }
  }

  addEnergyCounter() {
    this.counter = this.add.text(20, 20, this.energyText(), {
      font: `50px ${config.font}`,
      fill: config.fontColor,
      align: 'left',
    });
  }

  energyText() {
    return `Cat energy: ${Math.floor(this.energy / 10)}`;
  }

  jump() {
    this.cat.body.velocity.y = -300;
  }

  update() {
    if (this.energy > 0) {
      const weighedEnergy = Math.sqrt(this.energy);
      const fps = Math.floor(weighedEnergy);
      this.cat.walk(fps);

      // remove more energy for a higher energy level:
      this.energy -= Math.floor(weighedEnergy / 7) || 1;
      this.counter.text = this.energyText();
    } else {
      this.cat.halt();
    }
  }

  resize() {
    this.restart();
  }
}
