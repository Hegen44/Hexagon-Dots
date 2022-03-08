    /**
     * Static class that store the color palette
     */
export class ColorCode{ 
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
}

   /**
     * Static class that color operation
     */
export default class DotColors {

    static availableColor = [];  // all color in hex code

   /**
     * Constructor
     */
    static {
        var vals = Object.keys(ColorCode).map(function(key){return ColorCode[key];})
        vals.forEach(element => {
            this.availableColor.push(element)
        });
        this.DOT_COLORS = 5;
    }

    /**
     * Get a random color
     */
    static getRandomColor(){
        let index = Phaser.Math.Between(0, this.DOT_COLORS - 1);
        let hex = this.availableColor[index];
        return  Phaser.Display.Color.HexStringToColor(hex).color;
    }

 
    /**
     * Load setting and getting the DOT_COLORS data
     */
    static upadte_Color_Num(){
		var file = JSON.parse(localStorage.getItem('myHexDotSaveFile'));
		this.DOT_COLORS =  file? file.DOT_COLORS : 5;
	};
}

