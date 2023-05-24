var digitSelected = null;
var tileSelected = null;
var one = 4;
var two = 3;
var three = 3;
var four = 4;
var five = 3;
var six = 5;
var seven = 5;
var eight = 4;
var nine = 4;

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

function selectTile() {
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

function selectDigit() {
    if (tileSelected != null) { // digit selection
        if (tileSelected.classList.contains("tile-start") == true) { // return if already number at that boardTile
            return;
        }

        // let coords = tileSelected.id.split("-"); // ["0", "0"] ...
        // let row = parseInt(coords[0]);
        // let col = parseInt(coords[1]);
        let oldDigitSelected = digitSelected;
        digitSelected = this;

        let oldTileSelectedInnerText = tileSelected.innerText;
        /*if (checkToStopPlacingDigits == true) {
            return;
        }*/
        switch(digitSelected.id) {
            case "1":
                if (one == 9) {
                    return;
                }
                break;
            case "2":
                if (two == 9) {
                    return;
                }
                break;
            case "3":
                if (three == 9) {
                    return;
                }
                break;
            case "4":
                if (four == 9) {
                    return;
                }
                break;
            case "5":
                if (five == 9) {
                    return;
                }
                break;
            case "6":
                if (six == 9) {
                    return;
                }
                break;
            case "7":
                if (seven == 9) {
                    return;
                }
                break;
            case "8":
                if (eight == 9) {
                    return;
                }
                break;
            case "9":
                if (nine == 9) {
                    return;
                }
                break;
        }
        tileSelected.innerText = digitSelected.id; // place down selected digit
        if (oldDigitSelected != null && oldTileSelectedInnerText != "" &&
            tileSelected.innerText != oldTileSelectedInnerText) {
            switch(oldTileSelectedInnerText) {
                case "1":
                    one--; break;
                case "2":
                    two--; break;
                case "3":
                    three--; break;
                case "4":
                    four--; break;
                case "5":
                    five--; break;
                case "6":
                    six--; break;
                case "7":
                    seven--; break;
                case "8":
                    eight--; break;
                case "9":
                    nine--; break;
            }
        }
        if (/*tileSelected.innerText == "" ||*/ tileSelected.innerText != oldTileSelectedInnerText) {
            switch(digitSelected.id) {
                case "1":
                    one++; break;
                case "2":
                    two++; break;
                case "3":
                    three++; break;
                case "4":
                    four++; break;
                case "5":
                    five++; break;
                case "6":
                    six++; break;
                case "7":
                    seven++; break;
                case "8":
                    eight++; break;
                case "9":
                    nine++; break;
            }
        }
        completedDigit();
        unCompletedDigit();
        console.log(one);
        console.log(two);
        console.log(three);
        console.log(four);
        console.log(five);
        console.log(six);
        console.log(seven);
        console.log(eight);
        console.log(nine);
        console.log("");

    }
}

function completedDigit() {
    let completed = false;
    if (digitSelected.id == "1" && one == 9) {
        completed = true;
    } else if (digitSelected.id == "2" && two == 9) {
        completed = true;
    } else if (digitSelected.id == "3" && three == 9) {
        completed = true;
    } else if (digitSelected.id == "4" && four == 9) {
        completed = true;
    } else if (digitSelected.id == "5" && five == 9) {
        completed = true;
    } else if (digitSelected.id == "6" && six == 9) {
        completed = true;
    } else if (digitSelected.id == "7" && seven == 9) {
        completed = true;
    } else if (digitSelected.id == "8" && eight == 9) {
        completed = true;
    } else if (digitSelected.id == "9" && nine == 9) {
        completed = true;
    }
    if (completed == true) {
        digitSelected.classList.remove("digits");
        digitSelected.innerText = "";
    }
}

function unCompletedDigit() {
    if (one != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("1").innerText = "1";
    }
    if (two != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("2").innerText = "2";
    } 
    if (three != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("3").innerText = "3";
    }
    if (four != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("4").innerText = "4";
    }  
    if (five != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("5").innerText = "5";
    }  
    if (six != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("6").innerText = "6";
    }  
    if (seven != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("7").innerText = "7";
    }  
    if (eight != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("8").innerText = "8";
    }  
    if (nine != 9) {
        digitSelected.classList.add("digits");
        document.getElementById("9").innerText = "9";
    }
}

function checkToStopPlacingDigits() {
    switch(digitSelected.id) {
            case "1":
                if (one == 9) {
                    return true;
                }
                break;
            case "2":
                if (two == 9) {
                    return true;
                }
                break;
            case "3":
                if (three == 9) {
                    return true;
                }
                break;
            case "4":
                if (four == 9) {
                    return true;
                }
                break;
            case "5":
                if (five == 9) {
                    return true;
                }
                break;
            case "6":
                if (six == 9) {
                    return true;
                }
                break;
            case "7":
                if (seven == 9) {
                    return true;
                }
                break;
            case "8":
                if (eight == 9) {
                    return true;
                }
                break;
            case "9":
                if (nine == 9) {
                    return true;
                }
                break;
        }
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
- if a number is not supposed to be there based on current board, make it red (check 3 blocks)
*/

/* IMPROVEMENTS FINISHED
- when clicking already gray digitsTile, make it back to white
- click boardTile first, then click any digitTile to place a digit
- allow incorrect placements
- remove error count
- make digit disappear once all 9 are on the board

*/
