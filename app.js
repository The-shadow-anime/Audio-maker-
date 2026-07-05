// ==========================================
// MEME_REMIX // SUITE ENGINE V1.4
// ==========================================

const state = {
    selectedBeat: 'phonk',
    isPlaying: false,
    volume: 80,
    repeatRate: 4,
    audioSequence: [], // Stores the chained phrase audio clips
    beatAudio: null    // Stores the looping instrumental background track
};

// High-quality public instrumental loops
const BEAT_TRACKS = {
    phonk: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    trap: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    lofi: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ MEME_REMIX Engine Activated");
    
    const searchInput = document.querySelector('input[type="text"]');
    
    // Dynamically target buttons based on text content to avoid structural errors
    const buttons = Array.from(document.querySelectorAll('button'));
    const searchButton = buttons.find(b => b.innerText.includes('SEARCH'));
    const playButton = buttons.find(b => b.innerText.toLowerCase().includes('preview'));
    const downloadButton = buttons.find(b => b.innerText.toLowerCase().includes('download') || b.innerText.toLowerCase().includes('mastercut'));

    // Handle Instrumental Selection Layout Visuals
    const beatButtons = {
        phonk: buttons.find(b => b.innerText.toLowerCase().includes('phonk')),
        trap: buttons.find(b => b.innerText.toLowerCase().includes('heavy') || b.innerText.toLowerCase().includes('trap')),
        lofi: buttons.find(b => b.innerText.toLowerCase().includes('lo-fi') || b.innerText.toLowerCase().includes('vibe'))
    };

    Object.keys(beatButtons).forEach(style => {
        if (beatButtons[style]) {
            beatButtons[style].addEventListener('click', () => {
                state.selectedBeat = style;
                console.log(`🎵 Selected background style: ${style}`);
                
                // Update track if playing live
                if (state.isPlaying) {
                    playSongEngine();
                }
            });
        }
    });

    // 1. Full Phrase Compilation Song Engine
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            const textInput = searchInput.value.trim();
            if (!textInput) return alert("Type your song lyric phrase first!");
            
            const statusText = document.querySelector('.truncate');
            const originText = document.querySelector('.text-xs.text-gray-500.mt-1');
            
            statusText.innerText = `Compiling track arrangement...`;
            originText.innerText = "Status: Fetching audio elements...";
            
            // Clean input and split phrase into individual song words
            const words = textInput.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
            state.audioSequence = []; // Reset old song data

            try {
                // Fetch live phonetic sounds concurrently for the entire song phrase
                const fetchPromises = words.map(word => 
                    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
                        .then(res => res.ok ? res.json() : null)
                        .catch(() => null)
                );

                const results = await Promise.all(fetchPromises);

                results.forEach((data, index) => {
                    if (data && data[0] && data[0].phonetics) {
                        const audioObj = data[0].phonetics.find(p => p.audio !== "");
                        if (audioObj && audioObj.audio) {
                            state.audioSequence.push(audioObj.audio);
                        }
                    }
                });

                if (state.audioSequence.length > 0) {
                    statusText.innerText = `"${textInput}" Song Arrangement Ready`;
                    originText.innerText = `Origin: Compiled ${state.audioSequence.length} vocal tracks seamlessly.`;
                    console.log("🎼 Compiled Sequence:", state.audioSequence);
                } else {
                    statusText.innerText = "Compilation failed.";
                    originText.innerText = "Could not verify vocal assets. Try simplified terms.";
                }

            } catch (err) {
                console.error(err);
                statusText.innerText = "Network Error.";
                originText.innerText = "Failed structural sync.";
            }
        });
    }

    // 2. Playback Sequence Control Loop
    function playSongEngine() {
        // Stop current audio instances
        if (state.beatAudio) {
            state.beatAudio.pause();
            state.beatAudio = null;
        }

        if (!state.isPlaying) return;

        // Initialize background loop
        state.beatAudio = new Audio(BEAT_TRACKS[state.selectedBeat]);
        state.beatAudio.loop = true;
        state.beatAudio.volume = state.volume / 100;
        state.beatAudio.play();

        // Sequential vocal track processor
        let vocalIndex = 0;
        function playNextVocal() {
            if (!state.isPlaying || state.audioSequence.length === 0) return;
            
            const vocalAudio = new Audio(state.audioSequence[vocalIndex]);
            vocalAudio.volume = 1.0; 
            vocalAudio.play();

            vocalIndex = (vocalIndex + 1) % state.audioSequence.length;

            // Loops vocals based on the slider state
            vocalAudio.onended = () => {
                const delay = (60 / 128) * state.repeatRate * 1000; 
                setTimeout(playNextVocal, delay);
            };
        }

        // Initialize vocal sequence line
        playNextVocal();
    }

    if (playButton) {
        playButton.addEventListener('click', () => {
            state.isPlaying = !state.isPlaying;
            playButton.innerText = state.isPlaying ? "STOP PREVIEW" : "PLAY PREVIEW";
            playSongEngine();
        });
    }

    // 3. Slider Actions: Look for sliders by their structural position order
    const sliders = document.querySelectorAll('input[type="range"]');
    
    // First slider = Volume Control
    if (sliders[0]) {
        sliders[0].addEventListener('input', (e) => {
            const val = e.target.value;
            state.volume = parseInt(val);
            
            // Look for the volume indicator text next to it
            const volLabel = sliders[0].parentElement.querySelector('span:last-child') || sliders[0].parentElement.parentElement.querySelector('.text-cyan-400');
            if (volLabel) volLabel.innerText = `${val}%`;
            
            if (state.beatAudio) {
                state.beatAudio.volume = state.volume / 100;
            }
        });
    }

    // Second slider = Meme Repeat Rate Control
    if (sliders[1]) {
        sliders[1].addEventListener('input', (e) => {
            const val = e.target.value;
            state.repeatRate = parseInt(val);
            
            // Find the display text container belonging to this specific slider group
            const rateLabel = sliders[1].parentElement.querySelector('span:last-child') || sliders[1].parentElement.parentElement.querySelector('.text-cyan-400');
            if (rateLabel) {
                rateLabel.innerText = `EVERY ${val} BEATS`;
            }
            console.log(`⏱️ Repeat rate updated to: every ${val} beats`);
        });
    }

    // 4. Monetization Gateway Trigger
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            alert("💰 Paywall Triggered: This links to your $1 Gumroad/Crypto checkout page before exporting the final MP3 compilation!");
        });
    }
});
