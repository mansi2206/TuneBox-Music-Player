// 🎧 TuneBox – Custom Music Player

const songs = [
    { songName: "Blue Eyes", filePath: "songs/Blue Eyes Yo Yo Honey Singh.mp3", coverPath: "covers/blue eyes.jpeg" },
    { songName: "Darasal", filePath: "songs/Darasal.mp3", coverPath: "covers/Darsal.jpeg" },
    { songName: "Kabira", filePath: "songs/Kabira Yeh Jawaani Hai Deewani.mp3", coverPath: "covers/kabira.jpeg" },
    { songName: "Sahiba", filePath: "songs/Sahiba.mp3", coverPath: "covers/sahiba.jpeg" },
    { songName: "Tere Ishk Mei", filePath: "songs/Tere Ishk Mei.mp3", coverPath: "covers/tere ishq mei.jpeg" },
];

let songIndex = 0;
let audioElement = new Audio(songs[songIndex].filePath);

const playPauseBtn = document.getElementById("playPauseBtn");
const progressBar = document.getElementById("progressBar");
const songTitle = document.getElementById("songTitle");
const gif = document.getElementById("gif");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const volumeControl = document.getElementById("volumeControl");
const timeDisplay = document.getElementById("timeDisplay");
const songListContainer = document.getElementById("songList");

// Render songs dynamically
songListContainer.innerHTML = songs.map((song, i) => `
  <div class="songItem">
    <img src="${song.coverPath}" alt="${song.songName}">
    <span class="songName">${song.songName}</span>
    <span class="timestamp">
      <i id="${i}" class="far fa-play-circle songItemPlay"></i>
    </span>
  </div>
`).join('');

const songItemPlays = Array.from(document.getElementsByClassName("songItemPlay"));

function playSong() {
    audioElement.play();
    playPauseBtn.classList.replace("fa-play-circle", "fa-pause-circle");
    gif.style.opacity = 1;
}

function pauseSong() {
    audioElement.pause();
    playPauseBtn.classList.replace("fa-pause-circle", "fa-play-circle");
    gif.style.opacity = 0;
}

function loadSong(index) {
    songIndex = index;
    audioElement.src = songs[index].filePath;
    songTitle.innerText = songs[index].songName;
    audioElement.currentTime = 0;
}

playPauseBtn.addEventListener("click", () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        playSong();
    } else {
        pauseSong();
    }
});

// Time and progress bar
audioElement.addEventListener("timeupdate", () => {
    const progress = parseInt((audioElement.currentTime / audioElement.duration) * 100) || 0;
    progressBar.value = progress;

    const current = formatTime(audioElement.currentTime);
    const total = formatTime(audioElement.duration);
    timeDisplay.textContent = `${current} / ${total}`;
});

progressBar.addEventListener("change", () => {
    audioElement.currentTime = (progressBar.value * audioElement.duration) / 100;
});

function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// Volume control
volumeControl.addEventListener("input", () => {
    audioElement.volume = volumeControl.value;
});

// Song item click play
songItemPlays.forEach((btn, i) => {
    btn.addEventListener("click", () => {
        if (songIndex !== i) loadSong(i);
        playSong();
        resetAllIcons();
        btn.classList.replace("fa-play-circle", "fa-pause-circle");
    });
});

function resetAllIcons() {
    songItemPlays.forEach(btn => {
        btn.classList.replace("fa-pause-circle", "fa-play-circle");
    });
}

// Next / Prev
nextBtn.addEventListener("click", () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playSong();
});

prevBtn.addEventListener("click", () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    loadSong(songIndex);
    playSong();
});

// Auto next on end
audioElement.addEventListener("ended", () => {
    songIndex = (songIndex + 1) % songs.length;
    loadSong(songIndex);
    playSong();
});
