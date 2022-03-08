import Phaser from 'phaser'
import { ColorCode } from '../dotscolor';
import eventsCenter from '../eventscenter';

export default class UIScene extends Phaser.Scene
{
	constructor()
	{
		super('ui-scene')
	}

	init(data){
		this.hideInfo = data.hideInfo;
	}

	preload()
	{
		this.load.image('back', 'assets/button/back_arrow.png');
	}
	create()
	{
		const width = this.scale.width;
        const height = this.scale.height;
		const textSize = width * height / (13000);

		let color = Phaser.Display.Color;
		//let orange = color.HexStringToColor(ColorCode.ORANGE).color;
		let black = color.HexStringToColor(ColorCode.BLACK).color;

		let back = this.add.image(0,0,'back');
		let ds = back.displayWidth * back.displayHeight;
		back.setScale(width * height / ds / 1.5);
        back.setPosition(back.displayWidth/2, height - back.displayHeight/2);
		back.setTintFill(black);  

		back.on('pointerup', function(){eventsCenter.emit('return');});
		// back.on('pointerover',function(){back.setTint(black)}, this); 
		// back.on('pointerout',function(){back.setTintFill(black);}, this);

		this.tweens.add({

			targets: back,
			y: { from: height + textSize * 4, to:  back.y - textSize/2 },
			duration: 400,
			ease: 'Back',
			onComplete: () => {
				back.setInteractive();
			}
	
		});

		if(!this.hideInfo){

			this.timerLabel = this.add.text(-width/4, 0, 'Time: 0', {
				font: textSize + 'px Arial', color: ColorCode.BLACK
			}).setOrigin(0.5);
	
			this.scoreLabel = this.add.text(width/4, 0, 'Score: 0', {
				font: textSize + 'px Arial', color: ColorCode.BLACK
			}).setOrigin(0.5);

			let info = this.add.container(width/2, textSize, [this.timerLabel, this.scoreLabel])

			this.tweens.add({

				targets: info,
				y: { from: -textSize, to:  info.y},
				duration: 200,
				ease: 'Back'
		
			});

			eventsCenter.on('update-time', this.upateTime, this);
			eventsCenter.on('update-score', this.updateScore, this);
	
			// clean up when Scene is shutdown
			this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
				eventsCenter.off('update-time', this.upateTime, this);
				eventsCenter.off('update-score', this.updateScore, this);
			})
		}


	}
	updateScore(score)
	{
		this.scoreLabel.text = `Score: ${score}`
	}

	upateTime(time){
		this.timerLabel.text = `Time: ${time}`
	}



}