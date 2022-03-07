import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import GameScene from './scenes/GameScene'

const config = {
	type: Phaser.AUTO,
	width: 600,//800,
	height: 800,//600,
	physics: {
		default: 'arcade',
		arcade: {
			//debug: true,
			gravity: { y: 0 } //200
		}
	},
	//scene: [HelloWorldScene]
	scene: [GameScene]
}

export default new Phaser.Game(config)
