const keyButtons = new Map();

function registerButton(key, button) {
  const normalizedKey = key.toLowerCase();
  const buttons = keyButtons.get(normalizedKey) ?? [];

  buttons.push(button);
  keyButtons.set(normalizedKey, buttons);
}

document.querySelectorAll(".keyboard-rectangle[data-key], .keyboard-rectangle[data-code]").forEach((button) => {
  const key = (button.dataset.code ?? button.dataset.key).toLowerCase();

  registerButton(key, button);
});

document.querySelectorAll(".keyboard-key").forEach((keyCap) => {
  if (keyCap.dataset.label === "\u2318") {
    registerButton("MetaRight", keyCap.closest(".keyboard-rectangle"));
  }
});

let audioContext;

async function playMechanicalClick() {
  audioContext ??= new AudioContext();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(300, now);
  oscillator.frequency.exponentialRampToValueAtTime(120, now + 0.035);
  filter.frequency.setValueAtTime(3200, now);
  gain.gain.setValueAtTime(1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

  oscillator.connect(filter);
  filter.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.05);
}

window.addEventListener("keydown", (event) => {
  const pressedButtons = keyButtons.get(event.code.toLowerCase())
    ?? keyButtons.get(event.key.toLowerCase());

  if (pressedButtons) {
    event.preventDefault();
  }

  if (pressedButtons && !event.repeat) {
    pressedButtons.forEach((button) => button.classList.add("is-pressed"));
    void playMechanicalClick();
  }
});

window.addEventListener("keyup", (event) => {
  const pressedButtons = keyButtons.get(event.code.toLowerCase())
    ?? keyButtons.get(event.key.toLowerCase());

  if (pressedButtons) {
    event.preventDefault();
    pressedButtons.forEach((button) => button.classList.remove("is-pressed"));
  }
});
