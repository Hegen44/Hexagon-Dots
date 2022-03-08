import Phaser from 'phaser'
    /**
     * An event listener that pass neccessay between ui scene and game scene
     */
const eventsCenter = new Phaser.Events.EventEmitter()
export default eventsCenter