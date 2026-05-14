let savedProfiles = JSON.parse(localStorage.getItem('xbox_profiles')) || [];
let tempProfile = { name: "", pic: "", gender: "" };
let isEditMode = false;

const landscapePics = [
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=200",
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200",
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=200",
    "https://images.unsplash.com/photo-143308656680a-515bb16e458c?w=200",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200",
    "https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=200"
];

function renderProfiles() {
    const list = document.getElementById('profiles-list');
    let html = savedProfiles.map((p, i) => `
        <div class="profile-card" id="card-${i}">
            ${isEditMode ? `<div class="delete-btn" onclick="deleteProfile(event, ${i})">X</div>` : ''}
            <div class="avatar-sphere" onclick="${isEditMode ? `openEditName(${i})` : `processLogin(${i})`}">
                <img src="${p.pic}">
            </div>
            <div class="gamertag">${p.name}</div>
        </div>
    `).join('');
    
    if (!isEditMode) {
        html += `
            <div class="profile-card" onclick="openKB()">
                <div class="avatar-sphere" style="display:flex; align-items:center; justify-content:center; font-size:50px; color:#ccc;">+</div>
                <div class="gamertag">Criar Perfil</div>
            </div>
            <div class="profile-card" onclick="alert('Serviço Xbox Live indisponível.')">
                <div class="avatar-sphere" style="display:flex; align-items:center; justify-content:center; font-size:40px; color:#ccc;">☁</div>
                <div class="gamertag">Baixar Perfil</div>
            </div>
            <div class="profile-card" onclick="toggleEditMode(true)">
                <div class="avatar-sphere" style="display:flex; align-items:center; justify-content:center; font-size:40px; color:#ccc;">⚙</div>
                <div class="gamertag">Editar</div>
            </div>`;
    } else {
        html += `
            <div class="profile-card" onclick="toggleEditMode(false)">
                <div class="avatar-sphere" style="display:flex; align-items:center; justify-content:center; font-size:40px; color:#ccc;">⬅</div>
                <div class="gamertag">Voltar</div>
            </div>`;
    }
    list.innerHTML = html;
}

function toggleEditMode(val) { isEditMode = val; renderProfiles(); }

function deleteProfile(e, index) {
    e.stopPropagation();
    if(confirm("Excluir este perfil?")) {
        savedProfiles.splice(index, 1);
        localStorage.setItem('xbox_profiles', JSON.stringify(savedProfiles));
        renderProfiles();
    }
}

// --- TECLADO E ETAPAS ---
function openKB() { 
    tempProfile = { name: "", pic: "", gender: "" }; 
    document.getElementById('kb-screen').style.display = 'flex'; 
    stepName(false); 
}

function openEditName(index) {
    tempProfile = { ...savedProfiles[index] };
    document.getElementById('kb-screen').style.display = 'flex';
    stepName(true, index);
}

function stepName(isEditing, index = null) {
    const grid = document.getElementById('kb-keys');
    const inputDiv = document.getElementById('kb-input');
    grid.innerHTML = "";
    inputDiv.innerText = tempProfile.name || "Digite o nome...";

    "1234567890QWERTYUIOPASDFGHJKLZXCVBNM".split("").forEach(k => {
        const b = document.createElement('div'); b.className = 'key'; b.innerText = k;
        b.onclick = () => {
            if(inputDiv.innerText.includes("...")) inputDiv.innerText = "";
            tempProfile.name += k;
            inputDiv.innerText = tempProfile.name;
        };
        grid.appendChild(b);
    });

    addKey("APAGAR", () => { tempProfile.name = tempProfile.name.slice(0,-1); inputDiv.innerText = tempProfile.name || "Digite o nome..."; }, "#555", 2);
    addKey("CANCELAR", () => document.getElementById('kb-screen').style.display = 'none', "#aa0000", 2);
    addKey("OK", () => {
        const jaExiste = savedProfiles.some((p, i) => p.name.toLowerCase() === tempProfile.name.trim().toLowerCase() && i !== index);
        if(!tempProfile.name.trim()) return alert("Nome vazio!");
        if(jaExiste) return alert("Nome já existe!");
        
        if(isEditing) {
            savedProfiles[index].name = tempProfile.name;
            localStorage.setItem('xbox_profiles', JSON.stringify(savedProfiles));
            document.getElementById('kb-screen').style.display = 'none';
            renderProfiles();
        } else {
            stepGender();
        }
    }, "#00aa55", 2);
}

function addKey(text, action, bg, span) {
    const b = document.createElement('div'); b.className = 'key'; b.innerText = text;
    b.style.background = bg; b.style.gridColumn = `span ${span}`;
    b.onclick = action; document.getElementById('kb-keys').appendChild(b);
}

function stepGender() {
    const grid = document.getElementById('kb-keys');
    document.getElementById('kb-input').innerText = "Escolha o Gênero";
    grid.innerHTML = "";
    ["MASCULINO", "FEMININO"].forEach(g => {
        const b = document.createElement('div'); b.className = 'key'; b.style.gridColumn = "span 5"; b.style.height = "100px"; b.style.lineHeight = "100px"; b.innerText = g;
        b.onclick = () => { tempProfile.gender = g; stepIcons(); };
        grid.appendChild(b);
    });
}

function stepIcons() {
    const grid = document.getElementById('kb-keys');
    document.getElementById('kb-input').innerText = "Escolha sua imagem";
    grid.innerHTML = "";
    landscapePics.forEach(url => {
        const img = document.createElement('div'); img.className = 'key'; img.style.padding = "0";
        img.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover;">`;
        img.onclick = () => { tempProfile.pic = url; finish(); };
        grid.appendChild(img);
    });
}

function finish() {
    savedProfiles.push({...tempProfile});
    localStorage.setItem('xbox_profiles', JSON.stringify(savedProfiles));
    document.getElementById('kb-screen').style.display = 'none';
    renderProfiles();
}

// --- LOGIN ---
function processLogin(index) {
    const card = document.getElementById(`card-${index}`);
    card.classList.add('login-selected');
    document.getElementById('login-title').classList.add('fade-out');
    document.querySelectorAll('.profile-card').forEach((c, i) => { if(i !== index) c.classList.add('fade-out'); });

    setTimeout(() => {
        document.getElementById('login-wrapper').classList.add('fade-out');
        setTimeout(() => {
            document.getElementById('login-wrapper').style.display = 'none';
            document.getElementById('main-dashboard').style.display = 'flex';
            setInterval(updateClock, 1000);
        }, 800);
    }, 2000);
}

function updateClock() {
    const now = new Date();
    document.getElementById('sys-clock').innerText = now.getHours().toString().padStart(2, '0') + ":" + now.getMinutes().toString().padStart(2, '0');
}

function moveTab(index) {
    const container = document.getElementById('mainContainer');
    const tabs = document.querySelectorAll('.tabs div');
    container.style.transform = `translateX(-${index * 20}%)`;
    tabs.forEach((tab, i) => tab.classList.toggle('active', i === index));
}

renderProfiles();