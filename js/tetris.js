import BLOCKS from "./blocks.js";

// DOM
const playground = document.querySelector(".playground > ul");
const gameText = document.querySelector(".game-text");
const scoreDisplay = document.querySelector(".score");
const restartButton = document.querySelector(".game-text > button");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500; // 블럭이 떨어지는 시간
let downInterval;
let tempMovingItem; // movingItem이 실행되기 전에 잠깐 담아두는 용도

const movingItem = { // 블럭의 타입과 좌표 등의 정보
    type: "",
    direction: 0, // 화살표 윗 방향키 눌렀을 때 모양 변경
    top: 0, // 좌표 기준으로 어디까지 내려와있는지, 내려가야하는지 표현
    left: 0, // 좌우 값
};

init();

// functions
function init() { // 화면(script)가 처음 호출이 될 때
    tempMovingItem = { ...movingItem };
    // movingItem을 담아둠
    // 전개 구문을 사용하면 값만 가져옴. movingItem 자체를 보는 게 아니라 값만 봄!
    // 이렇게 하면 movingItem의 값이 변경이 되도 tempMovingItem의 값은 변경되지 않음

    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    };
    // renderBlocks();
    generateNewBlock();
    score = 0;
};

function prependNewLine() {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    };
    // 10번이 들어간 ul을 li에 넣어줌
    li.prepend(ul);
    playground.prepend(li);
};

function renderBlocks(moveType = "") { // 블럭을 선택해서 값에 맞는 모양대로 그림을 그려줌
    const { type, direction, top, left }  = tempMovingItem;
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        // console.log(moving);
        moving.classList.remove(type, "moving");
        // tree와 moving class를 빼줌
    });

    // tempMovingItem.type; 과 같음

    BLOCKS[type][direction].some(block => {
        // type이 tree가 됨
        const x = block[0] + left; // 좌표의 첫 번째 값, ul의 li값
        const y = block[1] + top; // li의 row값
        // console.log({ playground });
        const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        if(isAvailable) {
            target.classList.add(type, "moving"); // target이 li가 됨
        } else {
            tempMovingItem = { ...movingItem };
            // 변경되지 않았던 movingItem으로 원상복구
            if(moveType === "retry") {
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(() => {
                renderBlocks("retry"); // 재귀
                if(moveType === "top") {
                    seizeBlock();
                }
            }, 0); // 이벤트 루프에 예약된 이벤트들이 다 실행이 된 후에 실행됨
            // renderBlocks();
            return true;
        };
    });
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction; // tempMovingItem
};

function seizeBlock() { // 블럭이 맨 밑으로 내려간 상황
    const movingBlocks = document.querySelectorAll(".moving");
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    });
    checkMatch();
};

function checkMatch() {
    const childNodes = playground.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if(!li.classList.contains("seized")) {
                matched = false;
            };
        });
        if(matched) {
            child.remove();
            prependNewLine();
            score++;
            scoreDisplay.innerText = score;
        }
    });
    generateNewBlock();
}

function generateNewBlock() { // 새로운 블럭 생성
    clearInterval(downInterval);
    // downInterval = setInterval(() => {
    //     moveBlock("top", 1); // 위로 가는 모양을 1씩 증가
    // }, duration);

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length);
    // console.log(blockArray[randomIndex][0]);

    movingItem.type = blockArray[randomIndex][0];
    movingItem.top = 0;
    movingItem.left = 3;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    renderBlocks();
};

function checkEmpty(target) {
    if(!target || target.classList.contains("seized")) { // seized라는 클래스가 있는지 없는지 확인
        return false;
    };
    return true;
};

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount; // left, top
    renderBlocks(moveType);
};

function changeDirection() {
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    renderBlocks();
};

function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock("top", 1)
    }, 10)
};

function showGameoverText() {
    gameText.style.display = "flex";
};

// 방향키를 읽혀서 위치를 움직이게, evenr handling
document.addEventListener("keydown", e => {
    switch(e.keyCode) {
        case 39: // right key
            moveBlock("left", 1); // +1
            break;
        case 37: // left
            moveBlock("left", -1);
            break;
        case 40: // bottom
            moveBlock("top", 1);
            break;
        case 38: 
            changeDirection();
            break;
        case 32: // space bar
            dropBlock();
        default:
            break;
    };
    // console.log(e);
});

restartButton.addEventListener("click", () => {
    playground.innerHTML = "";
    gameText.style.display = "none";
    scoreDisplay.innerText = 0;
    init();
});