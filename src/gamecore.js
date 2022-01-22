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

let gameStart = false;
let patterns = [],
  level = 1,
  count_sy,
  count_wave
let swapn_list = [];

import { Time } from "./GameScript";
import Network from "./network";
import GameSymbol from "./symbol";

class GameCore {
  isPause = false;
  gamedata = {
    bonus: 0,
    combo: 0,
    accurate: 0,
    miss: 0,
    exp: 0
  }

  async prepare(data) {

    touch_reconition = await this.loadFile(path_data);
    symbol_data = await this.loadFile(path_data01);

    let { symbols, duration_reborn_symbol, velocity } = data
    patterns = this.createPattern(symbols)

    this.setupWave()

    console.log("touch reconition v0.1", touch_reconition);
  }

  /**
   * 
   * @param {Array} data 
   * @returns {Array}
   */
  createPattern(data) {
    let patterns = []
    for (var i = 0; i < data.length; i++) {
      let waves = []

      let wave = data[i]
      for (var j = 0; j < wave.length; j++) {
        let code = wave[j]
        let symbol = this.createSymbol(i+1, code)
        waves.push(symbol)
      }
      patterns.push(waves)
      this.game_Progress += wave.length

    }
    this.current_progress = this.game_Progress
    // this.updateProgress(this.game_Progress)
    console.log('patterns', patterns, this.game_Progress)
    return patterns
  }

  lastSpawn = 0
  reborn_symbol_time = 2
  delay_next_wave = 10
  index_wave = 0
  index_symbol = 0

  current_wave = 0
  wave_size = 0
  count_symbol_wave = 0

  setupWave() {
    this.index_symbol = 0
    this.lastSpawn = 0

    this.current_wave = patterns[this.index_wave]
    this.wave_size = this.current_wave.length
    this.count_symbol_wave = this.wave_size
  }

  last_next = 0
  delay_end_game = 0
  isLoadWave = false

  current_progress = 0
  game_Progress = 0

