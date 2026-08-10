// ==========================================
// 1. LEKTIONEN DEFINITION
// ==========================================
const lektionenRohdaten = [
    { id: "L1", title: "asdf jklö", chars: "asdfjklö \n", words: ["als", "das", "fall", "lass", "fass", "all", "da", "ja", "saal", "fad", "flak", "ass", "aas", "dass", "kass", "lala", "kalk", "falk", "salat"] },
    { id: "L2", title: "en", chars: "en", words: ["den", "lesen", "fallen", "an", "kasse", "nase", "see", "fee", "jeden", "ende", "essen", "lassen", "fassen", "kenne", "denke", "lenke", "sende", "nass", "segel", "laden"] },
    { id: "L3", title: "ri", chars: "ri", words: ["dir", "reis", "frei", "riss", "hier", "der", "rein", "klein", "ferien", "tier", "kreis", "kleid", "lied", "die", "drei", "sinn", "irren", "rind", "kind", "finder"] },
    { id: "L4", title: "th", chars: "th", words: ["halt", "hut", "tat", "hart", "teil", "test", "hit", "heft", "steht", "hatte", "hasen", "helfen", "hinten", "hirten", "hirt", "theke", "tante", "theater", "tinte", "treten"] },
    { id: "L5", title: "cu", chars: "cu", words: ["cool", "club", "chef", "tuch", "suchen", "licht", "auch", "dich", "mich", "euch", "fluch", "tauchen", "kuchen", "lachen", "machen", "sache", "durch", "lust", "hund", "runde"] },
    { id: "L6", title: "Grossbuchstaben", chars: "ASDFJKLÖENRITHCU", words: ["Das", "Der", "Die", "Haus", "Licht", "Chef", "Tuch", "Reise", "Ferien", "Test", "Hund", "Kuchen", "Tante", "Theater", "Halt", "Sache", "Chance", "Fluch", "Kind", "Krise", "Fass", "Dass", "Alle"] },
    { id: "L7", title: "gG.:", chars: "gG.:", words: ["gut", "Tag", "gehen", "Auge", "Berg", "Frage.", "sagen", "Gasse:", "zeigen", "Tag.", "gute", "liegen", "fliegen", "Geist", "Gast", "Gras", "Sieg", "Ring:", "Gut.", "Regen"] },
    { id: "L8", title: "oOmM", chars: "oOmM", words: ["Strom", "Baum", "Raum", "Ofen", "Motor", "Auto", "oft", "Form", "Mond", "Rom", "Montag", "Morgen", "Kommen", "Oma", "Oben", "Trommel", "Ohr", "Ohne", "Sommer", "Sonne"] },
    { id: "L9", title: "bBwW", chars: "bBwW", words: ["Wasser", "Baum", "Weg", "Bild", "blau", "weiss", "Brot", "Woche", "Wald", "Bauer", "Wagen", "Wissen", "Wort", "Bauen", "Bleiben", "Boden", "Wand", "Wind", "Besser", "Wunder"] },
    { id: "L10", title: "zZ,;", chars: "zZ,;", words: ["Zeit,", "Ziel;", "kurz", "Holz", "Herz", "Zahl", "Katze", "schwarz", "Zeit", "Ziel", "Zimmer", "Zahn", "Schmerz", "Zukunft", "Zusammen", "Zwei,", "Tanzen", "Salz;", "Kurz,"] },
    { id: "L11", title: "vVpP", chars: "vVpP", words: ["Vater", "Vogel", "Platz", "Plan", "Spiel", "vier", "viel", "Punkt", "Preis", "privat", "Von", "Papier", "Pause", "Spass", "Pulver", "Panik", "Vielleicht", "Oper", "Puppe"] },
    { id: "L12", title: "üÜäÄ", chars: "üÜäÄ", words: ["über", "Tür", "für", "spät", "Bär", "Käse", "Mädchen", "fünf", "Schüler", "Zürich", "Ändern", "Üben", "Gefühl", "müde", "Rücken", "Glück", "Stück", "Tränen", "März", "Lärm"] },
    { id: "L13", title: "?qQ", chars: "?qQ", words: ["Quiz", "quer", "Quelle", "Quatsch", "wer?", "was?", "wie?", "warum?", "Gehen wir?", "Qual", "Wann?", "Quartier", "quer?", "Bequem?", "Gut?", "Kommst du?", "Wieso?"] },
    { id: "L14", title: "yYxX-/", chars: "yYxX-/", words: ["Text", "Praxis", "System", "Typ", "extra", "Taxi", "x-mal", "Ja/Nein", "a-b", "Max", "Axt", "Hobby", "Handy", "hin-", "X-mal", "Y-Achse", "Physik", "Xylofon"] },
    { id: "L15", title: "()!\"'_", chars: "()!\"'_", words: ["Hallo!", "(Text)", "Achtung!", "\"Ja\"", "'Nein'", "mach_das", "(oder)", "Super!", "Top_", "So!", "Nein!", "Stopp!", "\"Gut\"", "Pass_auf", "Hilfe!", "Komm!", "(Wieso?)", "\"Achtung\""] },
    { id: "L16", title: "0123456789", chars: "0123456789", words: ["100", "2026", "80", "50", "Jahr 2026", "12", "24", "365", "7", "10", "2", "3", "20", "1500", "99", "Teil 1", "Stufe 2", "1999", "5000", "42"] },
    { id: "L17", title: "@%#*<>=$&|\\~", chars: "@%#*<>=$&|\\~", words: ["@mail", "100%", "#1", "5<10", "10>5", "A=B", "a&b", "a|b", "5$", "Test*", "@home", "#Test", "5>3", "10<20", "x|y", "Mail@Test", "C++", "C#", "100$"] }
];

