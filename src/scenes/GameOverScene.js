import Phaser from 'phaser'
import { ColorCode } from '../dotscolor';
import eventsCenter from '../eventscenter';

export default class GameOver extends Phaser.Scene
{
    constructor()
    {
        super('game-over')
    }

    init(data){
        this.score = data.score;
    }

    preload(){
        this.load.image('back', 'assets/button/back.png');
        this.load.image('replay', 'assets/button/replay.png');

		this.color = Phaser.Display.Color;
    }

    create()
    {
        this.cameras.main.setBackgroundColor(ColorCode.WHITE);
		this.scene.run('ui-scene', {hideInfo: true});

        const width = this.scale.width;
        const height = this.scale.height;
		const textSize = width * height / (15000);

		// set up text and button ======================================================
		this.setUp_Text(ColorCode.BLACK, width,height, textSize);
		this.setUp_Button(ColorCode.BLUE,ColorCode.BLACK, width, height, textSize);

		// setup input for clicking button ======================================================
		this.input.on('gameobjectup', function (pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);

		
        eventsCenter.on('return', this.back, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>{
            eventsCenter.off('return', this.back, this);
            this.scene.stop('ui-scene');
        })

    }

	setUp_Text(color, width, height, size){
        let tittle = this.add.text(0, 0, 'Game Over', {font: size * 3 + 'px Arial', color: color}).setOrigin(0.5);
        let score = this.add.text(0, size * 3, `Score: ${this.score}`, {font: size * 3/2 + 'px Arial', color: color}).setOrigin(0.5);
        let texts = this.add.container(width * 0.5, height * 0.2, [tittle, score]);

		this.tweens.add({

			targets: texts,
			y: { from: -size * 4, to:  texts.y},
			duration: 400,
			ease: 'Back'
	
		});
	}

	setUp_Button(color1HS, color2HS, width, height, size){
		let color1 = this.color.HexStringToColor(color1HS).color;
		let color2 = this.color.HexStringToColor(color2HS).color;


		let replay = this.add.image(0,0,'replay').setTintFill(color1); ;
		let ds = replay.displayWidth * replay.displayHeight;
		replay.setScale(width * height /ds);
		let replaytext = this.add.text(0, replay.displayHeight/2 + size, 'Play Again', {font: size + 'px Arial', color: color2HS}).setOrigin(0.5);


		let ReplayButton = this.add.container(width/2, height/2, [replay,replaytext]);
		ReplayButton.setInteractive(new Phaser.Geom.Circle(0,0,replay.displayWidth/2), Phaser.Geom.Circle.Contains);

		ReplayButton.on('clicked', () => {this.scene.start('game-scene')});
		ReplayButton.on('pointerover',function(){replay.setTint(color2)}, this); // ColorCode.BLACK
		ReplayButton.on('pointerout',function(){replay.setTintFill(color1);}, this);
		
		ReplayButton.disableInteractive();

		this.tweens.add({

			targets: ReplayButton,
			scaleX: { from: 0, to: 1 },
			scaleY: { from: 0, to: 1 },
			duration: 400,
			ease: 'Back',
			onComplete: () => {
				ReplayButton.setInteractive();
			}
	
		});

	}

	back(){
        this.scene.start("menu");
    }
}