function modifyAndGenerateMusic() {
    if (!isMusicPlaying) {
        const mvae = new music_vae.MusicVAE('https://storage.googleapis.com/magentadata/js/checkpoints/music_vae/mel_2bar_small');
        mvae.initialize().then(() => {
            mvae.sample(1).then((samples) => {
                playGeneratedMusic(samples);
                isMusicPlaying = true;
            });
        }).catch(error => console.error('Error generating music:', error));
    }
}

function playGeneratedMusic(samples) {
    if (currentPlayingSample) {
        // Logic to blend with new sample instead of stopping (if required)
        // Example: currentPlayingSample.blend(samples[0]);
    } else {
        const player = new core.Player();
        currentPlayingSample = samples[0];
        player.start(currentPlayingSample);
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