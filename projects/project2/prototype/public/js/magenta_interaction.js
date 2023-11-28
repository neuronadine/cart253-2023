

function startMagentaMusic() {
    const musicRNN = new mm.MusicRNN('https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/melody_rnn');

    let seed = {
        notes: [
            { pitch: 60, quantizedStartStep: 0, quantizedEndStep: 2 }, // C4
            { pitch: 62, quantizedStartStep: 2, quantizedEndStep: 4 }, // D4
            { pitch: 64, quantizedStartStep: 4, quantizedEndStep: 6 }, // E4
            { pitch: 65, quantizedStartStep: 6, quantizedEndStep: 8 }, // F4
            { pitch: 67, quantizedStartStep: 8, quantizedEndStep: 10 }, // G4
            { pitch: 69, quantizedStartStep: 10, quantizedEndStep: 12 }, // A4
            { pitch: 71, quantizedStartStep: 12, quantizedEndStep: 14 }, // B4
            { pitch: 72, quantizedStartStep: 14, quantizedEndStep: 16 }, // C5
        ],
        totalQuantizedSteps: 16,
        quantizationInfo: { stepsPerQuarter: 4 }
    };


    musicRNN.initialize().then(() => {
        musicRNN.continueSequence(seed, 20) // Generate 20 steps based on the seed
            .then(continuedSequence => {
                console.log('Continued sequence:', continuedSequence);
                playGeneratedMusic(continuedSequence);
            })
            .catch(error => console.error('Error continuing sequence:', error));
        }).catch(error => console.error('Error initializing MusicRNN:', error));
 
}

function playGeneratedMusic(sequence) {
    if (!sequence.notes || sequence.notes.length === 0) {
        console.error("No notes in sequence");
        return;
    }

    sequence.notes.forEach(note => {
        let freq = midiToFreq(note.pitch);
        let osc = new p5.Oscillator('sine');
        osc.freq(freq);
        osc.amp(0.5);
        osc.start();

        // Calculate the duration for each note
        let duration = ((note.quantizedEndStep - note.quantizedStartStep) / sequence.quantizationInfo.stepsPerQuarter) * 60 / sequence.tempos[0].qpm;
        setTimeout(() => osc.stop(), duration * 1000);
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