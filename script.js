const keyButtons = new Map();

const themeOptions = document.querySelectorAll(".theme-option");
const themeSwitcher = document.querySelector(".theme-switcher");
const themeNames = ["theme-bluish", "theme-sand", "theme-cyberpunk", "theme-cute", "theme-old-money"];
const themeStorageKey = "keyboard-theme";
const masterVolume = 2;

const soundThemes = {
  "theme-bluish": {
    normal: {
      bodyType: "triangle",
      bodyStart: 210,
      bodyEnd: 120,
      bodyGain: 0.09,
      bodyDuration: 0.05,
      clickType: "square",
      clickStart: 2000,
      clickEnd: 900,
      clickGain: 0.025,
      clickDuration: 0.02,
      filter: 2200,
      noiseGain: 0.006,
      noiseDuration: 0.018,
    },
    special: {
      bodyStart: 180,
      bodyEnd: 100,
      bodyGain: 0.1,
      bodyDuration: 0.06,
      clickStart: 1700,
      clickGain: 0.02,
      filter: 1800,
      noiseGain: 0.004,
    },
    space: {
      bodyStart: 150,
      bodyEnd: 82,
      bodyGain: 0.12,
      bodyDuration: 0.075,
      clickStart: 1300,
      clickEnd: 650,
      clickGain: 0.018,
      clickDuration: 0.028,
      filter: 1400,
      noiseGain: 0.003,
      noiseDuration: 0.024,
    },
  },
  "theme-sand": {
    normal: {
      bodyType: "sine",
      bodyStart: 185,
      bodyEnd: 105,
      bodyGain: 0.075,
      bodyDuration: 0.055,
      clickType: "triangle",
      clickStart: 1400,
      clickEnd: 700,
      clickGain: 0.016,
      clickDuration: 0.026,
      filter: 1300,
      noiseGain: 0.004,
      noiseDuration: 0.018,
    },
    special: {
      bodyStart: 160,
      bodyEnd: 90,
      bodyGain: 0.09,
      bodyDuration: 0.065,
      clickStart: 1200,
      clickGain: 0.013,
      filter: 1100,
      noiseGain: 0.003,
    },
    space: {
      bodyStart: 135,
      bodyEnd: 74,
      bodyGain: 0.1,
      bodyDuration: 0.08,
      clickStart: 950,
      clickEnd: 520,
      clickGain: 0.012,
      clickDuration: 0.03,
      filter: 900,
      noiseGain: 0.002,
      noiseDuration: 0.024,
    },
  },
  "theme-cyberpunk": {
    normal: {
      bodyType: "square",
      bodyStart: 260,
      bodyEnd: 150,
      bodyGain: 0.08,
      bodyDuration: 0.045,
      clickType: "triangle",
      clickStart: 2600,
      clickEnd: 1200,
      clickGain: 0.02,
      clickDuration: 0.018,
      filter: 2600,
      noiseGain: 0.005,
      noiseDuration: 0.014,
    },
    special: {
      bodyStart: 220,
      bodyEnd: 125,
      bodyGain: 0.09,
      bodyDuration: 0.055,
      clickStart: 2200,
      clickGain: 0.018,
      filter: 2200,
      noiseGain: 0.004,
    },
    space: {
      bodyStart: 180,
      bodyEnd: 95,
      bodyGain: 0.11,
      bodyDuration: 0.07,
      clickStart: 1800,
      clickEnd: 900,
      clickGain: 0.016,
      clickDuration: 0.025,
      filter: 1800,
      noiseGain: 0.003,
      noiseDuration: 0.018,
    },
  },
  "theme-cute": {
    normal: {
      bodyType: "sine",
      bodyStart: 310,
      bodyEnd: 180,
      bodyGain: 0.06,
      bodyDuration: 0.04,
      clickType: "triangle",
      clickStart: 2400,
      clickEnd: 1100,
      clickGain: 0.012,
      clickDuration: 0.018,
      filter: 2400,
      noiseGain: 0.003,
      noiseDuration: 0.012,
    },
    special: {
      bodyStart: 270,
      bodyEnd: 155,
      bodyGain: 0.07,
      bodyDuration: 0.05,
      clickStart: 2000,
      clickGain: 0.011,
      filter: 2000,
      noiseGain: 0.0025,
    },
    space: {
      bodyStart: 215,
      bodyEnd: 125,
      bodyGain: 0.085,
      bodyDuration: 0.065,
      clickStart: 1500,
      clickEnd: 760,
      clickGain: 0.01,
      clickDuration: 0.024,
      filter: 1500,
      noiseGain: 0.002,
      noiseDuration: 0.018,
    },
  },
  "theme-old-money": {
    normal: {
      bodyType: "triangle",
      bodyStart: 165,
      bodyEnd: 95,
      bodyGain: 0.08,
      bodyDuration: 0.06,
      clickType: "sine",
      clickStart: 1200,
      clickEnd: 620,
      clickGain: 0.012,
      clickDuration: 0.025,
      filter: 1100,
      noiseGain: 0.0025,
      noiseDuration: 0.018,
    },
    special: {
      bodyStart: 145,
      bodyEnd: 82,
      bodyGain: 0.09,
      bodyDuration: 0.07,
      clickStart: 1050,
      clickGain: 0.01,
      filter: 950,
      noiseGain: 0.002,
    },
    space: {
      bodyStart: 125,
      bodyEnd: 68,
      bodyGain: 0.105,
      bodyDuration: 0.085,
      clickStart: 880,
      clickEnd: 460,
      clickGain: 0.009,
      clickDuration: 0.028,
      filter: 800,
      noiseGain: 0.0015,
      noiseDuration: 0.02,
    },
  },
};

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

