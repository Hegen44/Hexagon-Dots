import Phaser, { Physics, Renderer } from 'phaser'
import HexTile from '../hextile'
import HexGrid from '../hexgrid'
import Connect from '../connect'
import DotColors from '../dotscolor'
import { ColorCode } from '../dotscolor'
import Dot from '../dots'
import DotsGroup from '../dotsgroup'

export default class GameScene extends Phaser.Scene
{
	constructor()
	{
		super('game-scene')
	}

	preload()
	{
        this.load.image('hex', 'assets/hexwhite.png');
        this.load.image('bg', 'assets/bg/sky1.png')
        //this.load.image('bg', 'assets/bg/space3.png')
        this.canvas = this.sys.game.canvas;
        this.scale = this.sys.game.scale;
	}

    getRowHorzOffset(totalRow, currentRow, xOffset){
        let startX = 0;
        if(currentRow%2!==0){
            startX+=xOffset;
        }else{
            startX+=2*xOffset;
        }
        return startX;
    }

    gameOver ()
    {
        this.input.off('gameobjectover');
        this.input.off('gameobjectdown');
        this.input.off('pointerup');
        this.input.off('gameobjectup');
    }

	create()
	{
        this.text = this.add.text(50, 50, '',{ font: '48px Arial'});
        this.text.setColor(ColorCode.BLACK);
        this.text.depth = 3;
        //this.add.image(width/2, height/2, 'bg'); //this.add.image(400, 300, 'bg');
        this.cameras.main.setBackgroundColor(ColorCode.WHITE);

        this.score = 0; //
        //this.timer = 0; //this.time.addEvent({ delay: 10000, callback: this.gameOver, callbackScope: this }); // gamerover event
        let ms = 1000; // millisecond
        let sec = 60; // second
        this.countDown = sec * ms;
        this.timer = this.time.addEvent({ delay: this.countDown, callback: this.gameOver, callbackScope: this }); // gamerover event
        //this.timer.paused = true;
        
        this.connected = new Connect(this);

        this.events.on('addDots', this.connected.addDot, this.connected);

        this.row =  6;
        this.column = 6;
        if(this.row == 0 || this.column == 0) return;

        let row =  this.row;
        let column = this.column;
        let height = this.canvas.height;
        let width = this.canvas.width;
        //let center = this.scale.gameSize;

        let hexSize = 50;   // distance from the center to any corner (radius)
        this.overSize = hexSize;

        this.dotsGroup = new DotsGroup(this, this.row * this.column, hexSize/3);
        this.hexgrid = new HexGrid(this, row, column, hexSize, width, height);
        this.hexgrid.refillGrid(this.dotsGroup.group, true);

        this.graphic = this.add.graphics();
        this.graphic.depth = 2; // in front of all object
        

        // this.input.on('pointerup', function (pointer)
        // {
        //     let con = this.connected;
        //     if(con.isConnected(true)){
        //         let dot_array  = [];
        //         if(con.isLoop()){
   
        //             let color = this.connected.getConnectColor();
        //             dot_array= this.dotsGroup.getMatched(color);
        //         }else {
         
        //             dot_array = con.connectDots;
        //         }
                
        //         this.hexgrid.connectHandler(dot_array);
        //         this.score += dot_array.length;
        //         this.hexgrid.refillGrid(dot_array, false);
        //     }
        //     con.resetConnected();

        // }, this);

        this.input.on('pointerup', this.pointerUpHandler, this);
        this.input.on('gameobjectdown', function (pointer, gameObject)
        {
            gameObject.emit('down', gameObject);

        }, this);
        this.input.on('gameobjectover', function (pointer, gameObject)
        {

            gameObject.emit('over', gameObject);
        }, this);
        this.input.on('gameobjectup', function (pointer, gameObject)
        {
            gameObject.emit('clicked', gameObject);
        }, this);

        // var balls = this.physics.add.group({
        //     key: 'ball',
        //     quantity: 24,
        //     bounceX: 1,
        //     bounceY: 1,
        //     collideWorldBounds: true,
        //     velocityX: 300,
        //     velocityY: 150
        // });
        // Phaser.Actions.RandomRectangle(balls.getChildren(), this.physics.world.bounds);
        // this.physics.add.collider(
        //     balls,
        //     crates,
        //     function (ball, crate)
        //     {
        //         ball.setAlpha(0.5);
        //         crate.setAlpha(0.5);
        //     });
        // }

        // this.tweens.add({
        //     targets: container,
        //     angle: 360,
        //     duration: 6000,
        //     yoyo: true,
        //     repeat: -1
        // });
    
	}

    pointerUpHandler(){
        let con = this.connected;
        if(con.isConnected(true)){
            let dot_array  = [];
            if(con.isLoop()){

                let color = this.connected.getConnectColor();
                dot_array= this.dotsGroup.getMatched(color);
            }else {
     
                dot_array = con.connectDots;
            }
            
            this.hexgrid.connectHandler(dot_array);
            this.score += dot_array.length;
            this.hexgrid.refillGrid(dot_array, false);
        }
        con.resetConnected();
    }

    update(){

        this.graphic.clear();
        this.graphic.setVisible(true);

        let pointer = this.input.activePointer;
        this.connected.updatePath(pointer);
        if(this.connected.isConnected(false)){
            
            this.graphic.lineStyle(this.overSize/4, this.connected.getConnectColor());
            this.graphic.strokePoints(this.connected.points);
        }
        
        let time = Math.floor(this.countDown - this.timer.getElapsedSeconds());
        time = Math.floor(this.timer.getRemainingSeconds());
        this.text.setText("Time: " + time + "\nScore: " + this.score);
        this.dotsGroup.update();
        
    }

}

