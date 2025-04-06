const query = new URLSearchParams(window.location.search);
const generationParams = query.getAll("generation"); // 複数取得に対応！
const mode = query.get("mode");

const genRanges = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 809 },
    8: { start: 810, end: 905 },
    9: { start: 906, end: 1010 }
};

let problemList = [];

// 複数世代に対応した出題リスト生成
generationParams.forEach(gen => {
    const g = parseInt(gen);
    const range = genRanges[g];
    for (let i = range.start; i <= range.end; i++) {
        if (pokedex[i]) {
            problemList.push({ id: i, name: pokedex[i] });
        }
    }
});

if (mode === "random") {
    shuffle(problemList);
}

let current = 0;
let score = 0;
let startTime = null;
let timerInterval = null;

function showQuestion() {
    if (current >= problemList.length) {
        finishQuiz();
        return;
    }

    const q = problemList[current];
    document.getElementById("pokemon-image").src =
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${q.id}.png`;

    document.getElementById("answer").value = "";
    document.getElementById("result").textContent = "";
    document.getElementById("question-title").textContent = `このポケモンの名前は？`;
    document.getElementById("question-count").textContent =
        `現在 ${current + 1}問目（全${problemList.length}問）`;
}

function checkAnswer() {
    const input = document.getElementById("answer").value.trim();
    const correct = problemList[current].name;

    if (input === correct) {
        document.getElementById("result").textContent = "正解！";
        score++;
        current++;
        setTimeout(showQuestion, 1000);
    } else {
        document.getElementById("result").textContent = "ちがうよー……";
    }
}

function skipQuestion() {
    const confirmed = confirm("この問題をパスしますか？");
    if (!confirmed) return;

    const correct = problemList[current].name;
    document.getElementById("result").textContent = `正解：${correct}`;
    current++;
    setTimeout(showQuestion, 1500);
}

function retire() {
    const confirmed = confirm("リタイアしてもいいですか？");
    if (!confirmed) return;

    finishQuiz("リタイアしました！");
}

function finishQuiz(message = "クイズ終了！") {
    clearInterval(timerInterval);

    document.getElementById("pokemon-image").style.display = "none";
    document.getElementById("question-title").textContent = message;
    document.getElementById("result").textContent = "";
    document.getElementById("score").textContent = `正解数：${score} / ${problemList.length}`;
    document.getElementById("question-count").textContent = "";
    document.getElementById("answer").style.display = "none";
    document.querySelectorAll("button").forEach(btn => btn.style.display = "none");
    document.getElementById("home-button").style.display = "inline-block";

    const time = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    document.getElementById("timer").textContent = `かかった時間：${minutes}分${seconds}秒`;
}

function goHome() {
    window.location.href = "index.html";
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        const time = Math.floor((Date.now() - startTime) / 1000);
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById("timer").textContent = `経過時間：${minutes}分${seconds}秒`;
    }, 1000);
}

window.addEventListener("beforeunload", function (e) {
    e.preventDefault();
    e.returnValue = "";
});

startTimer();
showQuestion();