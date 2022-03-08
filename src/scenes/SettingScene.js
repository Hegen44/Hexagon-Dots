import { GameObjects } from "phaser";
import { ColorCode } from "../dotscolor";
import eventsCenter from "../eventscenter";
import { Slider } from "../slider";

export default class SettingScene extends Phaser.Scene
{
	constructor()
	{
		super('setting')
	}

	preload()
	{
		this.loadFile();
	}

    back(){
        this.scene.start("menu");
		let data_c = this.color_slid.content,
			data_r = this.row_slid.content,
			data_l  = this.column_slid.content;
		this.saveFile(data_c, data_r,data_l);
    }
	create()
	{
		this.cameras.main.setBackgroundColor(ColorCode.WHITE);
		this.scene.run('ui-scene', {hideInfo: true});

		eventsCenter.on('return', this.back, this);

		let width = this.scale.width;
		let height = this.scale.height;

		let textSize = width * height / (15000);
		console.log(textSize);

		this.setUp_Tittle(width/2, textSize* 3, ColorCode.BLACK, textSize , "Setting");
		let startY = textSize* 3;
		let offset = (height - startY)/4;
		startY += offset;
		this.color_slid = new Slider(this, width/2, startY, width * .75, textSize, 
			this.DOT_COLORS , 8 , 2, "DOT_COLORS", ColorCode.BLOWN, ColorCode.BLACK);

		startY += offset;
		this.row_slid = new Slider(this, width/2, startY, width * .75, textSize, 
			this.row , 20 , 2, "Row", ColorCode.BLOWN, ColorCode.BLACK);

		startY += offset;
		this.column_slid = new Slider(this, width/2, startY, width * .75, textSize, 
			this.col , 20 , 2, "Column", ColorCode.BLOWN, ColorCode.BLACK);		

		this.tweens.add({

			targets: this.color_slid,
			x: { from: 3/2* width, to: width/2},
			duration: 400,
			ease: 'Back'
	
		});
		this.tweens.add({

			targets: this.row_slid,
			x: { from: 3/2* width, to: width/2},
			duration: 600,
			ease: 'Back'
	
		});
		this.tweens.add({

			targets: this.column_slid,
			x: { from: 3/2* width, to: width/2},
			duration: 800,
			ease: 'Back'
		});
		
		this.input.on(Phaser.Input.Events.DRAG, function (event, gameObject, dragX, dragY) {
			gameObject.emit('slide', dragX);
		});

		this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>{
            eventsCenter.off('return', this.back, this);
            this.scene.stop('ui-scene');
        })
	}

	saveFile = function(dot_color, row, col){
		console.log(dot_color + " " + row + " " + col)
		var file = {
			DOT_COLORS: dot_color,
			row: row,
			col: col
		};
		localStorage.setItem('myHexDotSaveFile',JSON.stringify(file));
	};

	loadFile(){
		var file = JSON.parse(localStorage.getItem('myHexDotSaveFile'));
		this.DOT_COLORS  = file? file.DOT_COLORS : 5;
		this.row = file?file.row : 6;
		this.col = file?file.col : 6;
	};

	setUp_Tittle(x,y , color, size, text){
        let tittle = this.add.text(x, y, text, {font: size * 3 + 'px Arial', color: color}).setOrigin(0.5);

		this.tweens.add({

			targets: tittle,
			y: { from: -size * 4, to:  tittle.y},
			duration: 400,
			ease: 'Back'
	
		});
	}
}



