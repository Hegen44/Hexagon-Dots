import { Geom } from "phaser";
import Dots from './dots';

/**
* A class representing a single hex grid
*/
export default class Hextile {

    /**
     * Constructor
	 * @param {number} x x positon of the hex
	 * @param {number} y y posiiotn of the hex
     * @param {number} i row index of the hex
     * @param {number} j column index of the hexS
     */
    //* @param {string} tileImage
    constructor( x,y,i,j)
	{   
        // store x and y position, and the
        this.x = x;
        this.y = y;

        // the dot that will be in the hex
        this.dot = null;

        // store i and j in a pair
        this.indexI = new Geom.Point(i,j);
        // store x and y as positon point
        this.pos = new Geom.Point(x,y);

	}
    /**
	 * check if there is a dot in the hex
     * @returns {boolean}
     */
    hasDot(){
        return this.dot != null;
    }

    /**
     * Store the dot into the hex, 
     * and insert its location to the dot's waypoint 
     * so the dot will move to the hex 
     * @param {Dots} dot the dot that is going into the hex
     */
    setDot (dot){
        this.dot = dot;
        this.dot.addWayPoint(this.pos);
        this.dot.setGridIndex(this.indexI.x,this.indexI.y);
    }

    /**
     * remove any dot from the hex
     */
    clearDot (){
        this.dot = null;
    }
}