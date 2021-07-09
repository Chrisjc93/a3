const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!

  it("constructor sets position and default values for mode and generatorWatts", function() {
    let rover = new Rover(98382);
    expect(rover.position).toEqual(98382);
    expect(rover.mode).toEqual('NORMAL');
  });

  it("response returned by receiveMessage contains name of message", function() {
    let commands = [new Command('STATUS_CHECK'), new Command('MOVE', 20)];
    let message1 = new Message('Another message!', commands);
    let rover = new Rover(98382); 
    expect(rover.receiveMessage(message1).message).toEqual('Another message!');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    let commands = [new Command('STATUS_CHECK'), new Command('MOVE', 20)];
    let message1 = new Message('Another message!', commands);
    let rover = new Rover(98382); 
    expect(rover.receiveMessage(message1).results.length).toEqual(2);
  });

  it("responds correctly to status check command", function() {
    let commands = [new Command('STATUS_CHECK')];
    let message1 = new Message('Another message!', commands);
    let rover = new Rover(98382); 
    expect(rover.receiveMessage(message1).results).toEqual([ Object({ completed: true, roverStatus: Object({ mode: 'NORMAL', generatorWatts: 110, position: 98382 }) }) ]);
  });

  it("responds correctly to mode change command", function() {
    let commands = [new Command('MODE_CHANGE', 'LOW_POWER')];
    let message1 = new Message('Another message!', commands);
    let rover = new Rover(98382);
    rover.receiveMessage(message1) 
    expect(rover.mode).toEqual("LOW_POWER");
    expect(rover.receiveMessage(message1).results).toEqual([ Object({ completed: true }) ]);
    commands = [new Command('MODE_CHANGE', 'NORMAL')];
    message1 = new Message('Another message!', commands);
    rover = new Rover(98382);
    expect(rover.mode).toEqual("NORMAL");
  });


    it("responds with false completed value when attempting to move in LOW_POWER mode", function() {
      let rover = new Rover(98382);
      let commands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 20)];
      let message1 = new Message('Another message!', commands);
      expect(rover.receiveMessage(message1).results[0].completed).toEqual(true);
      expect(rover.receiveMessage(message1).results[1].completed).toEqual(false);
      expect(rover.position).toEqual(98382);

  });


    it("responds with position for move command", function() {
      let rover = new Rover(98382);
      let commands = [new Command('MOVE', 20)];
      let message1 = new Message('Another message!', commands);
      expect(rover.receiveMessage(message1).results[0].completed).toEqual(true);
      expect(rover.position).toEqual(20);

  });

});

