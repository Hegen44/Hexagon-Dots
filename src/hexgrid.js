import { Geom } from 'phaser';
import HexTile from './hextile';
import Dots from './dots';
import { ColorCode } from './dotscolor';

    /**
     * A class of hex grid that holds all hex tile
     *  thie grid is a 2d array
     */
export default class HexGrid {

    /**
     * Contractor
     * @param {Phaser.Scene} scene   the Game Scene
     * @param {number} row           number of row for the grid
     * @param {number} column        nnumber of column for the grid
     * @param {number} hexSize       The radius of the hex
     */
    constructor(scene, row, column, hexSize)
	{   
        // store all neccessary information
        this.grid = [];  // the actual grid, will be a 2d array when it is all setup
        this.scene = scene; 
        this.row = row;
        this.col = column;
        this.hexSize = hexSize;

        let height = scene.scale.height;
        let width = scene.scale.width;

        // calculate the width and height of a single hex tile
        let hexTileHeight = 2 * hexSize;            // height = 2 * hex_radius
        let hexTileWidth = Math.sqrt(3) * hexSize;  // width = sqrt(3) * hex_radius

        // calculate the width and height of a single hex tile
        let verticalOffset=hexTileHeight*3/4; //distance vertically from one center to another = 3/4* hex_height
        let horizontalOffset=hexTileWidth;    // distance horizontally from on center to another center = hex_height

        // the x and y offset from turning a square grid to a hex grid
        let xOffset = hexTileWidth/2;                               
        let yOffset = hexTileHeight/2;                              

        // calcualte the starting position of the first hex in the grid 
        // it is calculate based on subtracting the half total height and width of the grid
        // from the cnter posiition
        let startXInit= width/2 - ((column+0.5) * hexTileWidth) /2;                        // total width of grid is (x column + .5f column)  * hexTileWidth
        let startYInit= height/2 - ((row - 1) * (hexTileHeight* 3/4) + hexTileHeight) /2; // total height of grid is (row - 1) * (hexTileHeight* 3/4) + hexTileHeight

        // seting up the grid and fill it with hex tiles
        for (let i = 0; i < row; i++)
        {
            let hex_array = [];

            // calculate the x position of each row
            let startX = startXInit;
            startX += this.getRowHorzOffset(i, xOffset);

            // calculate the y position of each row
            let startY= startYInit + yOffset +(i*verticalOffset);
            
            for (let j = 0; j < column; j++)
            {
                let x = startX, y = startY, s = hexSize, w = hexTileWidth/2; 
                let b = Phaser.Display.Color.HexStringToColor(ColorCode.BLACK).color;

                // create the hex
                let hexTile= new HexTile(startX, startY,i,j);

                // set up the six points in relative to the hex
                let point = [[0, -s],[w,-s/2], [w,s/2],[0, s],[-w,s/2],[-w,-s/2]];
                // create a polygon to render the hexagon
                let hex_Poly = scene.add.polygon(x, y, point);
                hex_Poly.setOrigin(0);
                hex_Poly.setStrokeStyle(hexSize/10, b);

                // render a cirlce in the center of the hex
                scene.add.circle(x,y,s/2.5,b);
 
                // increment the x positon to the next column 
                startX+=horizontalOffset;
                hex_array.push(hexTile);
            }    

            // store the current array into the grid
            this.grid.push(hex_array);
        }
	}

    /**
     * Handle despawning and clearing dots from their coresspoding hex tile
     * @param {Dots[]} dot_array array of dots that is going to despawn
     */
    connectHandler(dot_array){
        for(let i = 0; i < dot_array.length; ++i){
            let d = dot_array[i];
            this.grid[d.row][d.column].clearDot();
            d.despawn();
        }
    }

    /**
     * @param {Dots} dot   the dot being inserting into the grid
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

    /**
     * This function update and shifting all dots down to refill empty spaces
     */
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
     * Refill grid with dots
     * @param {Dots[]}  dot_array new dots that is going to be refilled into the grid
     * @param {boolean} isSetup   the flag that indicate if it is the first time filling the grid
     */
    refillGrid(dot_array, isSetup){

        // maps dot's occurrencs into map, so it will be easier to handle y positon of the dots
        const col_occ = dot_array.reduce(function (acc, curr) { // occurrences
            return acc[curr.column] ? ++acc[curr.column] : acc[curr.column] = 1, acc
          }, {});

        // if it is not first setup
        if(!isSetup){
            let temp = [];

            // this keys are column that needs dots inserted while 
            // the values are the number of dots needed per column
            for (const [key, value] of Object.entries(col_occ)) {
                this.updateColumn(key);
                
                for(let v = 0; v < value; ++ v){
                    let d = dot_array.shift();
                    if(!d) return;
                    // spawn and inser the dots with the calculated x and y position 
                    // base on column and row
                    d.spawn(this.grid[0][key].x, (-v - 1) * this.hexSize * 2 * 3/4);
                    this.insertDot(d, 0, Number(key));
                    temp.push(d);
                }
            }     
            dot_array = temp; 
        } else { 

            // if it is  first setup, refill all dots without any extra calculation
            for(let i  = 0; i < dot_array.length; ++i){

                let d = dot_array[i];

                // calcualte the row it will be in
                let row = Math.floor(i/this.col);

                // calculate the column it will be in
                let col = i%this.col;

                // spawn and inser the dots
                d.spawn(this.grid[0][col].x, (-row - 1) * this.hexSize * 2 * 3/4);
                this.insertDot(d, 0, Number(col));
            }
        }

        // check if the current game is softlocked
        // meaning: no same color in the grid next to each other
        if(this.isSoftLocked()){
            
            // if softlocked, pick a random new dot, and pick a random availbe neighbor
            // and set the dots to that neighbor's  color

            // get random color
            let randomIndex = Phaser.Math.Between(0, dot_array.length -1);

            // get random dots from avabile new dots
            let dot = dot_array[randomIndex];

            // get its neighbor and their color
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

            // set given color
            dot.set_Color(neighborColor[randomIndex]);
        }

    }
     /**
     * check if game is softlocked by checking each tile and its neighbor 
     * and see if there is at least one matching color
     * This method is ineffectine in large grid, so it should not be called often
     */
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

    

    /**
     * Get the starting x offset base on if the row is even of odd
     * even row get shift to the right by the offset
     * @param {number} currentRow   the current row number
     * @param {number} xOffset      x offset pf each hex
     * @returns {number}            the result offset
     */
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