//tuRING Midi Keyboard and tuRING Control
s.boot();
s.shutdown;
r.free;
r = nil;
x = nil;
this.dump;
currentEnvironment[\verbal];
currentEnvironment;
this.freeAll;

t.free;
t = nil;

//receive OSC from tuRING
u = OSCFunc( { | msg, time, addr, port |
	msg.postln;
	Synth(\blipperpot, [midinote: msg[1].asInteger]);
}, '/blipper' );

u.free;
u = nil;


//SC sending OSC messages to tuRING
n = NetAddr("127.0.0.1", 8000); 	// OSC port set to 8000
n.sendMsg("/turingRun", 25, 60); // run arg[1] steps starting at index arg[2]
n.sendMsg("/tape");
n.sendMsg("/rules");
n.sendMsg("/tempostep", 120, 96);
n.sendMsg("/init");

n.disconnect


//Synth Setup and Testing
m = NetAddr("127.0.0.1", 57120);
m.sendMsg("/blipper", 60);

//Synth Def
~dryout = Bus.audio(s, 2);
SynthDef(\verb,
        { | outBus = 0, mix = 0.40, room = 0.80, damp = 0.5 |
                var input,revout;
                input = In.ar(~dryout);
                revout = FreeVerb.ar(input,
                        mix, // mix 0-1
                        room, // room 0-1
                        damp // damp 0-1 duh
                ) ! 2; //fan out...
                Out.ar(outBus, revout);
        }).add;

v = Synth(\verb, addAction: \addToTail);
v.set(\room, 0.80);
v.set(\mix, 0.40);
v.set(\damp, 0.5);
v.free;
v = nil;

(
SynthDef(\blipperpot, {|out=0, midinote, dur=0.5|
	var src, env;
	src = Blip.ar(midinote.midicps, 4, 0.2);
	env = EnvGen.kr(Env.perc(0.0, dur), 1.0, doneAction: 2);
	Out.ar(~dryout, (src * env) ! 2);
}).add;
)

// x = Synth(\default, [freq: 60.midicps, amp: 0.5, release: 0.1]);
x = Synth(\blipperpot, [midinote: 60]);
x.release;
x.free;