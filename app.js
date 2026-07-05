// ==========================================
// MEME_REMIX // ENGINE CORE V1.0
// ==========================================

const state = {
    selectedBeat: 'phonk',
    isPlaying: false,
    volume: 80,
    repeatRate: 4,
    currentMemeAudio: null
};

document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ MEME_REMIX Engine Live");
    
    const searchInput = document.querySelector('input[type="text"]');
    const searchButton = document.querySelector('button');
    const playButton = document.querySelectorAll('button')[1];
    const downloadButton = document.querySelectorAll('button')[2];

    // Search Action
    if (searchButton) {
        searchButton.addEventListener('click', () => {
            const textInput = searchInput.value.trim();
            if (!textInput) return alert("Type a meme phrase first!");
            
            const statusText = document.querySelector('.truncate');
            const originText = document.querySelector('.text-xs.text-gray-500.mt-1');
            
            statusText.innerText = `Searching for "${textInput}"...`;
            originText.innerText = "Status: Querying live network...";

            // Uses an open public audio system to find spoken words instantly for $0
            fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(textInput)}`)
                .then(res => res.json())
                .then(data => {
                    if (data[0] && data[0].phonetics) {
                        const audioObj = data[0].phonetics.find(p => p.audio !== "");
                        if (audioObj && audioObj.audio) {
                            state.currentMemeAudio = new Audio(audioObj.audio);
                            statusText.innerText = `"${textInput}" Vocal Found`;
                            originText.innerText = "Origin: Public Sound Vault";
                            console.log("🔊 Clip loaded:", audioObj.audio);
                        } else {
                            statusText.innerText = "Meme clip muted.";
                            originText.innerText = "No vocal trace available.";
                        }
                    } else {
                        statusText.innerText = "No clip found.";
                        originText.innerText = "Try different keywords.";
                    }
                })
                .catch(err => {
                    console.error(err);
                    statusText.innerText = "Search failed.";
                    originText.innerText = "Network transmission error.";
                });
        });
    }

    // Play Preview Action
    if (playButton) {
        playButton.addEventListener('click', () => {
            state.isPlaying = !state.isPlaying;
            playButton.innerText = state.isPlaying ? "Stop Preview" : "Play Preview";
            
            if (state.isPlaying && state.currentMemeAudio) {
                state.currentMemeAudio.play();
            } else if (!state.isPlaying && state.currentMemeAudio) {
                state.currentMemeAudio.pause();
                state.currentMemeAudio.currentTime = 0;
            }
        });
    }

    // Download Action
    if (downloadButton) {
        downloadButton.addEventListener('click', () => {
            alert("💰 Paywall Triggered: This links to your $1 Gumroad/Crypto checkout page before exporting the final MP3!");
        });
    }
});