  spawn_symbol() {

    // end game
    if (this.index_wave >= patterns.length - 1) {
      if (swapn_list.length === 0 && gameStart) {
        this.endGame()
        return
      }
    }

    // delay + nextwave
    if (Time.time - this.last_next > this.delay_next_wave && this.isLoadWave) {
      this.index_wave += 1
      this.setupWave()
      this.last_next = Time.time
      this.isLoadWave = false
      console.log('next wave', this.index_wave)
      return
    }

    if (this.index_symbol > this.wave_size - 1) {
      if (this.index_wave < patterns.length - 1 && !this.isLoadWave) {
        this.isLoadWave = true
      }
    }

    if (this.index_symbol >= this.wave_size) return

    if (Time.time - this.lastSpawn > this.reborn_symbol_time && !this.isLoadWave) {
      let posx = MathRandom(10, w - 30)
      let pos = { x: posx, y: 0 }

      let sy_data = this.current_wave[this.index_symbol]
      let sy = new GameSymbol(sy_data.name,
        sy_data.speed,
        pos,
        sy_data.hp,
        sy_data.score,
        sy_data.img,
        30, 30)

      sy.onUpdate = () => {

        if (sy.position.y > h + 50) {
          sy.sprite.destroy()
          this.gamedata.miss += 1
          let x = swapn_list.findIndex(item => item === sy);
          swapn_list.splice(x, 1);
        }
      }

      this.count_symbol_wave -= 1
      this.index_symbol += 1;
      swapn_list.push(sy);

      this.current_progress -= 1
      this.updateProgress(this.current_progress)

      this.lastSpawn = Time.time
    }
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
      this.onActiveSkillDelegate && this.onActiveSkillDelegate(result)
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

  now = 0
  then;
  fps = 60
  interval = 1000 / this.fps
  elapsed = 0

  pause() {
    if (!this.isPause) {
      this.isPause = true
      cancelAnimationFrame(this.frame)
      console.log('pause game')
    }
  }

  frame;
  remainFPS = 3
  countRemain = 2

  gameloop(timeStamp) {

    if (this.isPause) {
      return
    }

    this.now = Date.now()
    this.elapsed = (this.now - this.then)

    this.update()
    if (this.elapsed > this.interval) {

      Time.deltaTime = (this.now - this.then) / 1000 * Time.timeScale
      Time.time += Time.deltaTime

      Time.unscaleDeltaTime = (this.now - this.then) / 1000
      Time.unscaleTime += Time.unscaleDeltaTime

      this.render()

      let time = format_time(Time.unscaleTime);
      HelperTextElement("lb-time", time);

      this.then = this.now
    }

    this.frame = requestAnimationFrame((timeStamp) => this.gameloop(timeStamp))
  }

  update() {
    this.spawn_symbol()

    if (this.countRemain > 0)
      this.countRemain -= Time.deltaTime
    else {
      let _fps = Math.round(1 / this.elapsed * 1000)
      HelperTextElement("lb-fps", `fps: ${_fps}`)

      this.countRemain = 2
    }
  }

  render() {
    for (var i = 0; i < swapn_list.length; i++) {
      let sy = swapn_list[i]
      sy.update()
    }
  }

  startGame() {
    this.resetGame()

    gameStart = true;

    this.then = Date.now()
    this.gameloop();

    console.log("start_game");
  }

  endGame() {
    this.pause()

    gameStart = false;

    let accurate = this.game_Progress - this.gamedata.miss
    let percent = (accurate / patterns.length) * 100
    this.gamedata.accurate = percent.toFixed(2)

    this.gamedata.exp = this.gamedata.combo * 2 + this.gamedata.bonus * 0.25 + this.gamedata.accurate * 3
    this.gamedata.bonus = this.gamedata.bonus * 0.15

    console.log("end_game", this.gamedata);
    this.onEndGameDelegate && this.onEndGameDelegate()
  }

  resetGame() {
    count_sy = 0;
    this.isPause = false
    this.index_wave = 0
    this.isLoadWave = false
    this.gamedata = {
      accurate: 0,
      combo: 0,
      bonus: 0,
      miss: 0,
    }

    this.clearFrame(0);
  }

  updateProgress(value) {
    let max = 200
    let progress = HelperElement('progress')
    progress.style.width = value * max / this.game_Progress
  }

  /**
   * Khởi tạo mảng ký tự rơi xuống
   * @param {*} level Cấp độ ký tự, cấp độ cao tốc độ rơi xuống nhanh
   * @param {*} symbolname Tên mã ký tự
   * @returns {Array} Trả về mảng 
   */
  createSymbol(level, symbolname) {
    let index = symbol_data.findIndex(item => item.name === symbolname)

    let data = symbol_data[index];
    data.speed += 0.5 * level;

    let percent_hp = MathRandom(1, 100);
    let percent_hp_hight = 10 + level / 3;
    if (percent_hp < percent_hp_hight) data.hp = MathRandom(1, level);
    let rand_pos = MathRandom(10, w - 30);
    let sy = { ...data, position: { x: rand_pos + 30, y: 0 } };
    return sy
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
    let mutil_kill = remap.filter(item => item.name === x.key);
    if (mutil_kill.length === 0) return;

    this.gamedata.bonus += mutil_kill[0].score * mutil_kill.length;
    Network.Client.CmdSync({
      matchid: this.matchInfo.id,
      playerid: Network.Client.networkid,
      score: this.gamedata.bonus,
      combo: mutil_kill.length
    })

    let str_x = mutil_kill.length === 1 ? "" : `x${mutil_kill.length}`;

    // HelperTextElement("lb-mutil", str_x)
    // HelperTextElement("lb-score", `Điểm    ${this.gamedata.bonus}`);
    HelperTextElement("lb-detect", `${mutil_kill[0].name} : ${x.percent}%`);

    if (this.lastMuti < mutil_kill.length)
      this.lastMuti = mutil_kill.length

    console.log(">> mutil kill", mutil_kill.length);
    console.log(">> current list", swapn_list.length);

    for (var i = 0; i < mutil_kill.length; i++) {
      let index = mutil_kill[i].index;
      let item = swapn_list[index];
      console.log('item kill', item)
      item.takeDame(1);
    }

    // remove symbol from list
    for (var i = 0; i < mutil_kill.length; i++) {
      let index = mutil_kill[i].index;
      swapn_list.splice(index, 1);
    }
  }

  matchInfo = {
    players: [],
    id: -1,
    status: 'none'
  }

  setMatchInfo(data) {
    this.matchInfo = data
  }

  sync(data) {
    let { playerid, score, combo } = data
    let isMine = true
    if (playerid !== Network.Client.networkid) {
      isMine = false
    }

    this.setScore(isMine, 0, score)
    this.setCombo(isMine, 0, combo)
  }

  async loadFile(path) {
    console.log(">> loadfile", path);
    let response = await fetch(path);
    let result = await response.json();
    return result;
  }

  setScore(isMine, from, to) {
    let mine = 'lb-score'
    if (!isMine)
      mine = mine.concat(' p2')

    // HelperFloatText(mine, from, to, 10)
    HelperTextElement(mine, to)
  }

  setCombo(isMine, from, to) {

    if (to === 1) return

    let mine = 'lb-mutil'
    if (!isMine)
      mine = mine.concat(' p2')
    HelperElement('combo').style.display = 'flex'

    // HelperFloatText(mine, from, to, 100)
    HelperTextElement(mine, to)
    setTimeout(() => {
      HelperElement('combo').style.display = 'none'
    }, 1500);
  }
}

function HelperElement(id) {
  return document.getElementById(id);
}

export function HelperTextElement(id, text) {
  let ele = document.getElementById(id);
  if (!ele) return
  ele.textContent = text;
}

function HelperFloatText(id, from, to, duration) {
  let floatID;
  let lb = HelperElement(id)
  let delta = from

  floatID = setInterval(() => {
    delta += 1
    if (delta >= to) {
      delta = to
      clearInterval(floatID)

      console.log('clear float', floatID)
    }
    lb.textContent = delta
  }, duration)
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

function format_time(ss) {
  // let total_minutes = Math.floor(ms / 60);

  let m = Math.floor(ss / 60);
  let s = parseInt(ss - m * 60)

  return `${m > 9 ? m : `0${m}`}:${s > 9 ? s : `0${s}`}`;
}

var GameCoreInstance = new GameCore()
export default GameCoreInstance
