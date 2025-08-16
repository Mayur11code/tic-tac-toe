let gameboard = (function () {
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let rule = ["zero", "cross"]
    let count = 1;
    let winstatus;
    let gamestatus = 1;
    let botstatus = 0;


    function diagonalChecker() {
        let condition1 = (gameboard.row1[0] == gameboard.row2[1] && gameboard.row2[1] == gameboard.row3[2])
        let condition2 = (gameboard.row1[2] == gameboard.row2[1] && gameboard.row2[1] == gameboard.row3[0])
        if (condition1 || condition2) {
            return gameboard.row2[1];
        }
    }

    function rowchecker(rowkey) {
        let arr = gameboard[rowkey]
        let result
        for (let i = 0; i < 3; i++) {
            if (!arr.hasOwnProperty(i)) {
                result = "not filled"
                break;
            }

            result = "filled";
        }

        if (result == "filled" && gameboard[rowkey]["0"] == gameboard[rowkey][1] && gameboard[rowkey][1] == gameboard[rowkey][2]) {
            let winner = gameboard[rowkey]["0"]
            console.log(`${winner} WON, ${gameboard.rule[winner]} is ${winner}`)
            return winner;

        }

    }

    function columnChecker(col) {

        if (gameboard.row1[col] == gameboard.row2[col] && gameboard.row2[col] == gameboard.row3[col]) {
            let winner = gameboard.row1[col];
            console.log(`${winner} WON, ${gameboard.rule[winner]} is ${winner}`)
            return winner
        }
    }

    function draw() {
        let status = 1;
        for (let i = 1; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                let rowkey = `row${i}`
                if (!gameboard[rowkey].hasOwnProperty(j)) {
                    status = 0;
                }
            }
        }
        if (status == 1) return "DRAW"

    }




    function clickManager() {
        if (count == 2) {
            count = 1;
            return 2;

        }
        else {
            count++;
            return 1;
        }


    }

    return { row1, row2, row3, clickManager, rule, botstatus, winstatus, gamestatus, rowchecker, diagonalChecker, draw, columnChecker };
})();



function Onclick() {
    let [user1, user2] = formHandler();


    let container = document.querySelector(".container");
    container.addEventListener("click", (e) => {
        let col = parseInt(e.target.getAttribute("column"));
        let row = parseInt(e.target.getAttribute("row"));
        let rowkey = `row${row}`

        if (!e.target.classList.contains("container") && !e.target.classList.contains("clicked")) {

            if (gameboard.gamestatus) {
                if (gameboard.clickManager() == 1 || gameboard.botstatus) {
                    e.target.classList.add("zero")

                    gameboard[rowkey][col] = "0";
                    e.target.textContent = "0"

                    console.log(gameboard[rowkey]);


                }
                else if (gameboard.botstatus == 0) {
                    if (e.target.classList.contains("zero")) {
                        e.target.classList.remove("zero");
                    }

                    e.target.classList.add("Cross")
                    gameboard[rowkey][col] = 1;
                    e.target.textContent = "X"
                    console.log(gameboard[rowkey]);

                }

                if (!gameboard.winstatus && gameboard.gamestatus) {
                    gameboard.winstatus = patternChecker(rowkey, col);
                }
                if (gameboard.botstatus == 1 && gameboard.gamestatus) {
                    let boton = 1;
                    
                    while (boton) {
                        let rownum = Math.floor((Math.random() * 3) + 1)
                        let colkey = Math.floor((Math.random() * 3))
                        let rowkey = `row${rownum}`
                        let target = document.querySelector(`div[row="${rownum}"][column="${colkey}"]`)
                        if (!gameboard[rowkey].hasOwnProperty(colkey)) {
                            target.classList.add("Cross")
                            boton = 0;
                            gameboard[rowkey][colkey] = 1;
                            target.textContent = "X"
                            target.classList.add("clicked")
                            console.log(gameboard[rowkey]);

                        }

                        let condn1 = gameboard.row1.filter((item) => {
                            return item == 1 || item == '0'
                        })
                        let condn2 = gameboard.row2.filter((item) => {
                            return item == 1 || item == '0'
                        })
                        let condn3 = gameboard.row3.filter((item) => {
                            return item == 1 || item == '0'
                        })

                        if (gameboard.row1.length == 3 && gameboard.row2.length == 3 && gameboard.row3.length == 3) {
                            if (gameboard.row1.every((item, i) => item == condn1[i]) && gameboard.row2.every((item, i) => item == condn2[i]) && gameboard.row3.every((item, i) => item == condn3[i])) {
                                break;
                            }
                        }
                        if (!gameboard.winstatus && gameboard.gamestatus) {
                            gameboard.winstatus = patternChecker(rowkey, colkey);
                        }
                    }


                }
            }
        }

        e.target.classList.add("clicked")

        if (gameboard.winstatus && gameboard.gamestatus) {
            document.querySelector(".playagn").classList.remove("visibility")
            let displayresult = document.createElement("div")
            displayresult.classList.add("popup")

            if (gameboard.winstatus != "DRAW") {
                let display = gameboard.winstatus == 1 ? "X" : "0"
                displayresult.textContent = `${display} WONNN YAYYYYYY!!!`

            }

            else {
                displayresult.textContent = "IT'S A DRAW LOL!"
            }
            displayScore(gameboard.winstatus, user1, user2);


            document.querySelector("body").appendChild(displayresult)
            displayresult.classList.add("decoration")
            gameboard.gamestatus = 0;
        }


    })
}