const lektionenJSON = {};
let accumulatedChars = [], accumulatedWords = [];
lektionenRohdaten.forEach(lektion => {
    accumulatedChars = accumulatedChars.concat(lektion.chars.split(''));
    accumulatedWords = accumulatedWords.concat(lektion.words);
    lektionenJSON[lektion.id] = {
        name: `${lektion.id}: ${lektion.title}`,
        buchstaben: [...new Set(accumulatedChars)],
        woerter: [...accumulatedWords]
    };
});

// ==========================================
// 2. AUTHENTIFIZIERUNG & UI STEUERUNG
// ==========================================
let currentUser = null;
let isLoginMode = true;

const mainHeader = document.getElementById('main-header');
const sideMenu = document.getElementById('side-menu');
const menuBackdrop = document.getElementById('menu-backdrop');
const menuToggleBtn = document.getElementById('menu-toggle-btn');
const closeMenuBtn = document.getElementById('close-menu-btn');
const usernameModal = document.getElementById('username-modal');

function toggleMenu() {
    sideMenu.classList.toggle('open');
    menuBackdrop.classList.toggle('show');
}
menuToggleBtn.addEventListener('click', toggleMenu);
closeMenuBtn.addEventListener('click', toggleMenu);
menuBackdrop.addEventListener('click', toggleMenu);

document.getElementById('toggle-auth-link').addEventListener('click', (e) => {
    e.preventDefault();
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').textContent = isLoginMode ? 'Login' : 'Registrieren';
    document.getElementById('auth-username').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('login-btn').style.display = isLoginMode ? 'block' : 'none';
    document.getElementById('register-btn').style.display = isLoginMode ? 'none' : 'block';
    document.getElementById('toggle-auth-link').textContent = isLoginMode ? 'Noch keinen Account? Hier registrieren.' : 'Bereits registriert? Zum Login.';
    document.getElementById('auth-error').textContent = '';
});

async function checkAuth() {
    const res = await fetch('backend.php?action=check_auth');
    const data = await res.json();
    if (data.logged_in) {
        currentUser = data.username;
        document.getElementById('menu-current-user').textContent = currentUser;
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'flex';
        mainHeader.style.display = 'flex';
    }
}
checkAuth();

document.getElementById('login-btn').addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;
    const res = await fetch('backend.php?action=login', {
        method: 'POST', body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) checkAuth();
    else document.getElementById('auth-error').textContent = data.message;
});

