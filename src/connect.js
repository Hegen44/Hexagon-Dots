export default class Connect extends Phaser.Geom.Polygon {

    /**
     * @param {Phaser.Scene} scene
     */
    //* @param {string} tileImage
    constructor(scene)
	{   
        
        super();
        this.scene = scene;
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
        if(this.loop)  {
            this.scene.events.emit('deSpawnLoop');
            this.loop = false;
        }
    }

    addDot(dot){
        let size = this.connectDots.length;
        if(size == 0){
            this.connectDots.push(dot);
            dot.spawn_Connect_Effect();
        } else {
            
            let pre_dot = this.connectDots[size - 1];

            // player touch the same dot, remove dot from connected
            if(pre_dot == dot){
                this.connectDots.pop();
                if(this.loop && !this.isLoop()){
                    this.scene.events.emit('deSpawnLoop');
                    this.loop = false;
                }
                    
     
            }// It is the prevous dot, igrone it
            else if(size > 1 && this.connectDots[size -2] == dot){
                return;
            }else if(pre_dot.color == dot.color && pre_dot.isNeighbor(dot)){
                this.connectDots.push(dot);
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