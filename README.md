# tuRING-node
hear the results of a Turing tape calculation by changing the sounding notes of a piano keyboard. 

## Installation
1. clone this repo
2. `npm install`
3. modify the 'rules' files in this directory to contain your custom tuRING rules.
4. `node main.js`

## Example SuperCollider API 

- The tuRING machine accepts OSC messages as commands.

- n = NetAddr("127.0.0.1", 8000); 	// OSC port set to 8000 
- n.sendMsg("/tape"); // print the current tuRING 'tape' 
- n.sendMsg("/rules"); // show the current rule set as defined by you. 
- n.sendMsg("/turingRun", 25, 60); // run 25 steps starting at index 60
- n.sendMsg("/tempostep", 120, 96); // run 96 steps at a BPM of 120
- n.sendMsg("/init"); // initialize the tape back to its 'natural' configuration.
