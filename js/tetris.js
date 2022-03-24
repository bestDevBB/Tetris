const playground = document.querySelector(".playground > ul");

console.log(playground);

for(let i = 0; i < 20; i++) {
    const li = document.createElement("li");
    const ul = document.createElement("ul");
    for(let j = 0; i < 10; j++) {
        const matrix = document.createElement("li");
        ul.prepend(matrix);
    };
    // 10번이 들어간 ul을 li에 넣어줌
    li.prepend(ul);
    playground.prepend(li);
};