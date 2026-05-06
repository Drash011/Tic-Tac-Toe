let player1 = "";
let player2 = "";
let mode = "";

let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = false;

document.getElementById("nextBtn").onclick = () => {
    player1 = document.getElementById("player1").value.trim();
    if (!player1) return alert("Enter your name");

    document.getElementById("step1").style.display = "none";
    document.getElementById("step2").style.display = "block";
};

document.getElementById("friendBtn").onclick = () => {
    mode = "pvp";
    document.getElementById("step2").style.display = "none";
    document.getElementById("step3").style.display = "block";
};

document.getElementById("cpuBtn").onclick = () => {
    mode = "cpu";
    player2 = "Computer 🤖";
    startGame();
};

document.getElementById("startGameBtn").onclick = () => {
    player2 = document.getElementById("player2").value.trim();
    if (!player2) return alert("Enter Player 2 name");

    startGame();
};

function startGame() {
    document.getElementById("step3").style.display = "none";
    document.getElementById("gameUI").style.display = "block";

    document.getElementById("welcomeText").innerText =
        `${player1} vs ${player2}`;

    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";

    renderBoard();
    updateStatus();
}

function renderBoard() {
    const boardDiv = document.getElementById("board");
    boardDiv.innerHTML = "";

    board.forEach((val, i) => {
        let cell = document.createElement("div");
        cell.className = "cell";

        cell.innerText = val;

        if (val === "X") cell.classList.add("x");
        if (val === "O") cell.classList.add("o");

        if (val !== "") {
            cell.classList.add("pop");
        }

        cell.onclick = () => move(i);
        boardDiv.appendChild(cell);
    });
}

function move(i) {
    if (board[i] !== "" || !gameActive) return;

    board[i] = currentPlayer;
    renderBoard();

    if (checkWin()) {
        gameActive = false;

        setTimeout(() => {
            endGame(currentPlayer);
        }, 800);

        return;
    }

    if (!board.includes("")) {
        endGame("Draw");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    updateStatus();

    if (mode === "cpu" && currentPlayer === "O") {
        let bestMove = getBestMove();
        setTimeout(() => move(bestMove), 400);
    }
}

function getBestMove() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let [a, b, c] of winPatterns) {
        let line = [board[a], board[b], board[c]];
        if (line.filter(v => v === "O").length === 2 && line.includes("")) {
            return [a, b, c][line.indexOf("")];
        }
    }

    for (let [a, b, c] of winPatterns) {
        let line = [board[a], board[b], board[c]];
        if (line.filter(v => v === "X").length === 2 && line.includes("")) {
            return [a, b, c][line.indexOf("")];
        }
    }

    if (board[4] === "") return 4;

    let corners = [0, 2, 6, 8].filter(i => board[i] === "");
    if (corners.length) {
        return corners[Math.floor(Math.random() * corners.length)];
    }

    let empty = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
    return empty[Math.floor(Math.random() * empty.length)];
}

function updateStatus() {
    let name = currentPlayer === "X" ? player1 : player2;
    document.getElementById("status").innerText = "Turn: " + name;
}

function checkWin() {
    const w = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of w) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlightWin(combo);
            return true;
        }
    }
    return false;
}

function highlightWin(combo) {
    const cells = document.querySelectorAll(".cell");

    combo.forEach(i => {
        cells[i].classList.add("win");
    });
}

function endGame(winner) {
    gameActive = false;

    confetti({ particleCount: 120, spread: 80 });

    let name = winner === "X" ? player1 : player2;

    const text = document.getElementById("winnerText");

    text.innerText = winner === "Draw" ? "Draw!" : name + " Wins!";

    if (winner === "Draw") {
        text.style.color = "#ffffff";
        text.style.textShadow = "0 0 10px #fff";
    } else {
        text.style.color = "#00f0ff";
        text.style.textShadow = "0 0 15px #00f0ff";
    }

    document.getElementById("winnerModal").style.display = "flex";
}

document.getElementById("restartBtn").onclick = () => {
    location.reload();
};