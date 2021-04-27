let cv, ctx, gameTimeId;
let position = { x: 0, y: 0 };
let isMouseDown = false;
let w = window.innerWidth - 2,
  h = window.innerHeight - 2;

let draw_path = [];

let path_data = "/res/data.json";
let path_data01 = "/res/data01.json";
var touch_reconition, symbol_data;

let Time = { deltaTime: 0, time: 0 };
let gameStart = false;
let main_thread_id, create_sy_id;
let level_symbol = [],
  level = 1,
  count_sy;
let swapn_list = [];
let score = 0;

import GameSymbol from "./symbol";

class GameCore {
  async loaded() {
    this.setup_ui();
    this.setup_canvas();
    // draw_backgroud()
    touch_reconition = await this.loadFile(path_data);
    symbol_data = await this.loadFile(path_data01);
    console.log("data", touch_reconition);

    this.drawTest();
  }

  drawTest() {
    // let centerX = this.position.x + 15;
    let img = new Image();
    img.onload = () => {
      ctx.beginPath();
      ctx.drawImage(img, 10, 10, 30, 30);
      ctx.closePath();

      console.log(">> test");
    };
    img.onerror = e => {
      console.log(">> img errror", e);
    };
    img.src = "/res/symbol_01.png";
  }

  setup_ui() {
    HelperButton("bt-play", () => {
      this.startGame();
    });
  }

  setup_canvas() {
    cv = document.getElementById("canvas");
    cv.width = w;
    cv.height = h;

    ctx = cv.getContext("2d");
    window.ctx = ctx;
    cv.onmousemove = ev => {
      this.draw(ev);
    };

    cv.onmousedown = ev => {
      position = this.mouseToCanvas(ev);
      isMouseDown = true;
    };

    cv.onmouseup = ev => {
      position = this.mouseToCanvas(ev);
      isMouseDown = false;

      let sy = this.detectSymbol(draw_path);
      console.log(`result`, JSON.stringify(sy));
      let result = this.recogintionToObject(sy);
      HelperTextElement(
        "lb-detect",
        `${result.key}:${result.percent}:${sy.length}`
      );
      result.percent > 80 && this.killSymbol(result);

      this.clearFrame(100);
    };

    cv.ontouchstart = ev => {
      ev.preventDefault();
      let lineBottom = h / 3;
      if (ev.touches[0].clientY < h - lineBottom) {
        // alert draw area
        ctx.beginPath();
        ctx.lineWidth = "1";
        ctx.strokeStyle = "red";
        ctx.rect(0, h - lineBottom, w, lineBottom);
        ctx.stroke();
        ctx.closePath();
        return;
      }
      position = this.mouseToCanvas(ev);
      isMouseDown = true;
    };

    cv.ontouchmove = ev => {
      ev.preventDefault();
      this.draw(ev);
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
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.moveTo(position.x, position.y);
    position = this.mouseToCanvas(e);
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
      if ((swapn_list.length === 0 && Time.time > 2) || count_sy === 0) {
        this.endGame();
      }
      Time.time += 33 / 1000;

      let time = format_time(Time.time);
      HelperTextElement("lb-time", time);
    }, 33);

    setInterval(() => {
      console.log("list", swapn_list.length);
    }, 1000);
  }

  startGame() {
    level_symbol = this.createLevel(1, 10);
    create_sy_id = this.spawnSymbol(1500);
    count_sy = level_symbol.length - 1;

    showLobby(true);
    gameStart = true;
    this.main_thread();

    console.log("start_game", swapn_list, count_sy);
  }

  endGame() {
    setTimeout(() => {
      showLobby(true);
    }, 1000);
    gameStart = false;
    clearInterval(main_thread_id);
    clearInterval(create_sy_id);
    console.log("end_game");
  }

  resetGame() {
    count_sy = 0;
    clearInterval(create_sy_id);
    this.clearFrame(0);
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
    let id;
    console.log("1.test");
    id = setInterval(() => {
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
      console.log("2.test");
    }, spawn_time);

    return id;
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

    touch_reconition.forEach(item => {
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
    if (array.length === 0) return;
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
    console.log(">> loadfile", path);
    let response = await fetch(path);
    let result = await response.json();
    return result;
  }
}

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

function format_time(ms) {
  let total_minutes = parseInt(Math.floor(ms / 60));

  let s = parseInt(ms % 60);
  let m = parseInt(total_minutes % 60);

  return `${m > 9 ? m : `0${m}`}:${s > 9 ? s : `0${s}`}`;
}

export default new GameCore();
