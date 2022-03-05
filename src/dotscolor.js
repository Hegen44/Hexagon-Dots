
class ColorCode{ 
    static WHITE = "0xfbf8fd";
    static GRAY = "0xa1a9d1";
    static BLUE = "0x007fff";
    static NAVY = "0x24256f";
    static BLACK = "0x141218"; 
    static PURPLE = "0x5f0e52";
    static RED =  "0xfd1a43";
    static ORANGE = "0xffb16c";
    static YELLOW = "0xfede5b";
    static GREEN = "0x74ead6";
}


export default class DotColors {

    static availableColor = [];  // all color in hex code
    static pickedColor = [2, 6, 7, 8, 9];

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

