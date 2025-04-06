// 世代ごとの代表ポケモン（図鑑番号）
const generationMap = {
    1: [1, 4, 7],
    2: [152, 155, 158],
    3: [252, 255, 258],
    4: [387, 390, 393],
    5: [495, 498, 501],
    6: [650, 653, 656],
    7: [722, 725, 728],
    8: [810, 813, 816],
    9: [906, 909, 912]
};

// 表示する世代ボックスを生成
const container = document.getElementById("generation-options");

Object.entries(generationMap).forEach(([gen, pokeNums]) => {
    const box = document.createElement("div");
    box.className = "generation-box";

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "generation";
    checkbox.value = gen;

    label.appendChild(checkbox);
    label.append(` 第${gen}世代`);
    box.appendChild(label);

    pokeNums.forEach(num => {
        const img = document.createElement("img");
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${num}.png`;
        img.alt = pokedex[num];
        img.className = "pokemon-img";
        box.appendChild(img);
    });

    // チェック時に背景色変更
    checkbox.addEventListener("change", () => {
        box.classList.toggle("checked", checkbox.checked);
    });

    container.appendChild(box);
});

// クイズスタート処理
document.getElementById("startButton").addEventListener("click", () => {
    const selectedGenerations = Array.from(document.querySelectorAll('input[name="generation"]:checked')).map(cb => Number(cb.value));
    const selectedMode = document.querySelector('input[name="mode"]:checked')?.value;

    if (selectedGenerations.length === 0) {
        alert("少なくとも1つの世代を選択してください。");
        return;
    }

    if (!selectedMode) {
        alert("出題モードを選択してください。");
        return;
    }

    // 世代とモードをクエリパラメータで渡す
    const query = `generation=${selectedGenerations.join(",")}&mode=${selectedMode}`;
    location.href = `quiz.html?${query}`;
});