document.getElementById('register-btn').addEventListener('click', async () => {
    const email = document.getElementById('auth-email').value;
    const username = document.getElementById('auth-username').value;
    const password = document.getElementById('auth-password').value;
    const res = await fetch('backend.php?action=register', {
        method: 'POST', body: JSON.stringify({ email, username, password })
    });
    const data = await res.json();
    if (data.success) {
        document.getElementById('auth-error').style.color = 'var(--success)';
        document.getElementById('auth-error').textContent = "Erfolgreich registriert. Bitte jetzt einloggen.";
        document.getElementById('toggle-auth-link').click();
    } else {
        document.getElementById('auth-error').style.color = 'var(--danger)';
        document.getElementById('auth-error').textContent = data.message;
    }
});

document.getElementById('menu-logout').addEventListener('click', async (e) => {
    e.preventDefault();
    await fetch('backend.php?action=logout');
    location.reload();
});

document.getElementById('menu-change-name').addEventListener('click', (e) => {
    e.preventDefault(); toggleMenu(); usernameModal.style.display = 'flex';
});
document.getElementById('cancel-username-btn').addEventListener('click', () => {
    usernameModal.style.display = 'none'; document.getElementById('username-error').textContent = '';
});
document.getElementById('save-username-btn').addEventListener('click', async () => {
    const newName = document.getElementById('new-username-input').value;
    const res = await fetch('backend.php?action=change_username', {
        method: 'POST', body: JSON.stringify({ new_username: newName })
    });
    const data = await res.json();
    if (data.success) {
        currentUser = data.new_username;
        document.getElementById('menu-current-user').textContent = currentUser;
        usernameModal.style.display = 'none';
        document.getElementById('new-username-input').value = '';
    } else {
        document.getElementById('username-error').textContent = data.message;
    }
});


// ==========================================
// 3. SPIELLOGIK
// ==========================================
const lessonSelect = document.getElementById('lesson-select');
const lbLessonSelect = document.getElementById('lb-lesson-select'); // Für die Rangliste

for (const key in lektionenJSON) {
    const opt = document.createElement('option');
    opt.value = key; opt.textContent = lektionenJSON[key].name;
    lessonSelect.appendChild(opt);

    // Befülle auch gleich das Dropdown im Leaderboard
    const lbOpt = document.createElement('option');
    lbOpt.value = key; lbOpt.textContent = lektionenJSON[key].name;
    lbLessonSelect.appendChild(lbOpt);
}

document.getElementById('limit-time').addEventListener('change', () => {
    document.getElementById('limit-label').textContent = "Dauer (Sekunden)";
});
document.getElementById('limit-count').addEventListener('change', () => {
    document.getElementById('limit-label').textContent = "Anzahl Elemente";
});

let gameRunning = false, isPaused = false;
let score = 0, errors = 0, time = 0, itemsCompleted = 0, spawnedItemsCount = 0, totalKeystrokes = 0;
let combo = 0;
let limitType = 'time', limitValue = 60;
let currentPool = [], currentMode = '', currentLesson = '';
let timerInterval, animationFrameId, fallingItems = [], activeWordTarget = null;
let lastSpawnTime = 0, currentFallSpeed = 2;
const baseFallSpeed = 2, maxItems = 4;

let globalHighscoreSPM = 0;
let globalBeaten = false;

function showNotification(text) {
    const banner = document.getElementById('notification-banner');
    banner.textContent = text;
    banner.classList.add('show');
    setTimeout(() => banner.classList.remove('show'), 2000);
}

