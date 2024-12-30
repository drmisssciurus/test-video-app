const video = document.getElementById('video');
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');

let mediaRecorder;
let recordedChunks = [];

// Запрашиваем доступ к камере
navigator.mediaDevices
  .getUserMedia({ video: true, audio: true })
  .then((stream) => {
    video.srcObject = stream;
    video.play();

    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const videoURL = URL.createObjectURL(blob);

      // Создаем ссылку для скачивания
      const downloadLink = document.createElement('a');
      downloadLink.href = videoURL;
      downloadLink.download = 'recorded-video.webm';
      downloadLink.textContent = 'Download Video';
      document.body.appendChild(downloadLink);
    };
  })
  .catch((error) => {
    console.error('Ошибка доступа к камере:', error);
    alert('Не удалось получить доступ к камере. Проверьте настройки.');
  });

// Начало записи
startButton.addEventListener('click', () => {
  recordedChunks = [];
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
