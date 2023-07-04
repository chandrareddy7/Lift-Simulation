const inputform = document.getElementById("input-form");
const floorinput = document.getElementById("floor-input");
const liftinput = document.getElementById("lift-input");

const lift = document.querySelector(".lifts");

inputform.addEventListener("submit", generatelifts);

var liftpositions, isliftfree;
var lifts;
function generatelifts(event) {
  var screenwidth = screen.width;
  var floors = parseInt(floorinput.value);
  lifts = parseInt(liftinput.value);
  if (isNaN(floors) || isNaN(lifts) || lifts > floors) {
    const error = document.getElementById("error");
    error.style.color = "red";
    error.innerHTML =
      "No input value or Number of Lifts can't be greater than floors.";
    inputform.reset();
    event.preventDefault();
    return;
  }
  if (screenwidth <= 320 && lifts > 4) {
    const error = document.getElementById("error");
    error.style.color = "red";
    error.innerHTML = "Based on screen size use less than 5 lifts";
    inputform.reset();
    event.preventDefault();
    return;
  }
  event.preventDefault();
  inputform.style.display = "none";
  lift.classList.add("liftsandfloors");
  const floorsdiv = document.getElementById("floors");
  liftpositions = new Array(lifts);
  isliftfree = new Array(lifts);
  for (var i = floors; i >= 0; i--) {
    const floor = document.createElement("div");
    floor.classList.add("floor");
    const floordesc = document.createElement("span");
    floordesc.innerHTML = `${i} floor`;
    const upbtn = document.createElement("button");
    upbtn.innerHTML = "UP";
    upbtn.classList.add(`up-${i}`);
    upbtn.addEventListener("click", liftcall);
    const downbtn = document.createElement("button");
    downbtn.innerHTML = "DOWN";
    downbtn.classList.add(`down-${i}`);
    downbtn.addEventListener("click", liftcall);
    if (i != floors) floordesc.appendChild(upbtn);
    if (i != 0) floordesc.appendChild(downbtn);
    floordesc.classList.add("descfloor");
    floor.appendChild(floordesc);
    floor.style.height = "100px";
    floor.style.outline = "1px solid black";
    const liftarea = document.createElement("div");
    liftarea.classList.add("liftarea");
    if (i == 0) {
      for (let i = 1; i <= lifts; i++) {
        const liftele = document.createElement("div");
        liftele.classList.add(`lift-${i}`);
        liftele.style.display = "flex";
        liftele.style.flexDirection = "row";
        liftele.style.height = "94px";
        liftele.style.width = "50px";
        liftele.style.border = "3px solid red";
        liftele.style.overflow = "hidden";
        const leftdoor = document.createElement("span");
        leftdoor.classList.add(`left-door-${i}`);
        leftdoor.style.width = "50%";
        leftdoor.style.height = "100%";
        leftdoor.style.backgroundColor = "blue";
        leftdoor.style.border = "2px solid black";
        liftele.appendChild(leftdoor);
        const rightdoor = document.createElement("span");
        rightdoor.classList.add(`right-door-${i}`);
        rightdoor.style.width = "50%";
        rightdoor.style.height = "100%";
        rightdoor.style.border = "2px solid black";
        rightdoor.style.backgroundColor = "blue";
        liftele.appendChild(rightdoor);
        liftarea.appendChild(liftele);
        liftpositions[i - 1] = 0;
        isliftfree[i - 1] = true;
      }
    }
    floor.appendChild(liftarea);
    floorsdiv.appendChild(floor);
  }
}

function getnearestlift(floornumber) {
  const dest = floornumber;
  var nearest = Number.MAX_VALUE;
  var nearestliftpos = -1;
  for (let i = 0; i < lifts; i++) {
    if (isliftfree[i] && Math.abs(dest - liftpositions[i]) < nearest) {
      nearest = Math.abs(dest - liftpositions[i]);
      nearestliftpos = i;
    }
  }
  if (nearestliftpos === -1) {
    return nearestliftpos;
  }
  return nearestliftpos + 1;
}

var liftqueue = [];

function processcalls() {
  if (liftqueue.length > 0 && isliftfree.includes(true)) {
    movelift(liftqueue.shift());
    processcalls();
  } else {
    let allbusy = setInterval(() => {
      let liftavailable = isliftfree.includes(true);
      if (liftavailable && liftqueue.length > 0) {
        movelift(liftqueue.shift());
      }
    }, 1000);
    if (liftqueue.length == 0) {
      clearInterval(allbusy);
    }
  }
}

function movelift(floornumber) {
  // const floornumber = liftqueue.shift();
  console.log("called for ", floornumber);
  let nearestlift = parseInt(getnearestlift(floornumber));
  isliftfree[nearestlift - 1] = false;
  var time = 0;
  const nearlift = document.querySelector(`.lift-${nearestlift}`);
  var currpos = parseInt(liftpositions[nearestlift - 1]);
  var move = currpos * 100 + (floornumber - currpos) * 100;
  time = Math.abs(floornumber - currpos) * 2;
  liftpositions[nearestlift - 1] = floornumber;
  nearlift.style.transitionDuration = `${time}s`;
  nearlift.style.transform = `translateY(-${move}px)`;
  setTimeout(() => {
    opendoors(nearestlift);
  }, time * 1000);
  setTimeout(() => {
    isliftfree[nearestlift - 1] = true;
  }, time * 1000 + 5000);
}

function liftcall(e) {
  const callfloor = parseInt(e.target.classList[0].split("-")[1]);
  // if(!liftqueue.includes(callfloor))
  liftqueue.push(callfloor);
  console.log(liftqueue);
  console.log("lift free", isliftfree);
  processcalls();
  // while (liftqueue.length != 0) {
  // const floornumber = liftqueue.shift();
  // let nearestlift = parseInt(getnearestlift(floornumber));
  // isliftfree[nearestlift - 1] = false;
  // var time = 0;
  // const nearlift = document.querySelector(`.lift-${nearestlift}`);
  // var currpos = parseInt(liftpositions[nearestlift - 1]);
  // var move = currpos * 100 + (floornumber - currpos) * 100;
  // time = Math.abs(floornumber - currpos) * 2;
  // liftpositions[nearestlift - 1] = floornumber;
  // nearlift.style.transitionDuration = `${time}s`;
  // nearlift.style.transform = `translateY(-${move}px)`;
  // setTimeout(() => {
  //   opendoors(nearestlift);
  //   setTimeout(() => {
  //     isliftfree[nearestlift - 1] = true;
  //   }, 2500);
  // }, time * 1000);
  // }
}

function opendoors(liftnumber) {
  const leftlift = document.querySelector(`.left-door-${liftnumber}`);
  leftlift.style.transitionDuration = "2.5s";
  leftlift.style.transform = "translateX(-100%)";
  const rightlift = document.querySelector(`.right-door-${liftnumber}`);
  rightlift.style.transitionDuration = "2.5s";
  rightlift.style.transform = "translateX(100%)";
  setTimeout(() => {
    leftlift.style.transitionDuration = "2.5s";
    leftlift.style.transform = "translateX(0%)";
  }, 2500);
  setTimeout(() => {
    leftlift.style.transitionDuration = "2.5s";
    rightlift.style.transform = "translateX(0%)";
  }, 2500);
}

function regenerate() {
  inputform.reset();
  window.location.reload();
}