document.getElementById('start-btn').addEventListener('click', async () => {
    currentLesson = lessonSelect.value;
    currentMode = document.getElementById('mode-select').value;

    // Highscores holen für Rekord-Anzeige
    const res = await fetch(`backend.php?action=get_leaderboard&type=specific&lesson=${currentLesson}&mode=${currentMode}`);
    const leaderboard = await res.json();
    globalHighscoreSPM = 0; globalBeaten = false;
    if (leaderboard.length > 0) globalHighscoreSPM = leaderboard[0].spm;

    if (currentMode === 'mehrere') {
        currentPool = lektionenJSON[currentLesson]['woerter'];
        currentFallSpeed = baseFallSpeed * 0.25;
    } else {
        currentPool = lektionenJSON[currentLesson][currentMode];
        currentFallSpeed = baseFallSpeed;
    }

    limitType = document.querySelector('input[name="limit-type"]:checked').value;
    limitValue = parseInt(document.getElementById('limit-value').value) || 60;

    score = 0; errors = 0; time = 0; itemsCompleted = 0; spawnedItemsCount = 0; totalKeystrokes = 0; combo = 0;
    fallingItems = []; activeWordTarget = null; isPaused = false;
    document.getElementById('game-container').innerHTML = '';

    updateUI();
    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('game-ui').style.display = 'flex';
    mainHeader.style.display = 'none';

    gameRunning = true;
    timerInterval = setInterval(() => {
        if (!isPaused) { time++; updateUI(); checkEndCondition(); }
    }, 1000);
    lastSpawnTime = performance.now();
    gameLoop(performance.now());
});

document.getElementById('pause-btn').addEventListener('click', togglePauseGame);
document.getElementById('resume-btn').addEventListener('click', togglePauseGame);
function togglePauseGame() {
    if (!gameRunning) return;
    isPaused = !isPaused;
    if (isPaused) {
        cancelAnimationFrame(animationFrameId);
        document.getElementById('pause-screen').style.display = 'flex';
    } else {
        document.getElementById('pause-screen').style.display = 'none';
        lastSpawnTime = performance.now();
        gameLoop(performance.now());
    }
}

document.getElementById('abort-btn').addEventListener('click', () => {
    gameRunning = false; clearInterval(timerInterval); cancelAnimationFrame(animationFrameId);
    document.getElementById('game-container').innerHTML = '';
    fallingItems = []; activeWordTarget = null;

    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    mainHeader.style.display = 'flex';
});

async function endGame() {
    gameRunning = false; clearInterval(timerInterval); cancelAnimationFrame(animationFrameId);
    document.getElementById('game-container').innerHTML = '';
    fallingItems = []; activeWordTarget = null;

    const apm = time > 0 ? Math.round((totalKeystrokes / time) * 60) : 0;
    const spm = time > 0 ? Math.round((score / time) * 60) : 0;

    await fetch('backend.php?action=save_score', {
        method: 'POST',
        body: JSON.stringify({ lesson: currentLesson, mode: currentMode, score, apm, spm, errors, time })
    });

    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'flex';
    document.getElementById('final-score').textContent = `Punkte absolut: ${score}`;
    document.getElementById('final-spm').textContent = `Punkte pro Minute (SPM): ${spm}`;
    document.getElementById('final-apm').textContent = `Anschläge pro Minute: ${apm}`;
    document.getElementById('final-errors').textContent = `Fehler: ${errors}`;
    document.getElementById('final-time').textContent = `Dauer: ${time}s`;
}

document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
    mainHeader.style.display = 'flex';
});

function updateUI() {
    document.getElementById('score-display').textContent = `Punkte: ${score}`;
    document.getElementById('error-display').textContent = `Fehler: ${errors}`;
    document.getElementById('time-display').textContent = `Zeit: ${time}s`;

    const comboEl = document.getElementById('combo-display');
    comboEl.textContent = `Combo: ${combo}`;
    if(combo > 0 && combo % 10 === 0) {
        comboEl.classList.add('combo-pop');
        setTimeout(() => comboEl.classList.remove('combo-pop'), 150);
    }
}

function triggerError() {
    errors++; combo = 0; updateUI();
    const flash = document.getElementById('flash-overlay');
    flash.classList.add('flash');
    setTimeout(() => flash.classList.remove('flash'), 150);
}

function checkEndCondition() {
    if (limitType === 'time' && time >= limitValue) endGame();
    else if (limitType === 'count' && itemsCompleted >= limitValue) endGame();
}

function getDisplayChar(c) {
    if (c === ' ') return '&nbsp;';
    if (c === '\n') return '↵';
    return c;
}

