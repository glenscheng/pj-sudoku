var numSelected = null;
var tileSelected = null;

var errors = 0;

var board = [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
]

var solution = [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]

window.onload = function() {
    setGame();
}

function setGame() {
    // digits 1-9
    for (let i = 1; i <= 9; i++) {
        // 
        let digitsTile = document.createElement("div"); // create a div
        digitsTile.id = i; // set id
        digitsTile.innerText = i; // set digit
        digitsTile.addEventListener("click", selectNumber); // detect click
        digitsTile.classList.add("digits-tile"); // add formatting
        document.getElementById("digits").appendChild(digitsTile);
    }

    // board
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let boardTile = document.createElement("div"); // create a div
            boardTile.addEventListener("click", selectTile); // detect click
            boardTile.id = row.toString() + '-' + col.toString(); // set id
            if (board[row][col] != "-") {
                boardTile.innerText = board[row][col]; // set board numbers
                boardTile.classList.add("tile-start");
            }
            if (row == 2 || row == 5) {
                boardTile.classList.add("horizontal-line"); // add horizontal lines
            }
            if (col == 2 || col == 5) {
                boardTile.classList.add("vertical-line"); // add vertical lines
            }
            boardTile.classList.add("board-tile"); // add formatting
            document.getElementById("board").append(boardTile);
        }
    }
}

function selectNumber() {
    if (numSelected != null) { // old selection
        numSelected.classList.remove("number-selected"); // remove previous graying
    }
    numSelected = this; // new selection
    numSelected.classList.add("number-selected"); // add graying
}

// make unselectNumber when clicking already gray digitsTile

function selectTile() {
    if (numSelected != null) { // digit selection
        if (this.innerText != "") { // return if already number at that boardTile
            return;
        }

        let coords = this.id.split("-"); // ["0", "0"] ...
        let row = parseInt(coords[0]);
        let col = parseInt(coords[1]);
        if (solution[row][col] == numSelected.id) {
            this.innerText = numSelected.id; // place down selected digit IF IT IS CORRECT
        }
        else {
            errors += 1;
            document.getElementById("errors").innerText = errors;
        }
    }
}