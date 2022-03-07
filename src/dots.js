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
        scene.physics.world.enable(this);
        this.depth = 1;

        this.add(this.circle); 
        this.scene = scene;
        
        this.x = 0;
        this.y = 0;
        
        this.waypoint = [];
        this.row = 0;
        this.column = 0;

        // @ts-ignore
        this.body.setCircle(size, -size, -size)

        //set up interactive component
        this.setInteractive(new Phaser.Geom.Circle(0,0,size), Phaser.Geom.Circle.Contains);
        this.on('down', function () {
            scene.events.emit('addDots', this);
            //console.log("down");
    
        });

        this.on('over', function () {
            let pointer = this.scene.input.activePointer;
            if(pointer.isDown){
                scene.events.emit('addDots', this);
                //console.log("over");
            }

    
        });
        //scene.input.enableDebug(this);

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
        //this.setPosition(this.x , this.y );
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
        this.disableInteractive();
        //this.scene.physics.world.disable(this);
    }

    /**
    * @param {Geom.Point} wp
    */
    addWayPoint(wp){
        this.waypoint.push(wp);
    }


    setGridIndex(i,j){
        this.row = i, this.column = j;
    }

    isNeighbor(other){
        let neighbor = this.getNeighborIndexs(this.row);
        let rdiff = other.row - this.row;
        let cdiff = other.column - this.column;

        for(let i of neighbor)
            if(i[0] == rdiff && i[1] == cdiff) 
                return true;
        return false;
    }

    getNeighborIndexs(row){
        // even rows 
        let even = [[+1,  0], [-1, +1], [ 0, -1], 
                    [ 0, +1], [+1, +1], [-1,  0]];
        // odd rows 
        let odd = [[+1,  0], [ 0, -1], [-1, -1], 
                   [ 0, +1], [-1,  0], [+1, -1]];
                   
        return (row%2 == 0)? even : odd;
    }


    update(){
        
        if(this.waypoint.length > 0){

            this.scene.physics.world.enable(this);
            let target = this.waypoint[0];
            let dis = Phaser.Math.Distance.Between(this.x, this.y, this.waypoint[0].x , this.waypoint[0].y);
            
            //this.body.setVelocity(0, 200)

            if(dis < 5){
             
                this.waypoint.shift();
                if(this.waypoint.length  == 0) {
                    this.scene.physics.world.disable(this);
                    this.setInteractive();
                }
                this.setPosition(target.x , target.y );
            } else {
                this.scene.physics.moveToObject(this, target, 500);

            }

        }

    }
    
}