// クエリパラメータからモードと世代を取得
const params = new URLSearchParams(location.search);
const mode = params.get("mode");
const selectedGenerations = params.get("generation")?.split(",").map(Number);

// 世代に対応する図鑑番号の範囲
const generationRanges = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1010]
};

// 出題対象のポケモン一覧を作成
let questions = [];

if (selectedGenerations && selectedGenerations.length > 0) {
    selectedGenerations.forEach(gen => {
        const [start, end] = generationRanges[gen];
        for (let i = start; i <= end; i++) {
            if (pokedex[i]) {
                questions.push({ id: i, name: pokedex[i] });
            }
        }
    });

    // モードに応じて並べ替え
    if (mode === "random") {
        questions = questions.sort(() => Math.random() - 0.5);
    } else {
        questions = questions.sort((a, b) => a.id - b.id);
    }
} else {
    alert("選択されたポケモンがありません。");
}

// タイマー
let startTime = Date.now();
let timer = setInterval(updateTime, 1000);

function updateTime() {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    document.getElementById("question-header").textContent =
        `${currentIndex + 1}問目 / 残り: ${questions.length - currentIndex}問 / 経過時間: ${elapsed}秒`;
}

// 現在の問題のインデックスと正解数
let currentIndex = 0;
let correctCount = 0;

const img = document.getElementById("pokemon-image");
const input = document.getElementById("answer-input");
const feedback = document.getElementById("feedback");

// 初期表示
showQuestion();

// 問題表示関数
function showQuestion() {
    if (currentIndex >= questions.length) {
        endQuiz();
        return;
    }

    const q = questions[currentIndex];
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${q.id}.png`;
    img.alt = q.name;
    input.value = "";
    feedback.textContent = "";
}

// 「答える」ボタン処理
document.getElementById("answer-button").addEventListener("click", () => {
    const answer = input.value.trim();
    const correct = questions[currentIndex].name;

    if (answer === correct || answer === toKatakana(correct) || answer === toHiragana(correct)) {
        feedback.textContent = "正解！";
        feedback.style.color = "green";
        correctCount++;
        setTimeout(() => {
            currentIndex++;
            showQuestion();
        }, 800); // 演出のため少し待つ
    } else {
        feedback.textContent = "ちがうよー！";
        feedback.style.color = "red";
    }
});

// 「パス」ボタン処理
document.getElementById("pass-button").addEventListener("click", () => {
    const correct = questions[currentIndex].name;
    feedback.textContent = `正解は：${correct}`;
    feedback.style.color = "blue";

    setTimeout(() => {
        currentIndex++;
        showQuestion();
    }, 1200);
});

// 「リタイア」ボタン処理
document.getElementById("retire-button").addEventListener("click", () => {
    if (confirm("本当にリタイアしますか？")) {
        endQuiz();
    }
});

// クイズ終了処理
function endQuiz() {
    clearInterval(timer);
    const totalTime = Math.floor((Date.now() - startTime) / 1000);

    document.getElementById("quiz-container").style.display = "none";
    document.getElementById("result-container").style.display = "block";

    document.getElementById("score-text").textContent = `正解数：${correctCount} / ${questions.length}`;
    document.getElementById("time-text").textContent = `経過時間：${totalTime}秒`;
}

// ひらがな⇔カタカナ変換
function toHiragana(str) {
    return str.replace(/[\u30A1-\u30F6]/g, ch =>
        String.fromCharCode(ch.charCodeAt(0) - 0x60)
    );
}

function toKatakana(str) {
    return str.replace(/[\u3041-\u3096]/g, ch =>
        String.fromCharCode(ch.charCodeAt(0) + 0x60)
    );
}
