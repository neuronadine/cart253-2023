class Magenta {
    constructor() {
        this.isPlaying = false; // Track if music is currently playing
        this.audioInitialized = false; // Track if music has been initialized
        this.activeOscillators = []; // Stores active oscillators
        this._noteTimeouts = []; // Stores timeouts for scheduled notes
    }

    // Initialize audio playback on-click
    initializeAudio() {
        this.audioInitialized = true;
    }

    // Initialize audio generation on-click
    startMusicGeneration() {
        if (!this.isPlaying && this.audioInitialized) {
            this.isPlaying = true;
            this.modifyAndGenerateMusic();
        }
    }

    // Stops all oscillators immediatley and logs the action for each
    stopMusicGeneration() {
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
        if (this._noteTimeouts.length === 0) {
            console.warn("Warning: noteTimeouts array is unexpectedly empty.");
        }

        console.log(`Clearing ${this._noteTimeouts.length} note timeouts`);
        this._noteTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
        this._noteTimeouts = [];
    }

    playGeneratedMusic(sequence) {
        if (!sequence || !Array.isArray(sequence.notes) || sequence.notes.length === 0) {
            console.error("No notes in sequence or sequence is undefined.");
            console.error("Received sequence:", sequence);
            return;
        }
    
        console.log("Playing sequence with notes:", sequence.notes);
    
        // Calculate the time in milliseconds for each quarter step
        const timePerStep = 60 / sequence.tempos[0].qpm * 1000 / sequence.quantizationInfo.stepsPerQuarter;
        const fixedDelay = 50;
        
        sequence.notes.forEach((note, index) => {
            // Calculate the start time and duration of each note in milliseconds
            let noteStartTime = note.quantizedStartStep * timePerStep + fixedDelay * index;
            let noteDuration = (note.quantizedEndStep - note.quantizedStartStep) * timePerStep;

            // Playes each note at the scheduled delay
            let timeoutId = setTimeout(() => {

                // Convert MIDI pitch of the note to frequency
                let freq = midiToFreq(note.pitch); 
                // Creates new oscillator to generate the sound wave
                let osc = new p5.Oscillator('sine'); 
                osc.freq(freq);
                osc.amp(0.5);
                osc.start();

                console.log(`Note started index ${index}, pitch ${note.pitch}, frequency ${freq}`);
                // tracks oscillator
                this.activeOscillators.push(osc);

                // Schedule the end of the note
                let stopTimeoutId = setTimeout(() => {
                    osc.stop();
                    console.log(`Note ${index} stopped: pitch ${note.pitch}`);
                }, noteDuration);

                this._noteTimeouts.push(stopTimeoutId);
                console.log(`Added stopTimeoutId: ${stopTimeoutId}, Total Timeouts: ${this._noteTimeouts.length}`);
            }, noteStartTime); // Note: Adjust this to control the delay between notes

            // tracks timeouts
            this._noteTimeouts.push(timeoutId);
            console.log(`Added timeoutId: ${timeoutId}, Total Timeouts: ${this._noteTimeouts.length}`);

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