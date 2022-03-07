import { Geom } from "phaser";
import Dots from './dots';


export default class Hextile {

    /**
     * @param {Phaser.Scene} scene
     * @param {number} x
     * @param {number} y
     * @param {number} i
     * @param {number} j
     */
    //* @param {string} tileImage
    constructor(scene, x,y,i,j)
	{   
        this.x = x;
        this.y = y;
        this.scene = scene;
        this.dot = null;
        this.indexI = new Geom.Point(i,j);
        this.pos = new Geom.Point(x,y);

	}

    hasDot(){
        return this.dot != null;
    }

    /**
     * @param {Dots} dot
     */
    setDot (dot){
        this.dot = dot;
        this.dot.addWayPoint(this.pos);
        this.dot.setGridIndex(this.indexI.x,this.indexI.y);
    }

    clearDot (){
        this.dot = null;
    }
}