function spawnItem() {
    if (limitType === 'count' && spawnedItemsCount >= limitValue) return;

    let text = "";
    if (currentMode === 'mehrere') {
        const wordCount = Math.floor(Math.random() * 2) + 2;
        const words = [];
        for(let i = 0; i < wordCount; i++) words.push(currentPool[Math.floor(Math.random() * currentPool.length)]);
        text = words.join(' ') + '\n';
    } else text = currentPool[Math.floor(Math.random() * currentPool.length)];

    const el = document.createElement('div');
    el.className = 'falling-item';
    const maxRight = currentMode === 'mehrere' ? 40 : 70;
    el.style.left = `${10 + Math.random() * (maxRight - 10)}%`;
    el.style.top = `-50px`;

    if (currentMode === 'buchstaben') {
        let displayChar = text;
        if (text === ' ') displayChar = 'SPACE';
        if (text === '\n') displayChar = '↵';
        el.innerHTML = `<span class="untyped-part">${displayChar}</span>`;
    } else {
        let untypedStr = text.split('').map(getDisplayChar).join('');
        el.innerHTML = `<span class="typed-part"></span><span class="untyped-part">${untypedStr}</span>`;
    }

    document.getElementById('game-container').appendChild(el);
    fallingItems.push({ text: text, element: el, y: -50, typed: 0 });
    spawnedItemsCount++;
}

function updateWordDisplay(item) {
    let typedStr = item.text.substring(0, item.typed).split('').map(getDisplayChar).join('');
    let untypedStr = item.text.substring(item.typed).split('').map(getDisplayChar).join('');
    item.element.innerHTML = `<span class="typed-part">${typedStr}</span><span class="untyped-part">${untypedStr}</span>`;
}

function gameLoop(timestamp) {
    if (!gameRunning || isPaused) return;
    const spawnInterval = currentMode === 'mehrere' ? 2500 : 1200;

    if (fallingItems.length < maxItems && timestamp - lastSpawnTime > spawnInterval) {
        spawnItem(); lastSpawnTime = timestamp;
    }

    const windowHeight = window.innerHeight;
    for (let i = fallingItems.length - 1; i >= 0; i--) {
        const item = fallingItems[i];
        item.y += currentFallSpeed;
        item.element.style.top = `${item.y}px`;

        if (item.y > windowHeight) {
            triggerError(); item.element.remove(); fallingItems.splice(i, 1);
            if (activeWordTarget === item) activeWordTarget = null;
            spawnItem();
        }
    }
    animationFrameId = requestAnimationFrame(gameLoop);
}

function checkLiveRecords() {
    const currentSPM = time > 0 ? Math.round((score / time) * 60) : 0;

    if (globalHighscoreSPM > 0 && currentSPM > globalHighscoreSPM && !globalBeaten && time > 10) {
        showNotification("Weltrekord-Tempo (SPM)!");
        globalBeaten = true;
    }
    if (combo > 0 && combo % 10 === 0) {
        showNotification(`${combo}er Combo! Weiter so!`);
        score += Math.floor(combo / 10);
    }
}

