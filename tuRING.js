// tuRING.js 


// tapeHead is the actual turing machine as it applies to a piano keyboard, with funcitonality and properties
let tapeHead = { 
  masterIndex: 60, //start on middle C
  currentRule : {},

  // initialize the tape with the midi note numbers of the piano
  tape : {
    init : function(){
      for (let i = 21; i < 109; i++) {
        tapeHead.tape[i] = i; 
      }
    }
  },

  // default parameters 
  state : 'default',
  direction : 'default',
  defaultRule : {
    operator : '+',
    number : 0,
    state: 'default'
  },

  // defines a single tuRING step, which includes read the tape, writing to the tape, and a moving to the right or left.
  step: function(){
    tapeHead.read();
    tapeHead.write();
    tapeHead.move(); 
  },
  
  // read the value at the tapeHead 
  read : function(){
    console.log(`READING`);
  
    // A default rule which does nothing is used in the absence of a user-defined rule.
    tapeHead.currentRule = tapeHead.defaultRule;
    console.log(`The tapehead master index is ${tapeHead.masterIndex}.`);
    console.log(`The midi note number at this master index is ${tapeHead.tape[tapeHead.masterIndex]}.`);
    let note = tapeHead.getNoteName(tapeHead.tape[tapeHead.masterIndex]); 
    console.log(`The note name at this master index is: ${note}`);
    console.log(`The current state of the tapehead is '${tapeHead.state}'.`);

    // checks for a user-defined rule using the current state of the machine and the note name,
    // the OR statement checks for enharmonic spelling  
    for (let i in tuRING.rules){
      if ((tapeHead.state == tuRING.rules[i].state) &&
          (note == tuRING.rules[i].note || note[0] == tuRING.rules[i].note || note[1] == tuRING.rules[i].note))
        {
          console.log(`User-defined rule exists.`);
          tapeHead.currentRule = tuRING.rules[i];
        }
    }
    console.log('The current rule is:');
    console.log(tapeHead.currentRule);
  },

  // write a new value on the tape at the tapeHead
  write : function(){
    console.log("WRITING");

    let noteNumber = tapeHead.tape[tapeHead.masterIndex]; 
    let op = tapeHead.currentRule.operator;
    let changeValue = tapeHead.currentRule.number;
    tapeHead.tape[tapeHead.masterIndex] = tuRING.dictionary[op](noteNumber, changeValue); 

    console.log(`The new note number at this index is: ${tapeHead.tape[tapeHead.masterIndex]}`);
    let note = tapeHead.getNoteName(tapeHead.tape[tapeHead.masterIndex]); 
    console.log(`The new note name at this master index is: ${note}`);
  },

  // move to the right or left and update the tuRING state according to the current rule
  move : function(){
    if(tapeHead.currentRule.move){
      let move = tapeHead.currentRule.move;
      tapeHead.direction = move;
    }
    
    // Check for the boundaries of the piano, and force a move in the other direction to stay 'in bounds'
    if(tapeHead.masterIndex == 21){
      tapeHead.direction = 'R';
    }
    if(tapeHead.masterIndex == 108){
      tapeHead.direction = 'L';
    }
    // update the masterIndex position on the piano
    tapeHead.masterIndex = tuRING.dictionary[tapeHead.direction](tapeHead.masterIndex);
    
    // set the new state according to the rule
    if(tapeHead.currentRule.newstate){
      let newstate = tapeHead.currentRule.newstate;
      tapeHead.state = newstate; 
    }
    console.log(`MOVING ${tapeHead.direction} into STATE: '${tapeHead.state}'`);
    console.log("-------------------------");
  },

  // map midi note numbers to note names
  getNoteName: function(noteNumber){
    let modulus = noteNumber % 12; 
    switch (modulus)
    {
      case 0:
      return "C";
      case 1:
      return ['C#', 'Db'];
      case 2:
      return "D";
      case 3:
      return ["D#", "Eb"];
      case 4:
      return "E";
      case 5:
      return "F";
      case 6:
      return ['F#','Gb'];
      case 7:
      return "G";
      case 8:
      return ['G#', 'Ab'];
      case 9:
      return "A";
      case 10:
      return ["A#", 'Bb'];
      case 11:
      return "B";
    }
  }
};
  
// The implementation of the programming language 'tuRING', which describes rules for the tapeHead piano turing maching. 
let tuRING = {
  rules: {},
  grammar: null,

  // maps operators to functionality given a noteNumber or masterIndex position on the piano
  dictionary: {
    '+' : function(noteNumber, changeValue){
      return noteNumber + changeValue; 
    },
    '-' : function(noteNumber, changeValue){
      return noteNumber - changeValue;
    },
    'L' : function(masterIndex){
      return masterIndex - 1;
    },
    'R' : function(masterIndex){
      return masterIndex + 1;
    }
  },   
  compile: {
    eval: function(source) {
      source = tuRING.compile.trim(source); 
      tuRING.compile.createRules(source); 
      tapeHead.tape.init();
      return "compiled."; 
    },
    trim: function(source){
      for (let i = 0; i < source.length; i++) {
        for(let j = 0; j < source[i].length; j++){
          if (source[i][j] instanceof Array || source[i][j] == 'undefined' ){
              source[i].splice(j, 1);
          }
        }
      }
      return source; 
    },
    // parse out the individual elements of the rule description
    parseRules: function(source){
        for (let i in source){
        tuRING.rules[i].state = source[i][1].word; 
        tuRING.rules[i].note = source[i][3].word;
        tuRING.rules[i].operator = source[i][5].word;
        tuRING.rules[i].number = source[i][6];
        tuRING.rules[i].move  =  source[i][8].word;
        tuRING.rules[i].newstate  =  source[i][10].word;
      }
    },
    createRules: function(source){
        for (let i = 0; i < source.length; i++) {
           tuRING.rules[i] = source[i];
        }
        tuRING.compile.parseRules(tuRING.rules);
    },
  },
  run: {
    steps: function(numSteps,curIndex){
      if (curIndex !== undefined){ 
          tapeHead.masterIndex = curIndex;
          console.log("index passed");    
      }
      for (let i = 0; i < numSteps; i++) {
        tapeHead.step();
      }
    }
  }
};

module.exports.tapeHead = tapeHead;
module.exports.tuRING = tuRING;
