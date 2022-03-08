import { ColorCode } from "../dotscolor";

export default class MenuScene extends Phaser.Scene
{
	constructor()
	{
		super('menu')
	}

	preload()
	{
        this.load.image('play', 'assets/button/play.png');
        this.load.image('set', 'assets/button/setting.png');
	}

	create()
	{
		// Setup Main Menu ===================================================
		this.cameras.main.setBackgroundColor(ColorCode.WHITE);
        const width = this.scale.width;
        const height = this.scale.height;
		const textSize = width * height / (15000);

		let color = Phaser.Display.Color;
		let green = color.HexStringToColor(ColorCode.GREEN).color;
		let black = color.HexStringToColor(ColorCode.BLACK).color;
		let red = color.HexStringToColor(ColorCode.RED).color;

		// Setup Tittle ===================================================
        let title = this.add.text(width * 0.5, height * 0.25, 'HEXAGON-DOTS', {font: textSize * 2 + 'px Arial', color: ColorCode.BLACK}).setOrigin(0.5);

		// Setup Button ===================================================

		let play = this.add.image(0,0,'play');
		let ds = play.displayWidth * play.displayHeight;
		play.setScale(width * height / ds);
		play.setTintFill(green); 
		let playtext = this.add.text(0, play.displayHeight/2 + textSize, 'Play', {font: textSize + 'px Arial', color: ColorCode.BLACK}).setOrigin(0.5);

		let setting = this.add.image(0,0,'set').setScale(width * height / ds);
		setting.setTintFill(red); 
		let settext = this.add.text(0, setting.displayHeight/2 + textSize, 'Setting', {font: textSize + 'px Arial', color: ColorCode.BLACK}).setOrigin(0.5);


		// setup event for button 
		let playButton = this.add.container(width*1/4, height/2, [play,playtext]);
		playButton.setInteractive(new Phaser.Geom.Circle(0,0,play.displayWidth/2), Phaser.Geom.Circle.Contains);
		playButton.disableInteractive();

		let SetButton = this.add.container(width*3/4, height/2, [setting,settext]);
		SetButton.setInteractive(new Phaser.Geom.Circle(0,0,play.displayWidth/2), Phaser.Geom.Circle.Contains);
		SetButton.disableInteractive();

		playButton.on('clicked', function(){this.scene.start('game-scene')}, this);
		SetButton.on('clicked', function(){this.scene.start('setting')}, this);

		playButton.on('pointerover',function(){play.setTint(black);}, this); // ColorCode.BLACK
		playButton.on('pointerout',function(){(play.setTintFill(green))}, this);

		SetButton.on('pointerover',function(){setting.setTint(black);}, this); // ColorCode.BLACK
		SetButton.on('pointerout',function(){(setting.setTintFill(red))}, this);

		// tweens for button and title ===================================================
		this.tweens.add({

			targets: playButton,
			scaleX: { from: 0, to: 1 },
			scaleY: { from: 0, to: 1 },
			duration: 400,
			ease: 'Back',
			onComplete: () => {
				playButton.setInteractive();
			}
	
		});

		this.tweens.add({

			targets:  SetButton,
			scaleX: { from: 0, to: 1.1 },
			scaleY: { from: 0, to: 1.1 },
			duration: 500,
			ease: 'Back',
			onComplete: () => {
				SetButton.setInteractive();
			}
		});

		this.tweens.add({

			targets: title,
			y: { from: -textSize * 4, to:  title.y},
			duration: 400,
			ease: 'Back'
	
		});

        this.input.on('gameobjectup', function (pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);
	}
}