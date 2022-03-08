export class Slider extends Phaser.GameObjects.Container{

	/**
	 * @param {Phaser.Scene} scene
	 * @param {number} x
	 * @param {number} y
	 * @param {number} width
	 * @param {number} size
	 * @param {number} data
	 * @param {number} max
	 * @param {number} min
	 */
	constructor(scene,x,y, width, size, data, max, min, label, color1, color2){
		super(scene,x,y);

		this.scene = scene;
		// @ts-ignore
		scene.add.existing(this);

		let x0 = -width/2; //x - width/2;
		let x1 = +width/2; //x + width/2
		this.line = scene.add.line(0,0, 0, 0, width, 0, 0x2b2821);
		this.line.setLineWidth(size/5);

		let color1Num = Phaser.Display.Color.HexStringToColor(color1).color;
		let init_x = x0 + ((data- min)/(max - min)) * width;
		this.bar = scene.add.circle(init_x,0, size, color1Num)
			.setDataEnabled()
			.setInteractive();;
		this.bar.data.set('x0', x0);
		this.bar.data.set('x1', x1);
		this.bar.data.set('width', width);
		this.bar.data.set('min', min);
		this.bar.data.set('max',max);
		this.scene.input.setDraggable(this.bar);

		this.scene.input.enableDebug(this.bar);
		this.bar.on('slide', this.setDragX, this);


		this.label = scene.add.text(0, 0- size * 2, label +': '+data, {
			font: size + 'px Arial', color: color2
		}).setOrigin(0.5).setDataEnabled();
		this.label.setData('label', label)

        this.content = data;

		this.add([this.line, this.bar, this.label])

	}

	setDragX(dragX){
		let x0 = this.bar.getData('x0');
		let x1 = this.bar.getData('x1');
		let w = this.bar.getData('width');
		let dataMin = this.bar.getData('min');
		let dataRange = this.bar.getData('max') - dataMin;
		let cDragX = Phaser.Math.Clamp(dragX, x0, x1);
		let data = (cDragX - x0)/w * dataRange; 
		data = Math.floor(data);
		let new_x = data/dataRange * w + x0;
		data += dataMin;
		this.content = data;
		this.bar.x = new_x;

		let title = this.label.getData('label');
		this.label.text = `${title}: ${data}`

	}

}