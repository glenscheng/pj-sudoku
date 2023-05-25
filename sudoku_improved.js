var digitSelected = null;
var tileSelected = null;
var digitsCount = new Array(10)
initiateDigitsCount();

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
    
    // digits 1-9
    for (let i = 1; i <= 9; i++) {
        // 
        let digitsTile = document.createElement("div"); // create a div
        digitsTile.id = i; // set id
        digitsTile.innerText = i; // set digit
        digitsTile.addEventListener("click", selectDigit); // detect click
        digitsTile.classList.add("digits-tile"); // add formatting
        document.getElementById("digits").appendChild(digitsTile);
    }
}

function selectTile() { // highlights a boardTile
    if (tileSelected != null) { // old selection
        tileSelected.classList.remove("number-selected"); // remove previous graying
    }
    if (tileSelected == this) {
        tileSelected.classList.remove("number-selected"); // remove graying if clicked on again
        tileSelected = null;
        return;
    }
    tileSelected = this; // new selection
    if (tileSelected.classList.contains("tile-start") == false) {
        tileSelected.classList.add("number-selected"); // add graying
    }
}

function selectDigit() { // places down number
    if (tileSelected != null) { // digit selection
        if (tileSelected.classList.contains("tile-start") == true) { // return if already number at that boardTile
            return;
        }

        let oldDigitSelected = digitSelected;
        digitSelected = this;

        let oldTileSelectedInnerText = tileSelected.innerText;
        if (checkToStopPlacingDigits() == true) {
            return;
        }
       
        tileSelected.innerText = digitSelected.id; // place down selected digit
        let coords = tileSelected.id.split("-"); // ["0", "0"] ...
        let row = parseInt(coords[0]);
        let col = parseInt(coords[1]);
        board[row][col] = parseInt(digitSelected.id); // update board array for digit that was just placed
        if (oldDigitSelected != null && oldTileSelectedInnerText != "" &&
            tileSelected.innerText != oldTileSelectedInnerText) {
            digitsCount[parseInt(oldTileSelectedInnerText)]--;
        }
        if (tileSelected.innerText != oldTileSelectedInnerText) {
            digitsCount[parseInt(digitSelected.id)]++;
        }
        completedDigit();
        unCompletedDigit();
        printDigitsCount();

        if (checkIncorrectPlacement(row, col) == false) {
            // make number of board red
            tileSelected.classList.add("incorrect-placement");
        }
        checkCorrectPlacement();
    }
}

function checkCorrectPlacement() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (document.getElementById(String(r) + '-' + String(c)).classList.contains("incorrect-placement") == true) {
                console.log("row col:", r, c);
                if (checkIncorrectPlacement(r, c) == true) {
                    // console.log("row col:", r, c); 
                    document.getElementById(String(r) + '-' + String(c)).classList.remove("incorrect-placement");
                }
            }
        }
    }
}

function checkIncorrectPlacement(row, col) {
    // check horizontal block
    for (let c = 0; c < 9; c++) {
        if (c == col) {
            continue;
        }
        if (document.getElementById(String(row) + '-' + String(c)).innerText == document.getElementById(String(row) + '-' + String(col)).innerText) {
            console.log("return 1, c: ", c);
            return false;
        }
    }
    // check vertical block
    for (let r = 0; r < 9; r++) {
        if (r == row) {
            continue;
        }
        if (document.getElementById(String(r) + '-' + String(col)).innerText == document.getElementById(String(row) + '-' + String(col)).innerText) {
            console.log("return 2");
            return false;
        }
    }
    // check 3x3 block
    let [row_lb, row_ub, col_lb, col_ub] = determine3x3Block(row, col);
    for (r = row_lb; r <= row_ub; r++) {
        for (c = col_lb; c <= col_ub; c++) {
            if (r == row && c == col) {
                continue;
            }
            if (document.getElementById(String(r) + '-' + String(c)).innerText == document.getElementById(String(row) + '-' + String(col)).innerText) {
                console.log("return 3");
                return false;
            }
        }
    }

    return true;
}

function determine3x3Block(row, col) { // checks which 3x3 block a digit is placed, returns [row_lb, row_ub, col_lb, col_ub]
    if (row <= 2) { 
        if (col <= 2) { // block 1
            return [0,2,0,2];
        }
        else if (col <= 5) { // block 2
            return [0,2,3,5];
        }
        else { // block 3
            return [0,2,6,8];
        }
    }
    else if (row <= 5) {
        if (col <= 2) { // block 4
            return [3,5,0,2];
        }
        else if (col <= 5) { // block 5
            return [3,5,3,5];
        }
        else { // block 6
            return [3,5,6,8];
        }
    }
    else {
        if (col <= 2) { // block 7
            return [6,8,0,2];
        }
        else if (col <= 5) { // block 8
            return [6,8,3,5];
        }
        else { // block 9
            return [6,8,6,8];
        }
    }
}

function completedDigit() { // removes functionality from digitTile when a digit is completed
    for (let i = 1; i <= 9; i++) {
        if (digitSelected.id == String(i) && digitsCount[i] == 9) {
            digitSelected.classList.remove("digits");
            digitSelected.innerText = "";
            return;
        }
    }
}

function unCompletedDigit() { // adds functionality back to digitTile when a digit is no longer completed
    for (let i = 1; i <= 9; i++) {
        if (digitsCount[i] != 9) {
            document.getElementById(String(i)).classList.add("digits");
            document.getElementById(String(i)).innerText = String(i);
        }
    }
}

function checkToStopPlacingDigits() { // checks if selected digit already has been placed 9 times 
    if (digitsCount[parseInt(digitSelected.id)] == 9) {
        return true;
    }
    return false;
}

function initiateDigitsCount() {
    digitsCount[0] = -1;
    digitsCount[1] = 4;
    digitsCount[2] = 3;
    digitsCount[3] = 3;
    digitsCount[4] = 4;
    digitsCount[5] = 3;
    digitsCount[6] = 5;
    digitsCount[7] = 5;
    digitsCount[8] = 4;
    digitsCount[9] = 4;
}

function printDigitsCount() {
    for (let i = 1; i <= 9; i++) {
        console.log(digitsCount[i]);
    }
    console.log("");
}

/* IMPROVEMENTS IN PROGRESS
- add timer
- when clicking a number on a boardTile, highlight (yellow) all of the same numbers on the board
- add button to show solution
- add button to check board
- add button to check boardTile
- add pencil notes functionality (little numbers)
- add generation of new boards/solutions
- add button to clear board
- using backspace deletes number on board
- can use keyboard numbers to place down numbers
*/

/* IMPROVEMENTS FINISHED
- when clicking already gray digitsTile, make it back to white
- click boardTile first, then click any digitTile to place a digit
- allow incorrect placements
- remove error count
- make digit disappear once all 9 are on the board
- if a number is not supposed to be there based on current board, make it red (check 3 "blocks")

*/
