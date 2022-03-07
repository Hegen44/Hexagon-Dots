export default class Connect extends Phaser.Geom.Polygon {

    /**
     * @param {Phaser.Scene} scene
     */
    //* @param {string} tileImage
    constructor(scene)
	{   
        
        super();
        //this.pointer = pointer;
        this.connectDots = [];
        this.setTo(this.connectDots);
        this.loop = false;
	}

    updatePath(pointer){
        if(this.connectDots.length > 0){
            if(pointer){
                this.connectDots.push(pointer);
                this.setTo(this.connectDots);
                this.connectDots.pop();
            }

        } 
    }

    isConnected( moreThanOne){
        if(moreThanOne){
            return this.connectDots.length > 1;
        } else {
            return this.connectDots.length > 0;
        }
        
    }

    isLoop(){
        const uniqueValues = new Set(this.connectDots);
        //console.log(uniqueValues.size + " " + this.connectDots.length)
        return uniqueValues.size < this.connectDots.length;
    }

    getConnectColor(){
        let size = this.connectDots.length;
        if(size > 0){
            return this.connectDots[size - 1].color;
        }
    }

    resetConnected(){
        this.connectDots.length = 0;
    }

    addDot(dot){
        let size = this.connectDots.length;
        if(size == 0){
            this.connectDots.push(dot)
        } else {
            
            let pre_dot = this.connectDots[size - 1];

            if(pre_dot == dot){
                this.connectDots.pop();
            }else if(size > 1 && this.connectDots[size -2] == dot){
                return;
            }else if(pre_dot.color == dot.color && pre_dot.isNeighbor(dot)){
                this.connectDots.push(dot);
            }

        }
    }

    // isNeighbor(dot1, dot2){
    //     let xdiff = Math.abs(dot1.x - dot2.x);
    //     let ydiff = Math.abs(dot1.y - dot2.y);
    //     return xdiff <= 1 && ydiff <= 1;
    // }
}