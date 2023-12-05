class Magenta {
    constructor() {
        this.isPlaying = false; // Track if music is currently playing
        this.audioInitialized = false; // Track if music has been initialized
        this.activeOscillators = []; // Stores active oscillators
        this.noteTimeouts = []; // Stores timeouts for scheduled notes
    }

    // Initialize audio playback on-click
    initializeAudio() {
        this.audioInitialized = true;
    }

    // Initialize audio generation on-click
    startMusicGeneration() {
        if (!this.isPlaying && this.audioInitialized) {
            this.modifyAndGenerateMusic();
        }
    }

    // Stops all oscillators immediatley and logs the action for each
    stopMusicGeneration(immediate = false) {
        console.log("Stopping Music Generation");
        this.activeOscillators.forEach(osc => {
            osc.stop();
            console.log("Immediately stopping oscillator");
        });

        this.activeOscillators = [];
        this.clearNoteTimeouts();
        this.isPlaying = false;
    }

    // Generate and play one music squence (~120 notes) with MusicVAE
    modifyAndGenerateMusic() {
        // Initialize a new MusicVAE instance
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
    
        // let cumulativeTime = 0;
        const stepsPerSecond = sequence.tempos[0].qpm / 60 * sequence.quantizationInfo.stepsPerQuarter;
        
        sequence.notes.forEach((note, index) => {

            let noteDuration = ((note.quantizedEndStep - note.quantizedStartStep) / sequence.quantizationInfo.stepsPerQuarter) * 60 / sequence.tempos[0].qpm * 1000;

            let timeoutId = setTimeout(() => {
                let freq = midiToFreq(note.pitch);
                let osc = new p5.Oscillator('sine');
                osc.freq(freq);
                osc.amp(0.5);
                osc.start();

                this.activeOscillators.push(osc);

                let stopTimeoutId = setTimeout(() => {
                    osc.stop();
                    console.log(`Note ${index} stopped: pitch ${note.pitch}`);
                }, noteDuration);

                this.noteTimeouts.push(stopTimeoutId);
            }, noteDuration * index); // Note: Adjust this to control the delay between notes

            this.noteTimeouts.push(timeoutId);

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