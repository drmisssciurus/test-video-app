const video = document.getElementById('video');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const cameraSelect = document.getElementById('cameraSelect');
const statusDiv = document.getElementById('status');

let mediaRecorder;
let recordedChunks = [];
let currentStream;

// Получение списка камер
async function getCameras() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter((device) => device.kind === 'videoinput');
}

// Запуск камеры
async function startCamera(deviceId) {
  if (currentStream) {
    currentStream.getTracks().forEach((track) => track.stop());
  }

  const constraints = {
    video: { deviceId: deviceId ? { exact: deviceId } : undefined },
    audio: true,
  };

  currentStream = await navigator.mediaDevices.getUserMedia(constraints);
  video.srcObject = currentStream;
}

// Заполнение выбора камер
async function populateCameraOptions() {
  const cameras = await getCameras();
  cameraSelect.innerHTML = cameras
    .map(
      (camera) =>
        `<option value="${camera.deviceId}">${
          camera.label || 'Camera'
        }</option>`
    )
    .join('');
}

// Отправка видео на сервер
async function uploadVideo(blob) {
  statusDiv.textContent = 'Uploading video...';

  // Заглушка вместо реальной загрузки
  await new Promise((resolve) => setTimeout(resolve, 2000));

  statusDiv.textContent = 'Upload complete!';
}

// Инициализация камеры по умолчанию
populateCameraOptions().then(() => startCamera());

// Событие на смену камеры
cameraSelect.addEventListener('change', async () => {
  const selectedCameraId = cameraSelect.value;
  await startCamera(selectedCameraId);
});

// Начало записи
startButton.addEventListener('click', () => {
  recordedChunks = [];
  mediaRecorder = new MediaRecorder(currentStream);

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.onstop = async () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });

    // Отправка видео
    await uploadVideo(blob);
  };

  mediaRecorder.start();
  startButton.disabled = true;
  stopButton.disabled = false;
});

// Остановка записи
stopButton.addEventListener('click', () => {
  mediaRecorder.stop();
  startButton.disabled = false;
  stopButton.disabled = true;
});
