let defaults = {
	'osc_port':	8000,
	'midi_port':	"MIDIOSC Router",
};

let opt = require('node-getopt').create([
	['l',	'listen=ARG',	'Incoming UDP port for OSC connections, default: ' + defaults.osc_port],
	['m',	'midi=ARG',	'MIDI port name, default: ' + defaults.midi_port],
	['h' ,	'help',		'display this help']
])
.bindHelp()
.setHelp(
	"Usage: " + process.argv.slice(0,2).join(' ') + " [OPTIONS] <scripts> \n" +
	"Node MIDI to OSC Router.\n" + 
	"\n" + 
	"[[OPTIONS]]\n" +
	"\n" +
	"Repository: http://github.com/pwhelan/node-midiosc-bridge\n"
);
let args = opt.parseSystem(); // parse command line

let midi = require('midi'),
    udp = require('dgram'),
    osc = require('osc-min'),
    fs = require('fs'),
    vm = require('vm'),
    mdns = require('mdns2'),
    events = require('events'),
    tur = require('./tuRING'),
    PEG = require('pegjs');

/**
 * Use the grammar file (grammar) and source code (rules) for the tuRING programming language and compile the program for the tapeHead.
 *
 */
function init(){
    fs.readFile('./grammar', 'utf8', function (err,data) {
            if (err) {return console.log(err);}
            grammar = data;
            parser = buildParser(grammar);
            parseRules(parser);
    });
}

function buildParser(grammar){
        parser = PEG.buildParser(grammar);
        return parser;
}

function parseRules(parser){
        fs.readFile('./rules', 'utf8', function (err,data) {
            if (err) { return console.log(err); }
            rules = data; 
            ast = parser.parse(rules);
            compiletuRING(ast);
        });
}
function compiletuRING(ast){
     tur.tuRING.compile.eval(ast);
     console.log("TURING init finished.");
}

function tempoStep(callback, bpm, numsteps){
    let x = 0;
    millis = (60 / bpm) * 1000;   
    
    let intervalID = setInterval(function(){
        console.log(x);
        callback();
        if (++x === numsteps){
            clearInterval(intervalID);
            }
        }, millis);
}

// Start TapeHead
init();

let output = new midi.output();
output.openVirtualPort(
	args.options.midi ?
		args.options.midi:
		defaults.midi_port
);

let input = new midi.input();
input.openPort(0);
input.on('message', function(deltaTime, message) {
    //Intervene here to change MIDI functionality
    //RouterScript.recvMIDI(message);
    //console.log('Midi message received');
    if (message[0] == 144 && message[2] !==0){
        console.log("TURING NOTE: " + tur.tapeHead.tape[message[1]]);
        translatetoOSC('/blipper', tur.tapeHead.tape[message[1]]);
    }
});

function translatetoOSC(address, args){
    let buf;
	buf = osc.toBuffer({
	    oscType: 'message',
		address: address,
		args: args
		});
	
    socket.send(buf, 0, buf.length, 57120, '127.0.0.1'); 
    //console.log("translate called with " + buf);
}


let socket = udp.createSocket('udp4');
socket.on("message", function(buffer, remote) {
	try {
		let msg = osc.fromBuffer(buffer);
		let fs = require('fs');
		
		
		if (msg.address == '/tape') {
		    console.log(tur.tapeHead.tape);
        }

        if (msg.address == '/rules'){
            console.log(tur.tuRING.rules);
        }

        if (msg.address == '/tempostep'){
            tempoStep(tur.tapeHead.step, msg.args[0].value, msg.args[1].value);
        }
		//Potentially intervene here to process OSC message the way you want
        //console.log("OSC message received.");
        if (msg.address == '/turingRun'){
            console.log("Running tuRING " + msg.args[0].value + " steps...");
            tur.tuRING.run.steps(msg.args[0].value, msg.args[1].value);
            //console.log(tur.tapeHead.tape);
            //RouterScript.recvOSC(msg);
        }
	}
	catch(err) {
		console.error('Invalid OSC packet');
		console.error(err);
	}
});

socket.bind(	
	args.options.listen ?
		args.options.listen: 
		defaults.osc_port 
);


let ad = mdns.createAdvertisement(
	mdns.udp('osc'),
	parseInt((args.options.listen ?
		args.options.listen:
		defaults.osc_port))
);

ad.start();

process.on('SIGINT', function () {
	socket.close();
	output.closePort();
    input.closePort();	
	process.exit();
});
