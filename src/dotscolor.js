
export class ColorCode{ 
    // static WHITE = "#ffeee5";
    // static GRAY = "#3e4a6d";
    // static SLIVER = "#5a7088";
    // static BLUE = "#0099db";
    // static NAVY = "#124e89";
    // static BLACK = "#1c162d "; 
    // static PURPLE = "#841252";
    // static VIOLET = "#3d083b";
    // static RED =  "#da2424";
    // static ORANGE = "#f77622";
    // static GOLD = "#ecab11";
    // static YELLOW = "#fee761";
    // static LIME = "#07e5a0";
    // static GREEN = "#43bd35";

    static WHITE = "#e3cfb4";
    static CREME = "#d9ac8b";
    static IVORY = "#b1a58d";
    static SKY = "#5d7275";
    static BLUE = "#5c8b93";
    static NAVY = "#243d5c";
    static BLACK = "#2b2821"; 
    static BLOWN = "#624c3c";
    static RED =  "#b03a48";
    static ORANGE = "#d4804d";
    static YELLOW = "#e0c872";
    static GREEN = "#3e6958";
}


export default class DotColors {

    static availableColor = [];  // all color in hex code
    static pickedColor = [8, 11, 10, 4, 9];

    static getRandomColor(){
        let pickedIndex = Phaser.Math.Between(0, this.DOT_COLORS - 1);
        return this.getPickedColorByIndex(pickedIndex);
    }

    static getPickedColorByIndex(num){
        let index = this.pickedColor[num];
        return this.availableColorByIndex(index);
    }

    static availableColorByIndex(code){
        let hex = this.availableColor[code];
        return  Phaser.Display.Color.HexStringToColor(hex).color;
    }

    static {
        var vals = Object.keys(ColorCode).map(function(key){return ColorCode[key];})
        vals.forEach(element => {
            this.availableColor.push(element)
        });
        //vals.forEach.forEach(c => this.availableColor.push(c));
        //Object.values(ColorCode).forEach(c => this.availableColor.push(c))
        this.DOT_COLORS = 5;
    }
}

