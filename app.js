// ==========================================
// MEME_REMIX // ENGINE CORE V1.0
// ==========================================

// 1. App State Tracker
const state = {
    selectedBeat: 'phonk',
    isPlaying: false,
    volume: 80,
    repeatRate: 4,
    currentMemeAudio: null,
    backgroundBeatAudio: null
};

// 2. Select DOM Elements from our Bento Grid Layout
const searchInput = document.querySelector('input[type="text"]');
const searchButton = document.querySelector('button:nth-of-type(1)');
const playButton = document.querySelectorAll('button')[2]; // Play Preview Button
const downloadButton = document.querySelectorAll('button')[3]; // Download Button

// 3. Connect Event Listeners to UI Controls
document.addEventListener('DOMContentLoaded', () => {
    console.log("⚡ MEME_REMIX Engine Initialized: Ready for audio mapping.");
    
    // Search Action
    searchButton.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });

    // Playback Action
    playButton.addEventListener('click', togglePlayback);

    // Paid Download Action
    downloadButton.addEventListener('click', triggerPaywall);
});

// 4. Function Logic Blocks
function handleSearch() {
    const textInput = searchInput.value.trim();
    if (!textInput) return alert("Type a meme phrase first!");
    
    console.log(`🔍 Routing text query: "${textInput}" to database queue...`);
    
    // For now, update the UI layout to show we are analyzing the search query
    const statusText = document.querySelector('.truncate');
    const originText = document.querySelector('.text-xs.text-gray-500.mt-1');
    
    statusText.innerText = `Searching for "${textInput}"...`;
    originText.innerText = "Origin: Locating match data...";
}

function togglePlayback() {
    state.isPlaying = !state.isPlaying;
    if (state.isPlaying) {
        playButton.innerText = "Stop Preview";
        playButton.classList.add('bg-[rgba(0,240,255,0.2)]');
        console.log(`🎵 Starting playback loop using layer: [${state.selectedBeat}]`);
    } else {
        playButton.innerText = "Play Preview";
        playButton.classList.remove('bg-[rgba(0,240,255,0.2)]');
        console.log("⏹️ Audio preview stopped safely.");
    }
}

function triggerPaywall() {
    console.log("💰 Order route requested. Processing transaction layer.");
    alert("🚀 Checkout Simulated: This triggers your $1 payment link or crypto checkout before packing the final high-quality MP3 mastercut file!");
}
