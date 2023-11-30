class Magenta {
    constructor() {
        this.isPlaying = false;
        this.audioInitialized = false;
        this.activeOscillators = [];
        this.noteTimeouts = [];
    }

    initializeAudio() {
        this.audioInitialized = true;
    }

    startMusicGeneration() {
        if (!this.isPlaying && this.audioInitialized) {
            this.modifyAndGenerateMusic();
        }
    }

    stopMusicGeneration() {
        console.log("Stopping Music Generation");
        this.stopActiveOscillators();
        this.clearNoteTimeouts();
        this.isPlaying = false;
    }

    stopActiveOscillators() {
        this.activeOscillators.forEach(osc => {
            console.log("Stopping oscillator");
            osc.stop();
        });
        this.activeOscillators = [];
    }

    modifyAndGenerateMusic() {
        const mvae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
        mvae.initialize().then(() => {
            mvae.sample(1).then((samples) => {
                this.playGeneratedMusic(samples[0]);
                this.isMusicPlaying = true;
            });
        }).catch(error => console.error('Error generating music:', error));
    }

    clearNoteTimeouts() {
        this.noteTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        this.noteTimeouts = [];
    }

    playGeneratedMusic(sequence) {
        this.stopActiveOscillators();
        this.clearNoteTimeouts();

        if (!sequence || !Array.isArray(sequence.notes) || sequence.notes.length === 0) {
            console.error("No notes in sequence or sequence is undefined.");
            console.error("Received sequence:", sequence);
            return;
        }
    
        console.log("Playing sequence with notes:", sequence.notes);
    
        let cumulativeTime = 0;
        const stepsPerSecond = sequence.tempos[0].qpm / 60 * sequence.quantizationInfo.stepsPerQuarter;
        
        sequence.notes.forEach((note, index) => {
            const noteStart = note.quantizedStartStep / stepsPerSecond * 1000; // Start time in milliseconds
            const noteEnd = note.quantizedEndStep / stepsPerSecond * 1000; // End time in milliseconds
            const noteDuration = noteEnd - noteStart; // Duration of the note in milliseconds
    
            let timeoutId = setTimeout(() => {
                let freq = midiToFreq(note.pitch);
                let osc = new p5.Oscillator('sine');
                this.activeOscillators.push(osc);
                osc.freq(freq);
                osc.amp(0.5);
                osc.start();

                setTimeout(() => {
                    osc.stop();
                    console.log(`Note ${index} stopped: pitch ${note.pitch}`);
                }, noteDuration);
            }, cumulativeTime);

            this.noteTimeouts.push(timeoutId); // Store the timeout ID
            cumulativeTime += noteDuration;
            // setTimeout(() => {
            //     console.log(`Note ${index} playing: pitch ${note.pitch}`);
            //     let freq = midiToFreq(note.pitch);
            //     let osc = new p5.Oscillator('sine');
            //     this.activeOscillators.push(osc);
            //     osc.freq(freq);
            //     osc.amp(0.5);
            //     osc.start();
    
            //     setTimeout(() => {
            //         osc.stop();
            //         console.log(`Note ${index} stopped: pitch ${note.pitch}`);
            //     }, noteDuration);
            // }, cumulativeTime);
            // cumulativeTime += noteDuration;
        });
      }

      startMagentaMusic() {
        const musicRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');
    
        let seed = {
            notes: [
                { pitch: 60, quantizedStartStep: 0, quantizedEndStep: 4 }, // C4 (twinkle)
                { pitch: 60, quantizedStartStep: 4, quantizedEndStep: 8 }, // C4 (twinkle)
                { pitch: 67, quantizedStartStep: 8, quantizedEndStep: 12 }, // G4 (little)
                { pitch: 67, quantizedStartStep: 12, quantizedEndStep: 16 }, // G4 (star)
                { pitch: 69, quantizedStartStep: 16, quantizedEndStep: 20 }, // A4 (how)
                { pitch: 69, quantizedStartStep: 20, quantizedEndStep: 24 }, // A4 (I)
                { pitch: 67, quantizedStartStep: 24, quantizedEndStep: 28 }, // G4 (wonder)
            ],
            totalQuantizedSteps: 32,
            quantizationInfo: { stepsPerQuarter: 4 }
        };
    
        // control model randomness
        const temperature = 1.5;
    
        // Generate steps based on the seed
        musicRNN.initialize().then(() => {
            musicRNN.continueSequence(seed, 200, temperature) 
                .then(continuedSequence => {
                    console.log('Continued sequence:', continuedSequence);
                    this.playGeneratedMusic(continuedSequence);
                })
                .catch(error => console.error('Error continuing sequence:', error));
            }).catch(error => console.error('Error initializing MusicRNN:', error));
     
    }    
}