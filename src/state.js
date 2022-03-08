
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
  
  export class State {
        constructor(){
            this.stateMachine = null;
        }
        enter() {
    
        }
    
        execute() {
    
        }
  }

  export class SetUpState extends State{
    enter(scene, dot_group, hex_grid, connect) {
        scene.timer.pasued = true;
        hex_grid.refillGrid(dot_group.group, true);
    }
  
    execute(scene, dot_group, hex_grid, connect) {
        dot_group.update();
        if (dot_group.isIdle()) {
            scene.timer.paused = false;
            this.stateMachine.transition('play');
            return;
        }
    }
  }
  
  export class PlayState extends State {

    enter(scene, dot_group, hex_grid, connect) {
        
    }
  
    execute(scene, dot_group, hex_grid, connect) {
        scene.graphic.clear();
        scene.graphic.setVisible(true);

        let pointer = scene.input.activePointer;
        connect.updatePath(pointer);
        if(connect.isConnected(false)){
            
            scene.graphic.lineStyle(scene.hexSize/4, connect.getConnectColor());
            scene.graphic.strokePoints(scene.connected.points);
        }
    }
  }

  export class RefillState extends State{

    enter(scene, dot_group, hex_grid, connect) {

        if(connect.isConnected(true)){
            let dot_array  = [];
            if(connect.loop){
    
                let color = connect.getConnectColor();
                dot_array= dot_group.getMatched(color);
            }else {
     
                dot_array = connect.connectDots;
            }
            
            hex_grid.connectHandler(dot_array);
            scene.score += dot_array.length;
            
            hex_grid.refillGrid(dot_array, false);
        }
        connect.resetConnected();
    }
  
    execute(scene, dot_group, hex_grid, connect) {
        scene.graphic.clear();
        scene.graphic.setVisible(false);
        dot_group.update();
        if (dot_group.isIdle()) {
            scene.timer.paused = false;
            this.stateMachine.transition('play');
            return;
        }
    }
  }

  export class PauseState extends State {

    enter(scene, dot_group, hex_grid, connect) {
        scene.timer.paused = true;
    }
  
    execute(scene, dot_group, hex_grid, connect) {
        let prev = this.stateMachine.prevState;
        this.stateMachine.transition(prev);
    }
  }

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

