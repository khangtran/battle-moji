let cv, ctx, gameTimeId;
let position = { x: 0, y: 0 };
let isMouseDown = false;
let w = window.innerWidth - 2,
  h = window.innerHeight - 2;

let draw_path = [];
var data_sy;

class GameCore {
  loaded() {
    window.onload = async ev => {
      setup_ui();
      setup_canvas();
      // draw_backgroud()

      main_thread();

      data_sy = await loadFile("/res/data.json");
      console.log("data", data_sy);
    };
  }

  setup_ui() {
    HelperButton("bt-play", () => {
      startGame();
    });
  }

  setup_canvas() {
    cv = document.getElementById("canvas");
    cv.width = w;
    cv.height = h;

    ctx = cv.getContext("2d");
    cv.onmousemove = ev => {
      draw(ev);
    };

    cv.onmousedown = ev => {
      position = mouseToCanvas(ev);
      isMouseDown = true;
    };

    cv.onmouseup = ev => {
      position = mouseToCanvas(ev);
      isMouseDown = false;

      let sy = detectSymbol(draw_path);
      console.log(`result`, JSON.stringify(sy));
      let result = recogintionToObject(sy);
      HelperTextElement(
        "lb-detect",
        `${result.key}:${result.percent}:${sy.length}`
      );
      result.percent > 80 && killSymbol(result);

      let txt = HelperElement("text");
      txt.value = JSON.stringify(sy);

      clearFrame(100);
    };

    cv.ontouchstart = ev => {
      ev.preventDefault();

      if (ev.touches[0].clientY < h - 500) {
        // alert draw area
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(0, h - 500, w, 500);
        ctx.stroke();
        ctx.closePath();
        return;
      }
      position = mouseToCanvas(ev);
      isMouseDown = true;
    };

    cv.ontouchmove = ev => {
      ev.preventDefault();
      draw(ev);
    };

    cv.ontouchend = ev => {
      ev.preventDefault();
      cv.onmouseup(ev);
    };
  }

  mouseToCanvas(ev) {
    if (ev.touches && ev.touches.length !== 0) {
      ev.clientX = ev.touches[0].clientX;
      ev.clientY = ev.touches[0].clientY;
    }

    let curx = ev.clientX - cv.offsetLeft;
    let cury = ev.clientY - cv.offsetTop;

    let pos = { x: curx, y: cury };
    return pos;
  }

  draw(e) {
    if (!isMouseDown) return;

    ctx.beginPath();
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.moveTo(position.x, position.y);
    position = mouseToCanvas(e);
    ctx.lineTo(position.x, position.y);

    ctx.stroke();

    draw_path.push(position);
  }

  clearFrame(after) {
    gameTimeId = setTimeout(() => {
      ctx.clearRect(0, 0, w, h);
    }, after);
  }

  main_thread() {
    let qt = 20;

    main_thread_id = setInterval(() => {
      if (level_symbol.length === 0 || count_sy === 0) {
        clearInterval(create_sy_id);
        setTimeout(() => {
          showLobby(false);
        }, 1000);
      }
      Time.time += 33 / 1000;

      HelperTextElement("lb-detect", Time.time);
    }, 33);
  }

  startGame() {
    level_symbol = createLevel(1, 10);
    create_sy_id = spawnSymbol(1500);
    count_sy = level_symbol.length - 1;

    showLobby(true);
    gameStart = true;

    console.log("start_game", level_symbol, count_sy);
  }

  endGame() {
    showLobby(true);
    gameStart = false;

    console.log("end_game", level_symbol, count_sy);
  }

  resetGame() {
    count_sy = 0;
    clearInterval(create_sy_id);
    clearFrame(0);
  }

  createLevel(level, maxQt) {
    let list = [];
    let percent_hp_hight = 10 + level / 3;

    for (var i = 0; i < maxQt; i++) {
      let rand_pos = MathRandom(10, 550);
      let rand = MathRandom(0, 3);
      console.log(">> rand", rand);
      let data = symbol_data[rand];
      data.speed += 0.25 * level;

      let percent_hp = MathRandom(1, 100);
      if (percent_hp < percent_hp_hight) data.hp = MathRandom(1, level);
      let sy = { ...data, position: { x: rand_pos + 30, y: 0 } };
      list.push(sy);
    }
    return list;
  }

