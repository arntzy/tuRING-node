var tur = require('./tuRING');
var fs = require('fs');
var PEG = require('pegjs');
var AJA = {};

module.exports = {
    
    makeMachine : function(){    
        fs.readFile('./grammar', 'utf8', function (err,data) {
            if (err) {
                return console.log(err);
            }
            grammar = data;
            AJA.parser = PEG.buildParser(grammar);
        
            fs.readFile('./rules', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                rules = data; 
                AJA.ast = AJA.parser.parse(rules);
                tur.tuRING.compile.eval(AJA.ast);
                //console.log(this.ast);
            });
            
        });    
    },
    
    _AJA : AJA, 
    
    tapeHead : tur.tapeHead,
    
    tuRING : tur.tuRING
};

module.exports.makeMachine();
//module.exports.AJA = AJA;
//if (msg.type == 'midi') {
	//console.log('MIDI Message:');
	//console.log(msg);
	
	//var cmd = "";
	//var args = [];
	
	//for (var i = 0; i < msg.parameters.length; i++) {
		//args.push({ type: 'float', value: msg.parameters[i]});
	//}
	
	//output.sendOSC(
		//'/' + msg.channel + '/' + msg.commandname, 
		//args
	//);
//}
//else if (msg.type == 'osc') {
	//console.log('OSC Message:');
	//console.log(tur.tapeHead.tape);
    //console.log(msg);
	
	//output.sendOSC(msg.address, msg.args);
//}
