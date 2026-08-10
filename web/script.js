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
// 2. AUTHENTIFIZIERUNG & BACKEND
// ==========================================
let currentUser = null;

async function checkAuth() {
    const res = await fetch('backend.php?action=check_auth');
    const data = await res.json();
    if (data.logged_in) {
        currentUser = data.username;
        document.getElementById('current-user').textContent = currentUser;
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('start-screen').style.display = 'flex';
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
        document.getElementById('auth-error').style.color = 'green';
        document.getElementById('auth-error').textContent = "Erfolgreich registriert. Bitte einloggen.";
    } else document.getElementById('auth-error').textContent = data.message;
});

document.getElementById('logout-link').addEventListener('click', async () => {
    await fetch('backend.php?action=logout');
    location.reload();
});

// ==========================================
// 3. SPIELLOGIK
// ==========================================
const lessonSelect = document.getElementById('lesson-select');
for (const key in lektionenJSON) {
    const opt = document.createElement('option');
    opt.value = key; opt.textContent = lektionenJSON[key].name;
    lessonSelect.appendChild(opt);
}

document.getElementById('limit-time').addEventListener('change', () => document.getElementById('limit-label').innerHTML = "<strong>Dauer (Sekunden):</strong>");
document.getElementById('limit-count').addEventListener('change', () => document.getElementById('limit-label').innerHTML = "<strong>Anzahl Elemente:</strong>");

let gameRunning = false, isPaused = false;
let score = 0, errors = 0, time = 0, itemsCompleted = 0, spawnedItemsCount = 0, totalKeystrokes = 0;
let combo = 0;
let limitType = 'time', limitValue = 60;
let currentPool = [], currentMode = '', currentLesson = '';
let timerInterval, animationFrameId, fallingItems = [], activeWordTarget = null;
let lastSpawnTime = 0, currentFallSpeed = 2;
const baseFallSpeed = 2, maxItems = 4;

// Highscore Tracking
let personalHighscore = 0;
let globalHighscore = 0;
let personalBeaten = false;
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

    // Lade Highscores für diesen Modus
    const res = await fetch(`backend.php?action=get_leaderboard&lesson=${currentLesson}&mode=${currentMode}`);
    const leaderboard = await res.json();
    personalHighscore = 0; globalHighscore = 0;
    personalBeaten = false; globalBeaten = false;

    if (leaderboard.length > 0) {
        globalHighscore = leaderboard[0].score;
        const myScore = leaderboard.find(s => s.username === currentUser);
        if (myScore) personalHighscore = myScore.score;
    }

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

    gameRunning = true;
    timerInterval = setInterval(() => {
        if (!isPaused) { time++; updateUI(); checkEndCondition(); }
    }, 1000);
    lastSpawnTime = performance.now();
    gameLoop(performance.now());
});

document.getElementById('pause-btn').addEventListener('click', togglePause);
document.getElementById('resume-btn').addEventListener('click', togglePause);
function togglePause() {
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
    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
});

async function endGame() {
    gameRunning = false; clearInterval(timerInterval); cancelAnimationFrame(animationFrameId);
    const apm = time > 0 ? Math.round((totalKeystrokes / time) * 60) : 0;

    // Resultat speichern
    await fetch('backend.php?action=save_score', {
        method: 'POST',
        body: JSON.stringify({ lesson: currentLesson, mode: currentMode, score: score, apm: apm, errors: errors })
    });

    document.getElementById('game-ui').style.display = 'none';
    document.getElementById('game-over-screen').style.display = 'flex';
    document.getElementById('final-score').textContent = `Punkte: ${score}`;
    document.getElementById('final-errors').textContent = `Fehler: ${errors}`;
    document.getElementById('final-time').textContent = `Zeit: ${time}s`;
    document.getElementById('final-apm').textContent = `Anschläge pro Minute: ${apm}`;
}

document.getElementById('restart-btn').addEventListener('click', () => {
    document.getElementById('game-over-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
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
    errors++;
    combo = 0; // Combo bricht ab
    updateUI();
    document.getElementById('flash-overlay').classList.add('flash');
    setTimeout(() => document.getElementById('flash-overlay').classList.remove('flash'), 150);
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

function checkHighscores() {
    if (personalHighscore > 0 && score > personalHighscore && !personalBeaten) {
        showNotification("Persönlicher Rekord geknackt!");
        personalBeaten = true;
    }
    if (globalHighscore > 0 && score > globalHighscore && !globalBeaten) {
        showNotification("Weltrekord geknackt!");
        globalBeaten = true;
    }

    // Combo Benachrichtigungen
    if (combo > 0 && combo % 10 === 0) {
        showNotification(`${combo}er Combo! Weiter so!`);
        // Zusatzpunkte für Combos
        score += Math.floor(combo / 10);
    }
}

window.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    if (e.key === 'Escape') { togglePause(); return; }
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
                    score += 5; // Extra Punkte für ganzes Wort
                    itemsCompleted++; updateUI(); spawnItem(); checkEndCondition();
                }
            } else {
                activeWordTarget.typed = 0; updateWordDisplay(activeWordTarget); activeWordTarget = null;
            }
        }
    }

    if (!matched) triggerError();
    else checkHighscores();
});

// Ranglisten / Admin Funktionen
document.getElementById('show-leaderboard-btn').addEventListener('click', async () => {
    const l = lessonSelect.value;
    const m = document.getElementById('mode-select').value;
    const res = await fetch(`backend.php?action=get_leaderboard&lesson=${l}&mode=${m}`);
    const data = await res.json();

    const tbody = document.querySelector('#leaderboard-table tbody');
    tbody.innerHTML = '';
    data.forEach((row, index) => {
        tbody.innerHTML += `<tr><td>${index + 1}</td><td>${row.username}</td><td>${row.score}</td><td>${row.apm}</td></tr>`;
    });

    document.getElementById('start-screen').style.display = 'none';
    document.getElementById('leaderboard-screen').style.display = 'flex';
});
document.getElementById('close-leaderboard-btn').addEventListener('click', () => {
    document.getElementById('leaderboard-screen').style.display = 'none';
    document.getElementById('start-screen').style.display = 'flex';
});

document.getElementById('admin-view-btn').addEventListener('click', () => {
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'flex';
});
document.getElementById('admin-close-btn').addEventListener('click', () => {
    document.getElementById('admin-screen').style.display = 'none';
    document.getElementById('auth-screen').style.display = 'flex';
});
document.getElementById('admin-login-btn').addEventListener('click', async () => {
    const pw = document.getElementById('admin-pw').value;
    const res = await fetch('backend.php?action=admin_login', { method: 'POST', body: JSON.stringify({password: pw}) });
    const data = await res.json();
    if (data.success) {
        let html = '<table style="width:100%; max-width: 800px; color: black; background: white;"><tr><th>User</th><th>Lektion</th><th>Modus</th><th>Score</th><th>APM</th><th>Fehler</th><th>Datum</th></tr>';
        data.scores.reverse().forEach(s => {
            html += `<tr><td>${s.username}</td><td>${s.lesson}</td><td>${s.mode}</td><td>${s.score}</td><td>${s.apm}</td><td>${s.errors}</td><td>${s.date}</td></tr>`;
        });
        html += '</table>';
        document.getElementById('admin-data').innerHTML = html;
    } else {
        alert("Falsches Passwort!");
    }
});