function patternChecker(rowkey, col) {
    let check = gameboard.rowchecker(rowkey);
    if (check) {
        return check;
    }
    else {
        check = gameboard.columnChecker(col);
    }
    if (check) {
        return check;
    }
    else {
        check = gameboard.diagonalChecker();
    }

    if (check) {
        return check
    }
    else {
        return gameboard.draw();
    }

}

// let count = 1;
// for (let i = "0"; i < 2; i++) {
//     if (gameboard[rowkey][i] !== gameboard[rowkey][i+1]) {
//         console.log("NO ONE WON")
//         break;
//     }
//     else if (i==1 && gameboard[rowkey][i]== gameboard[rowkey][i+1]) {
//         console.log(`${gameboard[rowkey][i]} WON`)
//     }
//     let prev = gameboard[rowkey][i];
// }
// METHOD 2 FOR ROW CHECKING


let Useradd = function (Name) {
    let playername = Name;
    let score = 0;
    return function playerScore(winner) {
        score++;
        return score;


    }
}


function displayScore(winner = "", player1, player2) {
    if (!document.querySelector(".card")) {

        let card1 = document.createElement("div")
        let card2 = document.createElement("div")
        card1.classList.add("card", "card1")
        card2.classList.add("card", "card2")
        let container1 = document.querySelector(".p1")
        let container2 = document.querySelector(".p2")
        container1.appendChild(card1);
        container2.appendChild(card2);
    }

    if (winner == "1") {
        document.querySelector(".card2").textContent = player2();

    }
    else if (winner == "0") {
        document.querySelector(".card1").textContent = player1();
    }
}

function formHandler() {
    let player1 = document.querySelector("#player1").value;
    let player2
    if (!gameboard.botstatus) {
        player2 = document.querySelector("#player2").value;
    }
    else player2 = "STUPUD AF BOT"

    document.querySelector(".name1").textContent = `${player1} " X"`
    document.querySelector(".name2").textContent = `${player2} " 0"`


    return [Useradd(player1), Useradd(player2)]
    // else { return [Useradd(player1), " "] }
}



document.querySelector(".submit").addEventListener("click", (e) => {
    e.preventDefault();
    let data = formHandler();
    displayScore();
    document.querySelector(".form").classList.add("visibility")
    Onclick();
    // gameboard.clickManager();
})

document.querySelector(".playagn").addEventListener("click", () => {
    gameboard.gamestatus = 1;
    gameboard.winstatus = 0;
    Array.from(document.querySelectorAll(".box")).forEach((item) => {
        if (item.classList.contains("zero")) {
            item.classList.remove("zero")
        }
        else if (item.classList.contains("Cross")) {
            item.classList.remove("Cross");
        }
        item.textContent = "";
        item.classList.remove("clicked")

    })
    gameboard.row1.length = 0;
    gameboard.row2.length = 0;
    gameboard.row3.length = 0;
    document.querySelector("body").removeChild(document.querySelector(".popup"))
})


document.querySelector(".start").addEventListener("click", (e) => {
    document.querySelector(".form").classList.remove("visibility");
    e.target.classList.add("visibility")
})


document.querySelector(".bot").addEventListener("click", (e) => {

    if (e.target.checked) {
        document.querySelector("input[name='player2']").disabled = true;
        gameboard.botstatus = 1;
    }

})


