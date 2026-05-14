function iniciarSensores() {
    const video = document.getElementById('camera');
    navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
    }).catch(e => console.log("Câmera bloqueada"));
}

function moveTab(i) {
    document.getElementById('mainContainer').style.transform = `translateX(-${i * 20}%)`;
    document.querySelectorAll('.tabs div').forEach((t, idx) => t.classList.toggle('active', idx === i));
}

// Animação de Pulsar Global
document.addEventListener('mousedown', (e) => {
    const el = e.target.closest('.box, .big-panel, .key, .profile-card');
    if(el) el.classList.add('pulsar');
});
document.addEventListener('mouseup', () => {
    document.querySelectorAll('.pulsar').forEach(el => el.classList.remove('pulsar'));
});

// Relógio
setInterval(() => {
    const now = new Date();
    const clock = document.getElementById('sys-clock');
    if(clock) clock.innerText = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
}, 1000);