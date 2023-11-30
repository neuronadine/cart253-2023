function startMagentaMusic() {
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
                playGeneratedMusic(continuedSequence);
            })
            .catch(error => console.error('Error continuing sequence:', error));
        }).catch(error => console.error('Error initializing MusicRNN:', error));
 
}

function playGeneratedMusic(sequence) {
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

        setTimeout(() => {
            console.log(`Note ${index} playing: pitch ${note.pitch}`);
            let freq = midiToFreq(note.pitch);
            let osc = new p5.Oscillator('sine');
            osc.freq(freq);
            osc.amp(0.5);
            osc.start();

            setTimeout(() => {
                osc.stop();
                console.log(`Note ${index} stopped: pitch ${note.pitch}`);
            }, noteDuration);
        }, cumulativeTime);

        cumulativeTime += noteDuration;
    });
  }


  function modifyAndGenerateMusic() {
    if (!isMusicPlaying && audioInitialized) {
        const mvae = new mm.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
        mvae.initialize().then(() => {
            mvae.sample(1).then((samples) => {
                playGeneratedMusic(samples);
                isMusicPlaying = true;
            });
        }).catch(error => console.error('Error generating music:', error));
    }
}















// RETIRED
function startBlendingMusic() {
    // Logic for starting music blending (if required)
}

function stopBlendingMusic() {
    // Logic for stopping music blending
    if (currentPlayingSample) {
        currentPlayingSample.stop(); // Stop the current music sample
        isMusicPlaying = false;
    }
}
    // const mvae = new music_vae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
    // mvae.initialize().then(() => {
    //     mvae.continueSequence(seed, 20) // Number of steps to generate after the seed
    //         .then(samples => {
    //             playGeneratedMusic(samples);
    //         });
    // }).catch(error => console.error('Error with Magenta:', error));


    
    // console.log("Generated samples:", samples);
    // if (!samples || samples.length === 0 || !samples[0].notes || samples[0].notes.length === 0) return;

    // samples[0].notes.forEach(note => {
    //     let midiNote = note.pitch;
    //     let freq = midiToFreq(midiNote);
    //     let osc = new p5.Oscillator('sine');
    //     osc.freq(freq);
    //     osc.start();
    //     osc.amp(0.5);

    //     // Stop the oscillator after the note duration
    //     setTimeout(() => {
    //         osc.stop();
    //     }, note.duration * 1000); // Convert duration from seconds to milliseconds
    // });

    // if (!samples || samples.length === 0 || !samples[0].notes || samples[0].notes.length === 0) {
    //     console.error("No samples or notes generated");
    //     return;
    // }

    // console.log("Generated notes:", samples[0].notes);

    // samples[0].notes.forEach(note => {
    //     let freq = midiToFreq(note.pitch);
    //     let osc = new p5.Oscillator('sine');
    //     osc.freq(freq);
    //     osc.amp(0.5); // Set amplitude
    //     osc.start();

    //     let noteDuration = (note.quantizedEndStep - note.quantizedStartStep) * (60 / (samples[0].tempos[0].qpm * samples[0].quantizationInfo.stepsPerQuarter));
    //     setTimeout(() => {
    //         osc.stop();
    //         console.log("Note stopped");
    //     }, noteDuration * 1000); // Duration in milliseconds
    // });