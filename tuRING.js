var sugar = require('sugar');
var removeAt = sugar.removeAt;

var tapeHead = { 
    masterIndex: 60,
    currentRule : {},

    defaultRule : {
      operator : '+',
      number : 0,
      state: 'default'
    },

    tape : {

      init : function(){
        for (var i = 21; i < 109; i++) {
          tapeHead.tape[i] = i; 
        }
      }
    },

    state : 'default',
    direction : 'default',

    step: function(){
      tapeHead.read();
      tapeHead.write();
      tapeHead.move(); 
    },

    read : function(){
      console.log("READING");
      tapeHead.currentRule = tapeHead.defaultRule;

      console.log("The tapehead master index is " + tapeHead.masterIndex + '.');
      console.log("The note number at this master index is " + tapeHead.tape[tapeHead.masterIndex] + '.');

      var note = tapeHead.getNoteName(tapeHead.tape[tapeHead.masterIndex]); 
      console.log("The note name at this master index is: " + note);

      console.log("The current state of the tapehead is " + "'" + tapeHead.state + "'.");

      for (var i in tuRING.rules){
        if ((tapeHead.state == tuRING.rules[i].state)&&(note == tuRING.rules[i].note || note[0] == tuRING.rules[i].note || note[1] == tuRING.rules[i].note))
        {
          console.log("User-defined rule exists.");
          tapeHead.currentRule = tuRING.rules[i];
        }
      }

      console.log("The current rule is: ");
      console.log(tapeHead.currentRule);
    },

    write : function(){
      console.log("WRITING");

      var noteNumber = tapeHead.tape[tapeHead.masterIndex]; 
      var op = tapeHead.currentRule.operator;
      var changeValue = tapeHead.currentRule.number;
      tapeHead.tape[tapeHead.masterIndex] = tuRING.dictionary[op](noteNumber, changeValue); 

      console.log("The new note number at this index is: " + tapeHead.tape[tapeHead.masterIndex]);
      var note = tapeHead.getNoteName(tapeHead.tape[tapeHead.masterIndex]); 
      console.log("The new note name at this master index is: " + note);
    },

    move : function(){

      if(tapeHead.currentRule.move){
        var move = tapeHead.currentRule.move;
        tapeHead.direction = move;
      }

      if(tapeHead.masterIndex == 21){
        tapeHead.direction = 'R';
      }

      if(tapeHead.masterIndex == 108){
        tapeHead.direction = 'L';
      }

      tapeHead.masterIndex = tuRING.dictionary[tapeHead.direction](tapeHead.masterIndex);

      if(tapeHead.currentRule.newstate){
        var newstate = tapeHead.currentRule.newstate;
        tapeHead.state = newstate; 
      }

      console.log("MOVING " + tapeHead.direction + " into STATE: " + "'"+tapeHead.state+"'");
      console.log("-------------------------");
    },

    getNoteName: function(noteNumber){
      var modulus = noteNumber % 12; 
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
    //getNoteName: function(noteNumber){
      //var modulus = noteNumber % 12; 
      //switch (modulus)
      //{
        //case 0:
        //return "C";
        //case 1:
        //return 'C#';
        //case 2:
        //return "D";
        //case 3:
        //return "D#";
        //case 4:
        //return "E";
        //case 5:
        //return "F";
        //case 6:
        //return 'F#';
        //case 7:
        //return "G";
        //case 8:
        //return 'G#';
        //case 9:
        //return "A";
        //case 10:
        //return "A#";
        //case 11:
        //return "B";
      //}
    //}
  };
  
  var tuRING = {

    rules: {},
    
    grammar: null,

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
        for (var i = 0; i < source.length; i++) {
          for(var j = 0; j < source[i].length; j++){
            if (source[i][j] instanceof Array || source[i][j] == 'undefined' ){
                source[i].removeAt(j);
            }
          }
        }
        return source; 
      },

      parseRules: function(source){
      for (var i in source){
        tuRING.rules[i].state = source[i][1].word; 
        tuRING.rules[i].note = source[i][3].word;
        tuRING.rules[i].operator = source[i][5].word;
        tuRING.rules[i].number = source[i][6];
        tuRING.rules[i].move  =  source[i][8].word;
        tuRING.rules[i].newstate  =  source[i][10].word;
      }
         //console.log(tuRING.rules);
    },
    
    createRules: function(source){
      for (var i = 0; i < source.length; i++) {
       tuRING.rules[i] = source[i];
       //console.log(tuRING.rules);
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
    
    for (var i = 0; i < numSteps; i++) {
      tapeHead.step();
    }
  }
}
};

module.exports.tapeHead = tapeHead;
module.exports.tuRING = tuRING;
