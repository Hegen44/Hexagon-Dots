	/**
     * A class representing a slider in game
	 */
export class Slider extends Phaser.GameObjects.Container{

	/**
     * Constructor, set up all graphic and data
	 * @param {Phaser.Scene} scene   	scene where the slider is placed
	 * @param {number} 		 x          x positon of the slider
	 * @param {number} 		 y          y.posiiotn of the slider
	 * @param {number} 		 width      width of the slinder
	 * @param {number} 		 size       size of the button of slider in radius
	 * @param {number} 		 data       data that the slider store and change
	 * @param {number} 		 max        maximun possible value of the data
	 * @param {number} 		 min        minimun possible value of the data
	 */
	constructor(scene,x,y, width, size, data, max, min, label, color1, color2){
		super(scene,x,y);

		this.scene = scene;
		// @ts-ignore
		scene.add.existing(this);

        // calculate the start point and end point of a the slider,
        // the positon is relative to the container.
		let x0 = -width/2; 
		let x1 = +width/2; 

        // create line the slider will be on
		this.line = scene.add.line(0,0, 0, 0, width, 0, 0x2b2821);
		this.line.setLineWidth(size/5);

        // 
		let color1Num = Phaser.Display.Color.HexStringToColor(color1).color;

        // setup the button to slide, it is acircle
		let init_x = x0 + ((data- min)/(max - min)) * width;
		this.bar = scene.add.circle(init_x,0, size, color1Num)
			.setDataEnabled()
			.setInteractive();;

        // store neccesay data into button for later use
		this.bar.data.set('x0', x0);
		this.bar.data.set('x1', x1);
		this.bar.data.set('width', width);
		this.bar.data.set('min', min);
		this.bar.data.set('max',max);

        // make it draggable 
		this.scene.input.setDraggable(this.bar);

        // setup listener so that it would call back when it is dragged by the Player
		this.bar.on('slide', this.setDragX, this);


        // setup Text to displpay label and data
		this.label = scene.add.text(0, 0- size * 2, label +': '+data, {
			font: size + 'px Arial', color: color2
		}).setOrigin(0.5).setDataEnabled();
		this.label.setData('label', label)

        // storing the data
        this.content = data;


        // add all related object to the container
		this.add([this.line, this.bar, this.label])

	}

	/**
     *  A callback function when the slider is being drag,
     *  it update the x posiotn of the slider and recalculate 
     *  the resulting data.
	 * 
     * @param {number} dragX the x positon of the player pointer
     */
	setDragX(dragX){
        // get neccessary data for calculation
		let x0 = this.bar.getData('x0');
		let x1 = this.bar.getData('x1');
		let w = this.bar.getData('width');
		let dataMin = this.bar.getData('min');

        // get the possible range the data can be
		let dataRange = this.bar.getData('max') - dataMin;

        // clamp the drag so that it would not be drag beyond the slider
		let cDragX = Phaser.Math.Clamp(dragX, x0, x1);

        // calculate the new data in relation the position of the slider
        // the closer it is to the start positon, the smaller the value of the data is
		let data = (cDragX - x0)/w * dataRange; 

        // keep the data to be an int
		data = Math.floor(data);

        // calculate the new x position in relation to the data
		let new_x = data/dataRange * w + x0;
        // off set the data so that it is within data range
		data += dataMin;

        // store data and set x positon
		this.content = data;
		this.bar.x = new_x;

        // update label to display new data
		let title = this.label.getData('label');
		this.label.text = `${title}: ${data}`

	}

}