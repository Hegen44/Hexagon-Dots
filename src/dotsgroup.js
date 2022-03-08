import Phaser from 'phaser'
import Dots from './dots'

export default class DotGroup{

    //constructor(scene, x, y, size, index, column)
    /**
     * @param {Phaser.Scene} scene
     * @param {number} size
     * @param {number} dotsSize
     * @variable {Dots} this.group
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

    update(){
        for(let dot of this.group)
            dot.update();     
    }

    isIdle(){
        for(let dot of  this.group)
            if(dot.waypoint.length > 0) return false
        return true;
    }

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