window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'Escape') { togglePauseGame(); return; }
    if (isPaused) return;

    const ignoredKeys = ["Shift", "Control", "Alt", "Meta", "Tab", "CapsLock", "Backspace", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
    if (ignoredKeys.includes(e.key)) return;

    let key = e.key === 'Enter' ? '\n' : e.key;
    if (key.length !== 1) return;
    totalKeystrokes++;

    let matched = false;

    if (currentMode === 'buchstaben') {
        let targetIndex = -1, maxBot = -1;
        for (let i = 0; i < fallingItems.length; i++) {
            if (fallingItems[i].text === key && fallingItems[i].y > maxBot) {
                maxBot = fallingItems[i].y; targetIndex = i;
            }
        }
        if (targetIndex !== -1) {
            fallingItems[targetIndex].element.remove(); fallingItems.splice(targetIndex, 1);
            score++; itemsCompleted++; combo++; updateUI(); matched = true; spawnItem(); checkEndCondition();
        }
    } else {
        if (!activeWordTarget) {
            let targetIndex = -1, maxBot = -1;
            for (let i = 0; i < fallingItems.length; i++) {
                if (fallingItems[i].text.startsWith(key) && fallingItems[i].y > maxBot) {
                    maxBot = fallingItems[i].y; targetIndex = i;
                }
            }
            if (targetIndex !== -1) {
                activeWordTarget = fallingItems[targetIndex]; activeWordTarget.typed = 1;
                updateWordDisplay(activeWordTarget); matched = true; combo++;
            }
        } else {
            if (key === activeWordTarget.text[activeWordTarget.typed]) {
                activeWordTarget.typed++; updateWordDisplay(activeWordTarget); matched = true; combo++;
                if (activeWordTarget.typed === activeWordTarget.text.length) {
                    activeWordTarget.element.remove();
                    fallingItems = fallingItems.filter(item => item !== activeWordTarget);
                    activeWordTarget = null;
                    score += 5;
                    itemsCompleted++; updateUI(); spawnItem(); checkEndCondition();
                }
            } else {
                activeWordTarget.typed = 0; updateWordDisplay(activeWordTarget); activeWordTarget = null;
            }
        }
    }

    if (!matched) triggerError();
    else checkLiveRecords();
});

// ==========================================
// 4. RANGLISTEN VIEWS (Dynamisch)
// ==========================================

async function loadLeaderboard() {
    const type = document.querySelector('input[name="lb-type"]:checked').value;
    const l = document.getElementById('lb-lesson-select').value;
    const m = document.getElementById('lb-mode-select').value;

    let url = `backend.php?action=get_leaderboard&type=${type}`;
    if (type === 'specific') {
        url += `&lesson=${l}&mode=${m}`;
        document.getElementById('lb-specific-filters').style.display = 'flex';
    } else {
        document.getElementById('lb-specific-filters').style.display = 'none';
    }

    const res = await fetch(url);
    const data = await res.json();

    const thead = document.querySelector('#leaderboard-table thead');
    const tbody = document.querySelector('#leaderboard-table tbody');

    if (type === 'overall') {
        thead.innerHTML = '<tr><th>Rang</th><th>Spieler</th><th>Lektion</th><th>Modus</th><th>SPM</th><th>APM</th></tr>';
    } else {
        thead.innerHTML = '<tr><th>Rang</th><th>Spieler</th><th>SPM</th><th>APM</th></tr>';
    }

    tbody.innerHTML = '';
    data.forEach((row, index) => {
        if (type === 'overall') {
            let modeText = row.mode === 'buchstaben' ? 'Buchstaben' : (row.mode === 'woerter' ? 'Wörter' : 'Sätze');
            tbody.innerHTML += `<tr><td>${index + 1}</td><td>${row.username}</td><td>${row.lesson}</td><td>${modeText}</td><td>${row.spm}</td><td>${row.apm}</td></tr>`;
        } else {
            tbody.innerHTML += `<tr><td>${index + 1}</td><td>${row.username}</td><td>${row.spm}</td><td>${row.apm}</td></tr>`;
        }
    });
}

// Event Listeners für die Ranglisten-Filter
document.querySelectorAll('input[name="lb-type"]').forEach(radio => {
    radio.addEventListener('change', loadLeaderboard);
});
document.getElementById('lb-lesson-select').addEventListener('change', loadLeaderboard);
document.getElementById('lb-mode-select').addEventListener('change', loadLeaderboard);

document.getElementById('menu-leaderboard').addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();

    // Setze die Filter im Hintergrund schon mal auf die aktuell gewählten Werte
    document.getElementById('lb-lesson-select').value = lessonSelect.value;
    document.getElementById('lb-mode-select').value = document.getElementById('mode-select').value;

    // NEU: Standardmässig Overall anwählen
    document.getElementById('lb-type-overall').checked = true;

    loadLeaderboard();

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('leaderboard-screen').style.display = 'flex';
});

document.getElementById('close-leaderboard-btn').addEventListener('click', () => {
    document.getElementById('leaderboard-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
});
