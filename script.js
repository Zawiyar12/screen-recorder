const video = document.getElementById('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const downloadBtn = document.getElementById('downloadBtn');
const recordingIndicator = document.getElementById('recordingIndicator');
const recordingTime = document.getElementById('recordingTime');

let mediaRecorder;
let recordedChunks = [];
let recordingInterval;
let startTime;

startBtn.addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true
    });
    
    video.srcObject = stream;

    mediaRecorder = new MediaRecorder(stream);
    
    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        const url = URL.createObjectURL(blob);
        video.srcObject = null;
        video.src = url;
        
        downloadBtn.href = url;
        downloadBtn.download = 'recording.webm';
        downloadBtn.disabled = false;
        recordedChunks = [];
    };

    mediaRecorder.start();
    startTime = Date.now();
    recordingInterval = setInterval(updateRecordingTime, 1000);
    recordingIndicator.classList.remove('hidden');
    startBtn.disabled = true;
    stopBtn.disabled = false;
});

stopBtn.addEventListener('click', () => {
    mediaRecorder.stop();
    clearInterval(recordingInterval);
    recordingIndicator.classList.add('hidden');
    recordingTime.textContent = "00:00:00";
    startBtn.disabled = false;
    stopBtn.disabled = true;
});

function updateRecordingTime() {
    const elapsed = Date.now() - startTime;
    const seconds = Math.floor((elapsed / 1000) % 60);
    const minutes = Math.floor((elapsed / 1000 / 60) % 60);
    const hours = Math.floor((elapsed / 1000 / 3600) % 24);

    recordingTime.textContent = 
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
