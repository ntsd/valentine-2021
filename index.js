const duration = 500;
const container = document.querySelector(".container");

let grid;
let cols;
let rows;
const maxR = 1;

function playAnimation2() {
  anime({
    targets: ".box:not(.target)",
    easing: "easeInOutSine",
    duration: duration,
    rotateY: 0,
    rotateX: 0,
  });
  anime({
    targets: ".box.target",
    easing: "easeInOutSine",
    duration: duration,
    rotateY: 90,
    rotateX: 90,
    delay: anime.stagger(4, { from: "center" }),
  });
}

function playAnimation() {
  const staggersAnimation = anime
    .timeline({
      targets: ".box.target",
      easing: "easeInOutSine",
      delay: anime.stagger(50),
      loop: true,
      autoplay: false,
    })
    .add({
      translateX: [
        {
          value: anime.stagger("-.1rem", {
            grid: grid,
            from: "center",
            axis: "x",
          }),
        },
        {
          value: anime.stagger(".1rem", {
            grid: grid,
            from: "center",
            axis: "x",
          }),
        },
      ],
      translateY: [
        {
          value: anime.stagger("-.1rem", {
            grid: grid,
            from: "center",
            axis: "y",
          }),
        },
        {
          value: anime.stagger(".1rem", {
            grid: grid,
            from: "center",
            axis: "y",
          }),
        },
      ],
      duration: 1000,
      scale: 0.8,
      delay: anime.stagger(100, { grid: grid, from: "center" }),
    })
    .add({
      translateX: () => anime.random(-10, 10),
      translateY: () => anime.random(-10, 10),
      delay: anime.stagger(8, { from: "last" }),
    })
    .add({
      rotate: anime.stagger([90, 0], { grid: grid, from: "center" }),
      delay: anime.stagger(50, { grid: grid, from: "center" }),
    })
    .add({
      translateX: 0,
      translateY: 0,
      scale: 0.5,
      scaleX: 1,
      rotate: 180,
      duration: 1000,
      delay: anime.stagger(100, { grid: grid, from: "center" }),
    })
    .add({
      scaleY: 1,
      scale: 1,
      delay: anime.stagger(20, { grid: grid, from: "center" }),
    });
  staggersAnimation.play();
}

function draw(r) {
  let nodeIds = [];
  for (let a = 0; a < 6.283; a = a + 0.1 - r / 20) { // a + 0.1 - r / 25
    const x =
      Math.round(r * 16 * Math.pow(Math.sin(a), 3)) + Math.round(cols / 2);
    const y =
      Math.round(
        -r *
          (13 * Math.cos(a) -
            5 * Math.cos(2 * a) -
            2 * Math.cos(3 * a) -
            Math.cos(4 * a))
      ) + Math.round(rows / 2);
    const nodeId = y * cols + x;
    nodeIds.push(nodeId);
    const node = container.childNodes[nodeId];
    if (node) {
      node.classList.add("target");
    }
  }
  return nodeIds;
}

function removeTargets(nodeIds) {
  nodeIds.forEach((nodeId) => {
    const node = container.childNodes[nodeId];
    if (node) {
      node.classList.remove("target");
    }
  });
}

async function animate(radius) {
  for await (let r of radius) {
    const nodeIds = await draw(r);

    // await playAnimation2();

    // await removeTargets(nodeIds);

    await new Promise((r) => setTimeout(r, duration));

    // await playAnimation2();
  }
  await playAnimation();
}

function run() {
  container.innerHTML = '';
  const orient = window.orientation;
  if (orient != null) {
    switch (orient) {
      case -90:
      case 90:
        grid = [80, 45];
        break;
      default:
        grid = [45, 80];
    }
  } else {
    grid = [80, 45];
  }
  
  console.log(orient, grid)
  cols = grid[0];
  rows = grid[1];
  const numberOfElements = cols * rows;
  
  const boxFragment = document.createDocumentFragment();
  for (let i = 0; i < numberOfElements; i++) {
    const box = document.createElement("div");
    box.className = "box";
    boxFragment.appendChild(box);
  }
  
  container.appendChild(boxFragment);
  
  let radius = [];
  for (let r = 0.1; r < maxR; r += 0.1) {
    radius.push(r);
  }
  
  animate(radius);  
}

run();

window.addEventListener("orientationchange", function() {
  run();
}, false);
