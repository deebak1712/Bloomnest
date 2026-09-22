// Web Audio API browser-synthesized restorative sleep soundscapes
// Zero external asset dependencies - generates gentle harmonic frequencies and pink noise locally

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let activeNodes: { stop?: () => void; disconnect: () => void }[] = [];
let isPlaying = false;
let currentMode: string | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playMaternalSleepSoundscape(
  mode: "delta_432hz" | "womb_heartbeat" | "gentle_rain",
  volume = 0.25
): void {
  try {
    stopMaternalSleepSoundscape();
    const ctx = getAudioContext();
    currentMode = mode;
    isPlaying = true;

    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(Math.min(0.5, volume), ctx.currentTime + 2.0);
    masterGain.connect(ctx.destination);

    if (mode === "delta_432hz") {
      // 432 Hz Warm Harmonic Binaural Drone with 2.5 Hz Delta Beat
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const subOsc = ctx.createOscillator();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(432.0, ctx.currentTime); // Fundamental 432Hz

      osc2.type = "sine";
      osc2.frequency.setValueAtTime(434.5, ctx.currentTime); // 2.5Hz Delta frequency difference

      subOsc.type = "sine";
      subOsc.frequency.setValueAtTime(216.0, ctx.currentTime); // Lower sub-octave warmth

      const lowpass = ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(800, ctx.currentTime);

      const subGain = ctx.createGain();
      subGain.gain.setValueAtTime(0.4, ctx.currentTime);

      osc1.connect(lowpass);
      osc2.connect(lowpass);
      subOsc.connect(subGain);
      subGain.connect(lowpass);

      lowpass.connect(masterGain);

      osc1.start();
      osc2.start();
      subOsc.start();

      activeNodes.push(osc1, osc2, subOsc, lowpass, subGain);
    } else if (mode === "gentle_rain") {
      // Pink noise synthesis for soft rainfall
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
        b6 = white * 0.115926;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const rainFilter = ctx.createBiquadFilter();
      rainFilter.type = "lowpass";
      rainFilter.frequency.setValueAtTime(1200, ctx.currentTime);

      whiteNoise.connect(rainFilter);
      rainFilter.connect(masterGain);

      whiteNoise.start();
      activeNodes.push(whiteNoise, rainFilter);
    } else if (mode === "womb_heartbeat") {
      // Warm low rhythmic pulse reminiscent of maternal uterine blood flow
      const pulseOsc = ctx.createOscillator();
      pulseOsc.type = "sine";
      pulseOsc.frequency.setValueAtTime(68, ctx.currentTime); // 68 Hz low hum

      const pulseFilter = ctx.createBiquadFilter();
      pulseFilter.type = "lowpass";
      pulseFilter.frequency.setValueAtTime(150, ctx.currentTime);

      // Tremolo LFO at 65 BPM (maternal resting pulse)
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(65 / 60, ctx.currentTime); // ~1.08 Hz

      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(0.5, ctx.currentTime);

      const vca = ctx.createGain();
      vca.gain.setValueAtTime(0.5, ctx.currentTime);

      lfo.connect(vca.gain);
      pulseOsc.connect(pulseFilter);
      pulseFilter.connect(vca);
      vca.connect(masterGain);

      pulseOsc.start();
      lfo.start();
      activeNodes.push(pulseOsc, lfo, pulseFilter, lfoGain, vca);
    }
  } catch (err) {
    console.warn("Web Audio ambient player notice:", err);
  }
}

export function stopMaternalSleepSoundscape(): void {
  if (!audioCtx || !isPlaying) return;

  try {
    if (masterGain) {
      masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.0);
    }

    setTimeout(() => {
      activeNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch (_) {}
      });
      activeNodes = [];
      isPlaying = false;
      currentMode = null;
    }, 1100);
  } catch (err) {
    isPlaying = false;
    currentMode = null;
  }
}

export function getMaternalSoundscapeStatus(): { isPlaying: boolean; mode: string | null } {
  return { isPlaying, mode: currentMode };
}
