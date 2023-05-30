var digitSelected = null;
var tileSelected = null;
var digitsCount = new Array(10)
var detectedClickOutsideBoard = false;

var minute = 00;
var second = 00;
var timer = true;

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
/*
var board = [
    "3-7491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
]
*/
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
    startClock();
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
    initiateDigitsCount();

    // delete button
    let deleteButton = document.createElement("div");
    deleteButton.id = "delete";
    deleteButton.innerText = "Delete";
    deleteButton.addEventListener("click", deleteNumber);
    deleteButton.classList.add("delete-tile");
    document.getElementById("delete").appendChild(deleteButton);
}

function selectTile() { // highlights a boardTile
    unhighlightSameNumbers();
    if (tileSelected != null) { // old selection
        tileSelected.classList.remove("number-selected"); // remove previous graying on another boardTile
    }
    if (detectedClickOutsideBoard) {
        console.log("returning");
        return;
    }
    if (tileSelected == this) {
        tileSelected.classList.remove("number-selected"); // remove graying if clicked on again
        if (tileSelected != null && tileSelected.innerText != '') {
            highlightSameNumbers();
            tileSelected.classList.add("number-selected");
        }
        tileSelected = null;
        return;
    }
    tileSelected = this; // new selection
    if (tileSelected != null && tileSelected.innerText != '') {
        highlightSameNumbers();
    }
    if (tileSelected.classList.contains("tile-start") == false) {
        tileSelected.classList.add("number-selected"); // add graying
    }

    detectClicksOutside(); // removes all boardTiles' formatting when there is outside click
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
       
        unhighlightSameNumbers();
        tileSelected.innerText = digitSelected.id; // place down selected digit
        highlightSameNumbers();
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
        determineGameOver();
        confettiOn();
    }
}

async function startClock() {
    if (timer) {
        // const start = Date.now();
        if (second == 60) {
            minute++;
            second = 0;
        }
 
        let minString = minute;
        let secString = second;
 
        if (minute < 10) {
            minString = "0" + minString;
        }
 
        if (second < 10) {
            secString = "0" + secString;
        }
 
        document.getElementById('min').innerHTML = minString;
        document.getElementById('sec').innerHTML = secString;
        // await delay(990); // 990ms gets it close to 1s delay
        second++;
        setTimeout(startClock, 999);
        // const end = Date.now();
        // console.log(`Execution time: ${end - start} ms`);
    }
}

function deleteNumber() {
    if (tileSelected == null || tileSelected.classList.contains("tile-start")) {
        return;
    }
    digitsCount[parseInt(tileSelected.innerText)]--;
    tileSelected.classList.remove("highlight-tile");
    tileSelected.innerText = '';
    completedDigit();
    unCompletedDigit();
    printDigitsCount();
    checkCorrectPlacement();
    tileSelected.classList.remove("incorrect-placement");
    determineGameOver();
    unhighlightSameNumbers();
}

function countMistakes() {
    let count = 0;
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if(document.getElementById(String(r) + '-' + String(c)).classList.contains("incorrect-placement")) {
                count++;
            }
        }
    }
    document.getElementById("mistakes").innerText = "Mistakes: " + String(count) + "/3";
    return count;
}

function determineGameOver() { // when you lose
    if (countMistakes() == 3) {
        alert("you lost!");
        gameFinished();
    }
}

function highlightSameNumbers() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (document.getElementById(String(r) + '-' + String(c)).innerText == tileSelected.innerText) {
                document.getElementById(String(r) + '-' + String(c)).classList.add("highlight-tile");
            }
        }
    }
    if (!tileSelected.classList.contains("tile-start")) {
        tileSelected.classList.remove("highlight-tile");
    }
    tileSelected.classList.add("number-selected");
}

function unhighlightSameNumbers() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            document.getElementById(String(r) + '-' + String(c)).classList.remove("highlight-tile");
        }
    }
}

