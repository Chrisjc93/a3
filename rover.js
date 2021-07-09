class Rover {

  constructor(position, generatorWatts = 110){
    if (typeof(position) !== "number") {
      throw Error("Position should be a number");
    }
    this.position = position;
    this.mode = 'NORMAL';
    this.generatorWatts = generatorWatts;
  }

  receiveMessage(message){
    if (typeof(message) !== "object") {
      throw Error("Message should be an object");
    }

    let response = {
    message: message.name,
    results:[]
    }

   let roverComplete = {
      completed: false
    }

   let changeComplete = {
     completed: false
   }

    for (let i = 0; i < message.commands.length; i++) {
      if (message.commands[i].commandType === 'MOVE') {
        if ( this.mode === 'NORMAL') {
          this.position = message.commands[i].value;
          roverComplete['completed'] = true;
          response.results.push(roverComplete);
        } else if (this.mode === 'LOW_POWER'){
            roverComplete['completed'] = false;
            response.results.push(roverComplete);
        }

      } else if (message.commands[i].commandType === "STATUS_CHECK") {
          let roverStatus = {
            completed: true,
            roverStatus: {
            mode: this.mode, 
            generatorWatts: this.generatorWatts, 
            position: this.position
              }
            }
          response.results.push(roverStatus);
          roverComplete['completed'] = true;

      } else if (message.commands[i].commandType === "MODE_CHANGE") {
          if (message.commands[i].value === "LOW_POWER" || message.commands[i].value === "NORMAL" && message.commands[i].value !== this.mode) {
            this.mode = message.commands[i].value;
            changeComplete['completed'] = true;
            response.results.push(changeComplete);
          } else {
            throw Error("You can only pass 'LOW_POWER' or 'NORMAL'! and you can only change to the opposite mode.");
          }
      }
    }
    return response;
  }
}

module.exports = Rover;
