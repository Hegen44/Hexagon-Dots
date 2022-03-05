import Phaser, { Physics, Renderer } from 'phaser'
import HexTile from '../hextile'
import HexGrid from '../hexgrid'
import DotColors from '../dotscolor'
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

	create()
	{
        this.score = 0;

        this.row =  6;
        this.column = 6;
        var row =  this.row;
        var column = this.column;
        let height = this.canvas.height;
        let width = this.canvas.width;
        //let center = this.scale.gameSize;
        this.add.image(width/2, height/2, 'bg'); //this.add.image(400, 300, 'bg');
        //this.physics.world.enable(this.arc);

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




        //this.hexTileGrid = [];

        let hexSize = 50;   // distance from the center to any corner (radius)

        let hexTileWidth = Math.sqrt(3) * hexSize; // w = sqrt(3) * size

        let horizontalOffset=hexTileWidth; // distance horizontally from on center to another center is w

        let xOffset = hexTileWidth/2;
        let startXInit=width/2 - ((column+0.5) * hexTileWidth)/2;  // total width of grid is (x column + .5f column)  * hexTileWidth

        this.dotsGroup = new DotsGroup(this, this.row * this.column, hexSize/3);
        this.hexgrid = new HexGrid(this, row, column, hexSize, width, height);
   
        //let hexGrid = this.add.group();;
        let hexTile;
        //let index = 0;
        for (let i = 0; i < row; i++)
        {
            //let hexColumn = [];
            let startX = startXInit;
            startX += this.getRowHorzOffset(row, i, xOffset);
            let dotStartX = startXInit + this.getRowHorzOffset(row, 0, xOffset);
            let dotStartY = -i * hexSize * 2  - hexSize;

            for (let j = 0; j < column; j++)
            {

                
                let dot = this.dotsGroup.get();
                if (dot)
                {
                    dot.spawn(dotStartX, dotStartY);
                    this.hexgrid.insertDot(dot, j);
                }

                startX+=horizontalOffset;
                dotStartX += horizontalOffset;
            }    
        }


        let timer = this.time.addEvent({ delay: 10000, callback: this.gameOver, callbackScope: this }); // gamerover event

	}

    gameOver ()
    {
        this.input.off('gameobjectup');
    }

    update(){

        this.dotsGroup.update();
        
    }

}

