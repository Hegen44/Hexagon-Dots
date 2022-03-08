import Phaser from 'phaser'
import HexGrid from '../hexgrid'
import Connect from '../connect'
import DotColors, { ColorCode } from '../dotscolor'
import DotsGroup from '../dotsgroup'
import * as myState from '../state';
import eventsCenter from '../eventscenter'

export default class GameScene extends Phaser.Scene
{
	constructor()
	{
		super('game-scene')
	}

	preload()
	{   
        this.canvas = this.sys.game.canvas;
        this.loadFile();
        DotColors.upadte_Color_Num();
	}

    loadFile(){
		var file = JSON.parse(localStorage.getItem('myHexDotSaveFile'));
		this.DOT_COLORS  = file? file.DOT_COLORS : 5;
		this.row = file?file.row : 6;
		this.column = file?file.col : 6;
	};

    gameOver ()
    {
        this.stateMachine.transition('gameover');
    }

    back(){
        this.scene.start("menu");
    }

	create()
	{
        if(this.row == 0 || this.column == 0) return;
        
        // set up background =====================================================
        this.cameras.main.setBackgroundColor(ColorCode.WHITE);
        this.scene.run('ui-scene', {hideInfo: false});
        
        // set up timer and score =====================================================

        // this.info = this.add.text(50, 50, '',{ font: '48px Arial'});
        // this.info.setColor(ColorCode.BLACK);
        // this.info.depth = 3;
        this.hexSize = 50;
        this.score = 0; 

        let ms = 1000; // millisecond
        let sec = 60; // second
        this.countDown = sec * ms;
        this.timer = this.time.addEvent({ delay: this.countDown, callback: this.gameOver, callbackScope: this }); // gamerover event
        this.timer.paused = true;
    
        // set up hex grid and dots =====================================================

        const row =  this.row;
        const column = this.column;
        const height = this.scale.height;
        const width = this.scale.width;
        let  hexSize = this.hexSize;   // distance from the center to any corner (radius)

        let hexTileWidth = Math.sqrt(3) * hexSize; 
        let totalWidth = (column +0.5)* hexTileWidth // (x column + .5f column)  * hexTileWidth

        let hexTileHeight = 2 * hexSize;
        //let totalHeight = (row - 1) * (hexTileHeight* 3/4) + hexTileHeight;     //(row - 1) * (hexTileHeight* 3/4) + hexTileHeight        
        
        let testsize1 = (width- width/10)/(column + 1/2)/Math.sqrt(3);
        let testsize2 = (height - height/6)/(3/2*row - 3/2 + 2);

        let totalHeight = (row - 1) * (hexTileHeight* 3/4) + hexTileHeight;

        console.log("width" + height + " " + totalHeight);

        hexSize = (testsize1 < testsize2)? testsize1 : testsize2;


        
        //(row - 1) * (hexTileHeight* 3/4) + hexTileHeight
        //if( totalWidth > width) {
            console.log(testsize1 + " dsfsdfs" + testsize2);
        //}

        //let center = this.scale.gameSize;
        this.rec = this.add.rectangle(width/2,height/2,width,height);
        this.rec.depth = 4;
        let colorREC = Phaser.Display.Color.HexStringToColor(ColorCode.BLACK).color;
        this.rec.setFillStyle(colorREC, 0.5);
        this.rec.setActive(false);
        this.rec.setVisible(false);

        this.connected = new Connect(this);
        this.events.on('addDots', this.connected.addDot, this.connected);
        this.events.on('spawnLoop', this.spawn_Loop_Effect, this);
        this.events.on('deSpawnLoop', this.Despawn_Loop_Effect, this);

        this.dotsGroup = new DotsGroup(this, this.row * this.column, hexSize/3);
        this.hexgrid = new HexGrid(this, row, column, hexSize, width, height);
        //this.hexgrid.refillGrid(this.dotsGroup.group, true);
        
        // set up line graphic =====================================================
        this.graphic = this.add.graphics();
        this.graphic.depth = 2; // in front of all object
        
        // set up input =====================================================
        this.input.on('pointerup', function (){
            this.stateMachine.transition('refill');
        }, this);
        this.input.on('gameobjectdown', function (pointer, gameObject){
            gameObject.emit('down', gameObject);
        }, this);
        this.input.on('gameobjectover', function (pointer, gameObject){
            gameObject.emit('over', gameObject);
        }, this);
        this.input.on('gameobjectup', function (pointer, gameObject){
            gameObject.emit('clicked', gameObject);
        }, this);

        // set up StateMachine =====================================================

          this.stateMachine = new myState.StateMachine('setup', {
            setup: new myState.SetUpState(),
            play: new myState.PlayState(),
            refill: new myState.RefillState(),
            gameover: new myState.GameOverState(),
            pause: new myState.PauseState()
          }, [this, this.dotsGroup, this.hexgrid, this.connected]);


        eventsCenter.on('return', this.back, this);

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>{
            eventsCenter.off('return', this.back, this);
            this.scene.stop('ui-scene');
        })
    
	}

    spawn_Loop_Effect(){
        let color = this.connected.getConnectColor();
        let dot_array= this.dotsGroup.getMatched(color);

        this.rec.setActive(true);
        this.rec.setVisible(true);
        this.rec.setFillStyle(color, 0.25);
        this.rec.setStrokeStyle(this.hexSize/2, color, 1);
        for(let dot of dot_array){
            dot.spawn_Connect_Effect();
        }
    }

    Despawn_Loop_Effect(){
        this.rec.setActive(false);
        this.rec.setVisible(false);
    }

    update(){

        if(this.stateMachine.state == 'gameover') return; // game over no longer update

        let time = Math.floor(this.timer.getRemainingSeconds());
        eventsCenter.emit('update-time', time);
        eventsCenter.emit('update-score', this.score);

        this.stateMachine.step();
        
    }

}