  spawnSymbol(spawn_time) {
    let create_sy_id;

    create_sy_id = setInterval(() => {
      let x = level_symbol[count_sy];

      let sy = new GameSymbol(
        x.name,
        x.speed,
        x.position,
        x.hp,
        x.score,
        x.img,
        x.w,
        x.h
      );
      sy.onUpdate = () => {
        if (sy.position.y > h) {
          sy.destroy();

          let x = level_symbol.findIndex(item => item === sy);
          level_symbol.splice(x, 1);
        }
      };
      count_sy -= 1;
      swapn_list.push(sy);
      HelperTextElement("lb-level", `Level ${level}:${count_sy}`);
    }, spawn_time);

    return create_sy_id;
  }

  detectSymbol(array) {
    console.log("detect", array);

    let temp = ["x", "l", "t-p", "p-t", "c"];
    let result = [];
    for (var i = 0; i < array.length - 1; i++) {
      let isRight = array[i].x > array[i + 1].x;
      let isDown = array[i].y > array[i + 1].y;

      if (isDown) {
        result.push(temp[1]);
      } else {
        result.push(temp[0]);
      }

      if (isRight) result.push(temp[3]);
      else result.push(temp[2]);
    }

    draw_path = [];
    console.log("detect", result);
    return result;
  }

  recogintionToObject(array) {
    let list_match = [];

    data_sy.forEach(item => {
      let list_tmp = [];
      item.code.forEach(c => {
        let match = 0;

        for (var i = 0; i < c.length; i++) {
          if (i > array.length) break;
          let isMatch = array[i] === c[i];

          if (isMatch) match += 1;
        }

        let max = array.length;
        if (c.length > array.length) max = c.length;

        let percent = (match * 100) / max;
        percent = Number(percent.toFixed(2));
        console.log(item.key, c.length, array.length, max, match, percent);

        list_tmp.push(percent);
        list_tmp.sort();
      });
      let d = { key: item.key, percent: list_tmp[2] };
      list_match.push(d);
    });

    list_match.sort((a, b) => b.percent - a.percent);

    console.log("recognited", list_match[0]);
    return list_match[0];
  }

  killSymbol(x) {
    let remap = swapn_list.map((item, index) => {
      return { ...item, index: index };
    });
    let array = remap.filter(item => item.name === x.key);
    score += array[0].score * array.length;

    let str_x = array.length === 1 ? "" : `x${array.length}`;

    HelperTextElement("lb-score", `Điểm    ${score}`);
    HelperTextElement("lb-mutil", str_x);
    HelperTextElement("lb-detect", `${array[0].name} : ${x.percent}%`);

    console.log(">> array", array);

    for (var i = 0; i < array.length; i++) {
      let index = array[i].index;
      let item = swapn_list[index];
      console.log(">> item.destroy", item, index);
      item.destroy();
      level_symbol.splice(index, 1);
    }
  }

  async loadFile(path) {
    let response = await fetch(path);
    let result = await response.json();
    return result;
  }
}

let Time = { deltaTime: 0, time: 0 };
let gameStart = false;
let main_thread_id;
let level_symbol = [],
  level = 1,
  count_sy;
let swapn_list = [];
let score = 0;
let create_sy_id;
let symbol_data = [
  {
    name: "xuống",
    speed: 8,
    hp: 1,
    score: 100,
    img: "/res/symbol_01.png",
    w: 30,
    h: 30
  },
  {
    name: "lên",
    speed: 12,
    hp: 1,
    score: 200,
    img: "/res/symbol_02.png",
    w: 30,
    h: 30
  },
  {
    name: "trái",
    speed: 10,
    hp: 1,
    score: 150,
    img: "/res/symbol_03.png",
    w: 30,
    h: 30
  },
  {
    name: "phải",
    speed: 8,
    hp: 1,
    score: 100,
    img: "/res/symbol_04.png",
    w: 30,
    h: 30
  }
];

function HelperElement(id) {
  return document.getElementById(id);
}

function HelperTextElement(id, text) {
  let ele = document.getElementById(id);
  ele.textContent = text;
}

function HelperButton(id, press) {
  let el = document.getElementById(id);
  el.onclick = () => {
    press();
  };
}

function showLobby(isShow) {
  let ui = document.getElementById("ui-lobby");
  ui.hidden = isShow;
}

function MathRandom(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function ArrayMax(array) {
  let index = 0;
  let matchest = array[0].percent;
  for (var i = 0; i < array.length - 1; i++) {
    let isMax = matchest > array[i + 1].percent;
    if (isMax) {
      matchest = array[i].percent;
      index = i;
    }
  }
  return array[index];
}

export default new GameCore();
