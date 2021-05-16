let cv, ctx, gameTimeId;
let position = { x: 0, y: 0 };
let isMouseDown = false;
let w = window.innerWidth - 2,
  h = window.innerHeight - 2;

let draw_path = [];

let path_data = "/res/data.json";
let path_data01 = "/res/data01.json";
let path_host =
  "https://raw.githubusercontent.com/khangtran/battle-moji/master/public";

var touch_reconition, symbol_data;

let Time = { deltaTime: 0, time: 0 };
let gameStart = false;
let main_thread_id, create_sy_id;
let wave_data = [],
  level = 1,
  count_sy;
let swapn_list = [];

import { GSprite } from "./GameScript";
import GameSymbol from "./symbol";

class GameCore {

  gamedata = {
    bonus: 0,
    combo: 0,
    accurate: 0,
    miss: 0,
    exp: 0
  }

  loadFromServer(symbols) {

  }

  async loaded() {
    // this.setup_ui();
    this.setup_canvas();
    touch_reconition = await this.loadFile(path_data);
    symbol_data = await this.loadFile(path_data01);

    console.log("data", touch_reconition);
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
      let result = this.recognitionToObject(sy);
      HelperTextElement("lb-detect", `${result.key}:${result.percent}:${sy.length}`);
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

    main_thread_id = setInterval(() => {
      if (swapn_list.length === 0 && Time.time > 5) {
        this.endGame();
      }
      Time.time += 33 / 1000;

      let time = format_time(Time.time);
      HelperTextElement("lb-time", time);
    }, 33);
  }

  startGame() {
    this.resetGame()

    gameStart = true;

    wave_data = this.createLevel(1, 3);
    create_sy_id = this.spawnSymbol(2500);
    count_sy = wave_data.length - 1;

    this.main_thread();

    console.log("start_game", count_sy);
  }

  endGame() {

    gameStart = false;
    clearInterval(main_thread_id);
    clearInterval(create_sy_id);
    let accurate = wave_data.length - this.gamedata.miss
    let percent = (accurate / wave_data.length) * 100
    this.gamedata.accurate = percent.toFixed(2)

    this.gamedata.exp = this.gamedata.combo * 2 + this.gamedata.bonus * 0.25 + this.gamedata.accurate * 3
    this.gamedata.bonus = this.gamedata.bonus * 0.15

    this.onEndGameDelegate && this.onEndGameDelegate()
    console.log("end_game");
  }

  resetGame() {
    count_sy = 0;

    this.gamedata = {
      accurate: 0,
      combo: 0,
      bonus: 0,
      miss: 0,
    }

    clearInterval(create_sy_id);
    this.clearFrame(0);
  }

  createLevel(level, maxQt) {
    let list = [];
    let percent_hp_hight = 10 + level / 3;

    for (var i = 0; i < maxQt; i++) {
      let rand_pos = MathRandom(10, w - 30);
      let rand = MathRandom(0, 3);
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

    id = setInterval(() => {
      if (count_sy === 0) {
        clearInterval(id);
      }

      let sy_data = wave_data[count_sy];
      let path_img = path_host.concat(sy_data.img);

      let sy = new GameSymbol(sy_data.name,
        sy_data.speed,
        sy_data.position,
        sy_data.hp,
        sy_data.score,
        sy_data.img,
        30, 30)

      sy.onUpdate = () => {

        if (sy.position.y > h) {
          sy.sprite.destroy()
          this.gamedata.miss += 1
          let x = swapn_list.findIndex(item => item === sy);
          swapn_list.splice(x, 1);
        }
      }

      count_sy -= 1;
      swapn_list.push(sy);
      HelperTextElement("lb-level", `Level ${level}:${count_sy + 1}`);
    }, spawn_time);

    return id;
  }

  detectSymbol(array) {
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
    return result;
  }

  recognitionToObject(array) {
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
        // console.log(item.key, c.length, array.length, max, match, percent);

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

  lastMuti = 0
  killSymbol(x) {

    let remap = swapn_list.map((item, index) => {
      return { ...item, index: index };
    });
    let ar_mutilkill = remap.filter(item => item.name === x.key);
    if (ar_mutilkill.length === 0) return;

    this.gamedata.bonus += ar_mutilkill[0].score * ar_mutilkill.length;
    let str_x = ar_mutilkill.length === 1 ? "" : `x${ar_mutilkill.length}`;

    HelperTextElement("lb-mutil", str_x)
    HelperTextElement("lb-score", `Điểm    ${this.gamedata.bonus}`);
    HelperTextElement("lb-detect", `${ar_mutilkill[0].name} : ${x.percent}%`);

    if (this.lastMuti < ar_mutilkill.length)
      this.lastMuti = ar_mutilkill.length

    setTimeout(() => {
      HelperTextElement("lb-mutil", "");
    }, 1000);

    console.log(">> mutil kill", ar_mutilkill.length);
    console.log(">> current list", swapn_list.length);

    for (var i = 0; i < ar_mutilkill.length; i++) {
      let index = ar_mutilkill[i].index;
      let item = swapn_list[index];
      item.takeDame(1);
      swapn_list.splice(index, 1);
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

function HelperFloatText(id, from, to, duration) {
  let floatID;
  let lb = HelperElement(id)
  let delta = from
  floatID = setInterval(() => {
    if (delta > to) clearInterval(floatID)
    delta += from
    lb.textContent = delta
  }, from / duration)
}

function HelperButton(id, press) {
  let el = document.getElementById(id);
  el.onclick = () => {
    press();
  };
}

function showLobby(isShow) {
  let ui = document.getElementById("ui-lobby");
  ui.hidden = !isShow;
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

var GameCoreInstance = new GameCore()
export default GameCoreInstance
