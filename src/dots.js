import minimist from 'minimist';
import { Geom } from 'phaser';
//import { Math } from 'phaser';
import DotColors from './dotscolor'

export default class Dots extends Phaser.GameObjects.Container { 

    //constructor(scene, x, y, size, index, column)
    /**
     * @param {Phaser.Scene} scene
     * @param {number} size
     */
    constructor(scene, size)
	{
        super(scene);
        scene.add.existing(this);
        this.circle = scene.add.circle(0, 0, size);


        //scene.physics.add.existing(this);
        scene.physics.world.enable(this);

        this.add(this.circle); 
        this.scene = scene;
        
        this.x = 0;
        this.y = 0;
        
        this.waypoint = [];
        this.row = 0;
        this.column = 0;


		let body = this.body;
        // @ts-ignore
        body.setCircle(size, -size, -size)

        this.despawn();

        // //  Our emitter
        // var particles = scene.add.particles('lemming');

        // var emitter = particles.createEmitter({
        //     x: 0,
        //     y: 0,
        //     lifespan: 2000,
        //     speed: { min: 200, max: 400 },
        //     angle: 330,
        //     gravityY: 300
        // });

        // this.add(particles);

	}

    /**
     * @param {number} x
     * @param {number} y
     */
    spawn(x , y){
        this.x = x;
        this.y = y;
        this.row = 0;
        //this.column = 0;
        this.color = DotColors.getRandomColor();
        this.circle.setFillStyle(  this.color, 1);
        
        
        this.setActive(true);
        this.setVisible(true);

        this.scene.physics.world.enable(this);

    }

    despawn(){
        this.setActive(false);
        this.setVisible(false);

        //this.scene.physics.world.disable(this);
    }

    /**
    * @param {Geom.Point} wp
    */
    addWayPoint(wp){
        this.waypoint.push(wp);
    }

    update(){
        
        if(this.waypoint.length > 0){
            
            let target = this.waypoint[0];
            let dis = Phaser.Math.Distance.Between(this.x, this.y, this.waypoint[0].x , this.waypoint[0].y);
            
            //this.body.setVelocity(0, 200)

            if(dis < 5){
             
                this.waypoint.shift();
                if(this.waypoint.length  == 0) this.scene.physics.world.disable(this);
                this.setPosition(target.x , target.y );
            } else {
                this.scene.physics.moveToObject(this, target, 200);
                //this.setPosition(this.x , this.y );
            }

        }

    }
}