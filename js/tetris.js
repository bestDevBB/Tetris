// DOM
const playground = document.querySelector(".playground > ul");

// Setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500; // 블럭이 떨어지는 시간
let downInterval;
let tempMovingItem; // movingItem이 실행되기 전에 잠깐 담아두는 용도

const BLOCKS = {
    tree: [
        [[0, 0], [0, 1], [1, 1], [1, 0]],
        [],
        [],
        [],
    ]
};

const movingItem = { // 블럭의 타입과 좌표 등의 정보
    type: "tree",
    direction: 0, // 화살표 윗 방향키 눌렀을 때 모양 변경
    top: 0, // 좌표 기준으로 어디까지 내려와있는지, 내려가야하는지 표현
    left: 0, // 좌우 값
};

init();

// functions
function init() { // 화면(script)가 처음 호출이 될 때
    tempMovingItem = { ...movingItem }; // movingItem을 담아둠
    // 전개 구문을 사용하면 값만 가져옴. movingItem 자체를 보는 게 아니라 값만 봄!
    // 이렇게 하면 movingItem의 값이 변경이 되도 tempMovingItem의 값은 변경되지 않음

    for(let i = 0; i < GAME_ROWS; i++) {
        prependNewLine();
    };
    renderBlocks();
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

function renderBlocks() { // 블럭을 선택해서 값에 맞는 모양대로 그림을 그려줌
    const { type, direction, top, left }  = tempMovingItem;
    // tempMovingItem.type; 과 같음

    BLOCKS[type][direction].forEach(block => { // type이 tree가 됨
        const x = block[0]; // 좌표의 첫 번째 값, ul의 li값
        const y = block[1]; // li의 row값
        // console.log({ playground });
        const target = playground.childNodes[y].childNodes[0].childNodes[x];
        target.classList.add(type); // target이 li가 됨
    });
};