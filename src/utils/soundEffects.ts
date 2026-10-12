/**
 * Cozy Campfire & Pine Breeze Synthesizer via Web Audio API
 * Generates natural camp crackle and wind sounds locally without any external MP3 dependencies.
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isAudioRunning = false;
let windNode: AudioNode | null = null;
let crackleTimer: number | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.35, audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function startCampfireAmbience(volume = 0.35): boolean {
  try {
    const ctx = getAudioContext();
    if (!masterGain) return false;

    masterGain.gain.setValueAtTime(volume, ctx.currentTime);

    // 1. Create soft wind breeze noise (filtered pink/brown noise)
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2 + white * 0.05) * 0.11;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(380, ctx.currentTime);
    filter.Q.setValueAtTime(1.2, ctx.currentTime);

    const windGain = ctx.createGain();
    windGain.gain.setValueAtTime(0.18, ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(windGain);
    windGain.connect(masterGain);
    whiteNoise.start();
    windNode = whiteNoise;

    // 2. Schedule gentle campfire wood pops & crackles
    const scheduleCrackle = () => {
      if (!isAudioRunning || !audioCtx) return;

      const now = audioCtx.currentTime;
      // High frequency burst
      const osc = audioCtx.createOscillator();
      const popGain = audioCtx.createGain();
      const bandpass = audioCtx.createBiquadFilter();

      const baseFreq = 800 + Math.random() * 2500;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);

      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(baseFreq, now);

      const popVol = 0.05 + Math.random() * 0.18;
      popGain.gain.setValueAtTime(popVol, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(bandpass);
      bandpass.connect(popGain);
      if (masterGain) {
        popGain.connect(masterGain);
      }

      osc.start(now);
      osc.stop(now + 0.05);

      // Random next crackle interval (between 80ms and 500ms)
      const nextDelay = 70 + Math.random() * 450;
      crackleTimer = window.setTimeout(scheduleCrackle, nextDelay);
    };

    isAudioRunning = true;
    scheduleCrackle();
    return true;
  } catch (err) {
    console.error('Audio synthesizer error:', err);
    return false;
  }
}

export function stopCampfireAmbience(): void {
  isAudioRunning = false;
  if (crackleTimer) {
    clearTimeout(crackleTimer);
    crackleTimer = null;
  }
  if (windNode) {
    try {
      (windNode as AudioBufferSourceNode).stop();
      (windNode as AudioBufferSourceNode).disconnect();
    } catch {
      // Ignore if already stopped
    }
    windNode = null;
  }
}

export function setAmbienceVolume(vol: number): void {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
  }
}