function registerButton(key, button) {
  const normalizedKey = key.toLowerCase();
  const buttons = keyButtons.get(normalizedKey) ?? [];

  buttons.push(button);
  keyButtons.set(normalizedKey, buttons);
}

function getCurrentThemeName() {
  return themeNames.find((themeName) => document.body.classList.contains(themeName)) ?? themeNames[0];
}

function getSoundVariant(button) {
  if (!button) {
    return "normal";
  }

  const key = (button.dataset.code ?? button.dataset.key ?? "").toLowerCase();
  const keyCap = button.querySelector(".keyboard-key");
  const label = (keyCap?.dataset.label ?? "").toLowerCase();

  if (key === "space" || label === "__") {
    return "space";
  }

  if (
    key === "enter" ||
    key === "backspace" ||
    key === "tab" ||
    key === "capslock" ||
    key === "shiftleft" ||
    key === "shiftright" ||
    key === "pageup" ||
    key === "pagedown" ||
    key === "printscreen" ||
    key === "pause" ||
    key === "delete" ||
    key === "home" ||
    key === "end" ||
    key === "controlleft" ||
    key === "controlright" ||
    key === "option" ||
    key === "metaright" ||
    key === "metaleft" ||
    label === "fn"
  ) {
    return "special";
  }

  return "normal";
}

function createNoiseBuffer(context) {
  const length = Math.max(1, Math.floor(context.sampleRate * 0.03));
  const buffer = context.createBuffer(1, length, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < length; i += 1) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  }

  return buffer;
}

function applySoundLayer(context, now, destination, settings) {
  const body = context.createOscillator();
  const bodyGain = context.createGain();
  const bodyFilter = context.createBiquadFilter();

  body.type = settings.bodyType;
  body.frequency.setValueAtTime(settings.bodyStart, now);
  body.frequency.exponentialRampToValueAtTime(settings.bodyEnd, now + settings.bodyDuration);

  bodyFilter.type = "lowpass";
  bodyFilter.frequency.setValueAtTime(settings.filter, now);

  bodyGain.gain.setValueAtTime(settings.bodyGain * masterVolume, now);
  bodyGain.gain.exponentialRampToValueAtTime(0.001, now + settings.bodyDuration);

  body.connect(bodyFilter);
  bodyFilter.connect(bodyGain);
  bodyGain.connect(destination);
  body.start(now);
  body.stop(now + settings.bodyDuration);

  const click = context.createOscillator();
  const clickGain = context.createGain();

  click.type = settings.clickType;
  click.frequency.setValueAtTime(settings.clickStart, now);
  click.frequency.exponentialRampToValueAtTime(settings.clickEnd, now + settings.clickDuration);

  clickGain.gain.setValueAtTime(settings.clickGain * masterVolume, now);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + settings.clickDuration);

  click.connect(clickGain);
  clickGain.connect(destination);
  click.start(now);
  click.stop(now + settings.clickDuration);

  const noise = context.createBufferSource();
  const noiseGain = context.createGain();
  const noiseFilter = context.createBiquadFilter();

  noise.buffer = createNoiseBuffer(context);
  noiseFilter.type = "bandpass";
  noiseFilter.frequency.setValueAtTime(settings.filter * 0.9, now);
  noiseFilter.Q.setValueAtTime(0.8, now);

  noiseGain.gain.setValueAtTime(settings.noiseGain * masterVolume, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + settings.noiseDuration);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(destination);
  noise.start(now);
  noise.stop(now + settings.noiseDuration);
}

async function playMechanicalClick(button) {
  audioContext ??= new AudioContext();

  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  const theme = soundThemes[getCurrentThemeName()] ?? soundThemes["theme-bluish"];
  const variant = getSoundVariant(button);
  const settings = { ...theme.normal, ...(theme[variant] ?? {}) };
  const now = audioContext.currentTime;

  applySoundLayer(audioContext, now, audioContext.destination, settings);
}

function updateThemeHighlight() {
  const activeOption = document.querySelector(".theme-option.is-active");

  if (!activeOption || !themeSwitcher) {
    return;
  }

  const switcherRect = themeSwitcher.getBoundingClientRect();
  const optionRect = activeOption.getBoundingClientRect();

  themeSwitcher.style.setProperty("--theme-highlight-width", `${optionRect.width}px`);
  themeSwitcher.style.setProperty("--theme-highlight-x", `${optionRect.left - switcherRect.left - 4}px`);
}

function applyTheme(theme, persist = true) {
  themeNames.forEach((themeName) => document.body.classList.remove(themeName));
  document.body.classList.add(theme);

  themeOptions.forEach((button) => {
    const isActive = button.dataset.theme === theme;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  if (persist) {
    localStorage.setItem(themeStorageKey, theme);
  }

  requestAnimationFrame(updateThemeHighlight);
}

window.addEventListener("keydown", (event) => {
  const pressedButtons = keyButtons.get(event.code.toLowerCase())
    ?? keyButtons.get(event.key.toLowerCase());

  if (pressedButtons) {
    event.preventDefault();
  }

  if (pressedButtons && !event.repeat) {
    pressedButtons.forEach((button) => button.classList.add("is-pressed"));
    void playMechanicalClick(pressedButtons[0]);
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

themeOptions.forEach((option) => {
  option.addEventListener("click", () => {
    applyTheme(option.dataset.theme);
  });
});

const savedTheme = localStorage.getItem(themeStorageKey);
const defaultTheme = themeNames.find((themeName) => document.body.classList.contains(themeName)) ?? themeNames[0];
const initialTheme = themeNames.includes(savedTheme) ? savedTheme : defaultTheme;

applyTheme(initialTheme, false);
window.addEventListener("resize", updateThemeHighlight);
