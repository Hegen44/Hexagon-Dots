import { Geom } from 'phaser';
import HexTile from './hextile'

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
                //this.scene.add.text(startX,  startY, i + ' , ' + j);

                let hexTile= new HexTile(scene, startX, startY,i,j);
                let point = [[0, -s],[w,-s/2], [w,s/2],[0, s],[-w,s/2],[-w,-s/2]];
                let pog = scene.add.polygon(x+w, y+s, point);
                let point2 = [[0, -s/2],[w/2,-s/4], [w/2,s/4],[0, s/2],[-w/2,s/4],[-w/2,-s/4]];
                scene.add.circle(x,y,s/4,0xfbf8fd);
                let pog2 = scene.add.polygon(x+w/2, y+s/2, point2);
                pog.setStrokeStyle(hexSize/10, 0xfbf8fd);
                pog2.setStrokeStyle(hexSize/10, 0xfbf8fd);

 
                startX+=horizontalOffset;
                hexColumn.push(hexTile);
            }    
            this.grid.push(hexColumn);
        }
	}

    /**
     * @param {any} dot
     * @param {number} col the col the dot is falling into
     */
    insertDot(dot, col){ // ToColumn
        if(col >= this.col) return; // error invalid column
        let g = this.grid;
        for(let i = 0; i < this.row; ++i){
            if(i == this.row-1){
                if(g[i][col].hasDot()){ return;} // has dot at last column, not possible, error
                g[i][col].setDot(dot);
            }else if(g[i+1][col].hasDot()){
                g[i][col].setDot(dot); 
                return;
            } else {
                dot.addWayPoint(g[i][col].pos);
            }
        }
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