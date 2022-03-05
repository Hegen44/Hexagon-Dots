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
	}

    update(){
        for(let i in this.group){
            this.group[i].update();
        }
    }

    get(){
        let total = this.group.length;
        for(let i = 0; i < total; ++i){
            if(!this.group[i].active)
                return  this.group[i];
        }
        // no active dot found, create one if possible
        if(total < this.maxSize){
            let dot = new Dots(this.scene, this.dotSize);
            this.group.push(dot);
            return dot;
        }
    }

    getMatched(color){
        let total = this.group.length;
        let matched = [];
        for(let i = 0; i < total; ++i){
            if(this.group[i].color == color)
                matched.push(i)
        }
        return matched;
    }


}