
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

    static RED =  "0xb03a48";
    static GREEN = "0x3e6958";
    static BLUE = "0x5c8b93";
    static YELLOW = "0xe0c872";
    static ORANGE = "0xd4804d";
    static BLOWN = "0x624c3c";
    static CYON = "0x72dcbb";
    static PINK = "0xffa7a5";
    static PURPLE = "0xab5675";

    static IVORY = "0xb1a58d";
    static CREME = "0xd9ac8b";
    static WHITE = "0xe3cfb4";
    static BLACK = "0x2b2821";


    // static WHITE = "0xffe7d6";
    // static PINK = "0xffa7a5";
    // static PURPLE = "0xab5675";
    // static BLACK = "0x2b2821"; 
    // static BLUE = "0x34acba";
    // static BLOWN = "0x73464c";
    // static RED =  "0xee6a7c";
    // static ORANGE = "0xd4804d";
    // static YELLOW = "0xffe07e";
    // static GREEN = "0x72dcbb";
}


export default class DotColors {

    static availableColor = [];  // all color in hex code

    static getRandomColor(){
        let index = Phaser.Math.Between(0, this.DOT_COLORS - 1);
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

    static upadte_Color_Num(){
		var file = JSON.parse(localStorage.getItem('myHexDotSaveFile'));
		this.DOT_COLORS =  file? file.DOT_COLORS : 5;
	};
}

