import Dots from "./dots";

    /**
     * Class that holds all connected dots
     */
export default class Connect extends Phaser.Geom.Polygon {

    /**
     * @param {Phaser.Scene} scene
     */
    constructor(scene)
	{   
        
        super();
        this.scene = scene;
        this.connectDots = [];
        this.setTo(this.connectDots);
        this.loop = false;
	}

    
    /**
     * Update polygon paths so that it connect the last dots with player pointer
     * @param {any} pointer
     */
    updatePath(pointer){
        if(this.connectDots.length > 0){
            if(pointer){
                this.connectDots.push(pointer);
                this.setTo(this.connectDots);
                this.connectDots.pop();
            }

        } 
    }

    
    /**
     * Check if there is any dots connected
     * @param {boolean} moreThanOne flag that determine if having at least 1 dots consinder connected
     * @returns {boolean}
     */
    isConnected( moreThanOne){
        if(moreThanOne){
            return this.connectDots.length > 1;
        } else {
            return this.connectDots.length > 0;
        }
        
    }

    /**
     * Check if there is loopo in the connected by check if the connected dots are unique
     */
    isLoop(){
        const uniqueValues = new Set(this.connectDots);
        return uniqueValues.size < this.connectDots.length;
    }

    /**
     * Get the color of the currently connected
     */
    getConnectColor(){
        let size = this.connectDots.length;
        if(size > 0){
            return this.connectDots[size - 1].color;
        }
    }

    /**
     * Reset the connected dots array
     */
    resetConnected(){
        this.connectDots.length = 0;
        if(this.loop)  {
            this.scene.events.emit('deSpawnLoop');
            this.loop = false;
        }
    }

    /**
     * Add an dots to the connected
     * @param {Dots} dot the dot being add to the array
     */
    addDot(dot){
        let size = this.connectDots.length;
        // check the size, if it is zero, add it without any checking
        if(size == 0){
            this.connectDots.push(dot);
            dot.spawn_Connect_Effect();
        } else {
            // array not empty, do additional check

            // get the last dot in the array
            let pre_dot = this.connectDots[size - 1];

            // player touch the same dot, remove dot from connected
            if(pre_dot == dot){
                this.connectDots.pop();
                // check if the removed dot deform a loop, and remvoe corespodning effect
                if(this.loop && !this.isLoop()){
                    this.scene.events.emit('deSpawnLoop');
                    this.loop = false;
                }
                    
     
            }// It is the prevous dot, igrone it
            else if(size > 1 && this.connectDots[size -2] == dot){
                return;
            }else if(pre_dot.color == dot.color && pre_dot.isNeighbor(dot)){
                // connect the dog
                this.connectDots.push(dot);

                // check if the new dot form a loop, and emit effect if it is
                if(!this.loop &&this.isLoop()){
                    this.loop = true;
                    this.scene.events.emit('spawnLoop');
                } else {
                    dot.spawn_Connect_Effect();
                }
                
            }

        }
    }
}