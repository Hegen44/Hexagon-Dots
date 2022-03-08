import Phaser from 'phaser'
import Dots from './dots'

    /**
     * A class that hold all possible dots in the current game loop
     */
export default class DotGroup{

    
    /**
     * Constructor
     * @param {Phaser.Scene} scene      The current game scene
     * @param {number} size             Totoal number of dots in the current games
     * @param {number} dotsSize         Size of each dots
     * @variable {Dots[]} this.group    
     */
    constructor(scene, size, dotsSize){
        this.scene = scene;
        this.maxSize = size;
        this.dotSize = dotsSize;
        this.group = [];

        for(let i =0; i < size; ++i){
            let dot = new Dots(this.scene, this.dotSize);
            this.group.push(dot);
        }
	}

    /**
     * Emit all dots update 
     */
    update(){
        for(let dot of this.group)
            dot.update();     
    }

    /**
     * Check if all dots are at rest position
     * @return {boolean} 
     */
    isIdle(){
        for(let dot of  this.group)
            if(dot.waypoint.length > 0) return false
        return true;
    }

    /**
     * Get all dots with the matching colors in the grid
     * @param {any} color  the color to match
     * @return {Dots[]}
     */
    getMatched(color){
        let total = this.group.length;
        let matched = [];
        for(let i = 0; i < total; ++i){
            if(this.group[i].color == color)
                matched.push(this.group[i])
        }
        return matched;
    }


}