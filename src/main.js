import Phaser from 'phaser'

//import HelloWorldScene from './scenes/HelloWorldScene'
import GameScene from './scenes/GameScene'
import GameOver from './scenes/GameOverScene'
import MenuScene from './scenes/MenuScene'
import SettingScene from './scenes/SettingScene'
import UIScene from './scenes/UIScene'

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
	scene: [MenuScene, SettingScene, GameScene , GameOver, UIScene]
}

export default new Phaser.Game(config)
