    /**
     * A state machine class, it handle state transition and update the state
     */
export class StateMachine {
    constructor(initialState, possibleStates, stateArgs=[]) {
        this.initialState = initialState;
        this.prevState = null;
        this.possibleStates = possibleStates;
        this.stateArgs = stateArgs;
        this.state = null;
    
        // State instances get access to the state machine via this.stateMachine.
        for (const state of Object.values(this.possibleStates)) {
            state.stateMachine = this;
        }
    }
  
    step() {
      // On the first step, the state is null and we need to initialize the first state.
        if (this.state === null) {
            this.state = this.initialState;
            this.possibleStates[this.state].enter(...this.stateArgs);
        }
  
        // Run the current state's execute
        this.possibleStates[this.state].execute(...this.stateArgs);
    }
  
    transition(newState, ...enterArgs) {
        this.prevState = this.state;
        this.state = newState;
        this.possibleStates[this.state].enter(...this.stateArgs, ...enterArgs);
    }
}
  

    /**
     * A base state class
     */
  export class State {
        constructor(){
            this.stateMachine = null;
        }
        enter() {
    
        }
    
        execute() {
    
        }
  }

    /**
     * The set up state, the init state
     * It handle spawning the dots in the scene,
     * and checking if all dots are in positon before
     * transiiton to play state.
     */
  export class SetUpState extends State{
    enter(scene, dot_group, hex_grid, connect) {
        // pause the timer, it should only start when all dots in position
        scene.timer.pasued = true;

        // spawn dots and insert them into the right position
        hex_grid.refillGrid(dot_group.group, true);
    }
  
    execute(scene, dot_group, hex_grid, connect) {
        // move the dots
        dot_group.update();

        // if all dots at rest positon, go to play state
        if (dot_group.isIdle()) {
            scene.timer.paused = false;
            this.stateMachine.transition('play');
            return;
        }
    }
  }
  

    /**
     * The play state, it handle update of graphic
     * and connection path, so that the connected dots 
     * can be connected by a visible line, andthe 
     * last connecting dot will connect to the player pointer
     */
  export class PlayState extends State {

    enter(scene, dot_group, hex_grid, connect) {
        
    }
  
    execute(scene, dot_group, hex_grid, connect) {
        scene.graphic.clear();
        scene.graphic.setVisible(true);

        let pointer = scene.input.activePointer;
        // update positon of the player pointer, 
        // so a line is visible between a dot and the pointer
        connect.updatePath(pointer);
        if(connect.isConnected(false)){
            
            scene.graphic.lineStyle(scene.hexSize/4, connect.getConnectColor());
            scene.graphic.strokePoints(scene.connected.points);
        }
    }
  }

     /**
     * The refill state, handle despawning connected dots
     *  and respawning them, also handle looped dots 
     */
  export class RefillState extends State{

    enter(scene, dot_group, hex_grid, connect) {
        // if the player have connect more than 1 dots,
        // handle it
        if(connect.isConnected(true)){
            let dot_array  = [];
            
            // if there is a loop formed, then find all dots with the matching color
            // else just get the connected dots from the connect object
            if(connect.loop){
    
                let color = connect.getConnectColor();
                dot_array= dot_group.getMatched(color);
            }else {
     
                dot_array = connect.connectDots;
            }
            
            // handle connected dots, despawn and upate all dots position
            hex_grid.connectHandler(dot_array);

            // update the score base on how many dots despawned
            scene.score += dot_array.length;
            
            // respawning all despawned dots to a new posiotn
            hex_grid.refillGrid(dot_array, false);
        }

        // clear the connected store in an array to ready for the next play loop
        connect.resetConnected();
    }
  
    
    execute(scene, dot_group, hex_grid, connect) {
        // update graphic and dots position 
        scene.graphic.clear();
        scene.graphic.setVisible(false);
        dot_group.update();

        // if all dots at rest positon, go to play state
        if (dot_group.isIdle()) {
            scene.timer.paused = false;
            this.stateMachine.transition('play');
            return;
        }
    }
  }


    /**
     * The Game Over state, handle stoping any input
     *  and transiton to the game over screen
     */
  export class GameOverState extends State {

    enter(scene, dot_group, hex_grid, connect) {
        scene.input.off('gameobjectover');
        scene.input.off('gameobjectdown');
        scene.input.off('pointerup');
        scene.input.off('gameobjectup');
        scene.scene.start('game-over', { score: scene.score });
        
    }
  
    execute(scene, dot_group, hex_grid, connect) {
  
    }
  }

