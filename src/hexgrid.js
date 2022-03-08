import { Geom } from 'phaser';
import HexTile from './hextile';
import Dots from './dots';
import { ColorCode } from './dotscolor';

export default class HexGrid {

    /**
     * @param {Phaser.Scene} scene
     * @param {number} row
     * @param {number} column
     * @param {number} hexSize
     * @param {number} SceneHeight
     * @param {number} SceneWidth
     */
    constructor(scene, row, column, hexSize,  SceneWidth, SceneHeight)
	{   

        this.grid = [];
        this.scene = scene;
        this.row = row;
        this.col = column;
        this.hexSize = hexSize;
        const hexOriginImageSize = 30.5; // original image size (hex)
        //var hexSize = 30;//30;   // distance from the center to any corner (radius)
        let height = SceneHeight;
        let width = SceneWidth;


        let hexImageScale = hexSize/hexOriginImageSize; // scale of the hex 
        let hexTileHeight = 2 * hexSize; // h = 2 * size
        let hexTileWidth = Math.sqrt(3) * hexSize; // w = sqrt(3) * size

        let verticalOffset=hexTileHeight*3/4; //distance vertically from one center to another is 3/4h
        let horizontalOffset=hexTileWidth; // distance horizontally from on center to another center is w

        let xOffset = hexTileWidth/2;
        let startXInit= width/2 - ((column+0.5) * hexTileWidth) /2;  // total width of grid is (x column + .5f column)  * hexTileWidth

        let yOffset = hexTileHeight/2;
        let startYInit= height/2 - ((row - 1) * (hexTileHeight* 3/4) + hexTileHeight) /2; // total height of grid is (row - 1) * (hexTileHeight* 3/4) + hexTileHeight

        for (let i = 0; i < row; i++)
        {
            let hexColumn = [];
            let startX = startXInit;
            startX += this.getRowHorzOffset(i, xOffset);
            let startY= startYInit + yOffset +(i*verticalOffset);
            
            for (let j = 0; j < column; j++)
            {
                let x = startX, y = startY, s = hexSize, w = hexTileWidth/2; 
                let b = Phaser.Display.Color.HexStringToColor(ColorCode.BLACK).color;

                let hexTile= new HexTile(scene, startX, startY,i,j);
                
                let point = [[0, -s],[w,-s/2], [w,s/2],[0, s],[-w,s/2],[-w,-s/2]];
                let pog = scene.add.polygon(x, y, point);
                pog.setOrigin(0);
                pog.setStrokeStyle(hexSize/10, b);

                // look A
                // let point2 = [[0, -s/2],[w/2,-s/4], [w/2,s/4],[0, s/2],[-w/2,s/4],[-w/2,-s/4]];
                // let pog2 = scene.add.polygon(x, y, point2);
                // pog2.setOrigin(0);
                // pog2.setStrokeStyle(hexSize/10, b);
                // scene.add.circle(x,y,s/4.5,b);

                //look B
                scene.add.circle(x,y,s/2.5,b);
                
                

                //this.scene.add.text(startX,  startY, i + ' , ' + j);

                let point3 = [0,-s, w,-s/2, w,s/2, 0,s, -w,s/2, -w,-s/2];
                let lpp = new Phaser.Geom.Polygon();
                lpp.setTo(point3)

 
                startX+=horizontalOffset;
                hexColumn.push(hexTile);
            }    
            this.grid.push(hexColumn);
        }
	}

    /**
     * @param {Dots[]} dot_array
     */
    connectHandler(dot_array){
        for(let i = 0; i < dot_array.length; ++i){
            let d = dot_array[i];
            this.grid[d.row][d.column].clearDot();
            d.despawn();
        }
    }

    /**
     * @param {any} dot
     * @param {number} row the starting row the dot is falling into
     * @param {number} col the col the dot is falling into
     */
    insertDot(dot, row, col){ // ToColumn
        if(col >= this.col || row >= this.row) return; // error invalid column
        let g = this.grid;
        for(let i = row; i < this.row; ++i){
            if(i == this.row-1){
                if(g[i][col].hasDot()){ return;} // has dot at last column, do nothing
                g[i][col].setDot(dot);
            }else if(g[i+1][col].hasDot()){
                g[i][col].setDot(dot); 
                return;
            } else {
                dot.addWayPoint(g[i][col].pos);
            }
        }
    }

    updateColumn(col){
        for(let i  = this.row-2; i >= 0; --i){
            let hex = this.grid[i][col];
            let hexNext = this.grid[i+1][col]; 
            if(hex.hasDot() && !hexNext.hasDot()){
                let dot = hex.dot
                hex.clearDot();
                this.insertDot(dot, dot.row, dot.column);
            }
        }
    }

    /**
     * @param {Dots[]} dot_array
     * @param {boolean} isSetup the col the dot is falling into
     */
    refillGrid(dot_array, isSetup){

        const col_occ = dot_array.reduce(function (acc, curr) { // occurrences
            return acc[curr.column] ? ++acc[curr.column] : acc[curr.column] = 1, acc
          }, {});

        if(!isSetup){
            let temp = [];
            for (const [key, value] of Object.entries(col_occ)) {
                this.updateColumn(key);
                
                for(let v = 0; v < value; ++ v){
                    let d = dot_array.shift();
                    if(!d) return;
                    d.spawn(this.grid[0][key].x, (-v - 1) * this.hexSize * 2 * 3/4);
                    this.insertDot(d, 0, Number(key));
                    temp.push(d);
                }
            }     
            dot_array = temp; 
        } else {
            for(let i  = 0; i < dot_array.length; ++i){
                let d = dot_array[i];
                let row = Math.floor(i/this.col);
                let col = i%this.col;
                d.spawn(this.grid[0][col].x, (-row - 1) * this.hexSize * 2 * 3/4);
                this.insertDot(d, 0, Number(col));
            }
        }

        if(this.isSoftLocked()){
            console.log("locked");
            let randomIndex = Phaser.Math.Between(0, dot_array.length -1);

            let dot = dot_array[randomIndex];
            let nei = dot.getNeighborIndexs(dot.row);
            let neighborColor = []
            for(let n of nei){
                let i = n[0] + dot.row;
                let j = n[1] + dot.column;
                if(i >= 0 && i < this.row && j >= 0 && j < this.col){
                    neighborColor.push(this.grid[i][j].dot.color);
                }
            }
            randomIndex = Phaser.Math.Between(0, neighborColor.length -1);
            dot.set_Color(neighborColor[randomIndex]);
        }

    }
    // check if game is softlocked
    isSoftLocked(){
        for(let r of this.grid){
            for(let hex of r){
                let dot = hex.dot;
                let nei = dot.getNeighborIndexs(dot.row);
                for(let n of nei){
                    let i = n[0] + dot.row;
                    let j = n[1] + dot.column;
                    if(i >= 0 && i < this.row && j >= 0 && j < this.col){
                        if(this.grid[i][j].dot.color == dot.color){
                            return false;
                        }
                    }

                }
            }
        }
        return true;
    }

    getRowHorzOffset(currentRow, xOffset){
        let startX = 0;
        if(currentRow%2!==0){
            startX =xOffset;
        }else{
            startX =2*xOffset;
        }
        return startX;
    }

}