function detectClicksOutside() {
    document.addEventListener("mouseup", function(event) { // event listener for clicks outside all boardTiles 
        let count = 0;
        for (let r = 0; r < 9; r++) {
            for (let c = 0; c < 9; c++) {
                if (!(document.getElementById(String(r) + '-' + String(c)).contains(event.target))) {
                    count++;
                }
            }
        }
        if (count == 81) {
            count = 0;
            for (let i = 1; i <= 9; i++) { // iterate through digits
                if (!(document.getElementById(String(i))).contains(event.target)) {
                    count++;
                }
            }
            if (count == 9) {
                if (!(document.getElementById("delete")).contains(event.target)) {
                    unselectAllBoardTiles(); 
                    unhighlightSameNumbers();  
                }
            } 
        }
    });
}

function unselectAllBoardTiles() { // gets rid of graying on all tiles
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            document.getElementById(String(r) + '-' + String(c)).classList.remove("number-selected");
        }
    }
    tileSelected = null;
}

function checkCorrectPlacement() { // removes red font if any number on board is no longer incorrect
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (document.getElementById(String(r) + '-' + String(c)).classList.contains("incorrect-placement") == true) {
                // console.log("row col:", r, c);
                if (checkIncorrectPlacement(r, c) == true) {
                    // console.log("row col:", r, c); 
                    document.getElementById(String(r) + '-' + String(c)).classList.remove("incorrect-placement");
                }
            }
        }
    }
}

function checkIncorrectPlacement(row, col) { // returns true if correct placement, false if incorrect
    // check horizontal block
    for (let c = 0; c < 9; c++) {
        if (c == col) {
            continue;
        }
        if (document.getElementById(String(row) + '-' + String(c)).innerText == document.getElementById(String(row) + '-' + String(col)).innerText) {
            return false;
        }
    }
    // check vertical block
    for (let r = 0; r < 9; r++) {
        if (r == row) {
            continue;
        }
        if (document.getElementById(String(r) + '-' + String(col)).innerText == document.getElementById(String(row) + '-' + String(col)).innerText) {
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
    /*
    digitsCount[0] = -1;
    digitsCount[1] = 9;
    digitsCount[2] = 9;
    digitsCount[3] = 9;
    digitsCount[4] = 9;
    digitsCount[5] = 9;
    digitsCount[6] = 9;
    digitsCount[7] = 9;
    digitsCount[8] = 8;
    digitsCount[9] = 9;
    */
    for (let i = 1; i <= 9; i++) {
        if (digitsCount[i] == 9) {
            document.getElementById(String(i)).classList.remove("digits");
            document.getElementById(String(i)).innerText = "";
        }
    }
}

function printDigitsCount() {
    for (let i = 1; i <= 9; i++) {
        console.log(digitsCount[i]);
    }
    console.log("");
}

function confettiOn() { // when you win
    for (let i = 1; i <= 9; i++) {
        if (digitsCount[i] != 9) {
            return;
        }
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (document.getElementById(String(r) + '-' + String(c)).classList.contains("incorrect-placement")) {
                return;
            }
        }
    }
    startConfetti();
    gameFinished();
}

function gameFinished() { // when the game is done
    timer = false; // stop stopwatch
    
    // remove all eventListeners from all elements
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            document.getElementById(String(r) + '-' + String(c)).removeEventListener("click", selectTile); // boardTiles
        }
    }
    for (let i = 1; i <= 9; i++) {
        document.getElementById(String(i)).addEventListener("click", selectDigit); // digitTiles
    }
    document.getElementById("delete").addEventListener("click", deleteNumber); // delete button
    
    unhighlightSameNumbers();
    unselectAllBoardTiles();
}

/* IMPROVEMENTS IN PROGRESS
- add timer
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
- when clicking already gray boardTile, make it back to white
- click boardTile first, then click any digitTile to place a digit
- allow incorrect placements
- remove error count
- make digit disappear once all 9 are on the board
- if a number is not supposed to be there based on current board, make it red (check 3 "blocks")
- remove graying on boardTile when clicking outside board
- when clicking a number on a boardTile, highlight (yellow) all of the same numbers on the board
- add confetti when you win
- add backspace button
- allow only 3 mistakes

*/
