"use client";

import { useCallback, useRef, useEffect } from "react";

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!sharedAudioContext) {
    try {
      sharedAudioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch {
      return null;
    }
  }

  // Resume if suspended (browser autoplay policy)
  if (sharedAudioContext.state === "suspended") {
    sharedAudioContext.resume();
  }

  return sharedAudioContext;
}

export function useSound() {
  const isUnmountedRef = useRef(false);

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  // Son de clic "designer" (sinus doux avec jitter)
  const playClick = useCallback(() => {
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const jitter = 0.95 + Math.random() * 0.1; // +/- 5% variation

      osc.type = "sine";
      osc.frequency.setValueAtTime(1200 * jitter, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800 * jitter, audioCtx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.03);
    } catch {
      // Silently fail if audio context unavailable
    }
  }, []);

  // Son d'intro (tick "design" composite)
  const playIntroTick = useCallback((freq: number) => {
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const jitter = 0.98 + Math.random() * 0.04;

      // Couche 1 : Le Corps (Sine douce)
      const oscBody = audioCtx.createOscillator();
      const gainBody = audioCtx.createGain();
      oscBody.type = "sine";
      oscBody.frequency.setValueAtTime(freq * 0.5 * jitter, audioCtx.currentTime);
      // Glissando très subtil vers le bas
      oscBody.frequency.exponentialRampToValueAtTime(freq * 0.4 * jitter, audioCtx.currentTime + 0.1);

      gainBody.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gainBody.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);

      // Couche 2 : L'Attaque (Ping cristallin)
      const oscPing = audioCtx.createOscillator();
      const gainPing = audioCtx.createGain();
      oscPing.type = "sine";
      oscPing.frequency.setValueAtTime(freq * 4 * jitter, audioCtx.currentTime);

      gainPing.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gainPing.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);

      oscBody.connect(gainBody);
      gainBody.connect(audioCtx.destination);
      oscPing.connect(gainPing);
      gainPing.connect(audioCtx.destination);

      oscBody.start();
      oscBody.stop(audioCtx.currentTime + 0.1);
      oscPing.start();
      oscPing.stop(audioCtx.currentTime + 0.02);
    } catch {
      // Silently fail
    }
  }, []);

  // Son mécanique raffiné (avec jitter sur la fréquence et le mix)
  const playMechanicalClack = useCallback((freq: number, dur: number) => {
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const jitter = 0.9 + Math.random() * 0.2; // +/- 10% variation

      // Tonal part
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq * jitter, audioCtx.currentTime);
      oscGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

      // Soft noise part
      const bufferSize = audioCtx.sampleRate * dur;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.05;
      }
      const noiseSource = audioCtx.createBufferSource();
      noiseSource.buffer = buffer;
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.1 * jitter, audioCtx.currentTime);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);

      osc.connect(oscGain);
      oscGain.connect(audioCtx.destination);
      noiseSource.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + dur);
      noiseSource.start();
    } catch {
      // Silently fail if audio context unavailable
    }
  }, []);

  // Son de défilement très subtil (avec micro-jitter)
  const playScrollTick = useCallback(() => {
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      const jitter = 0.95 + Math.random() * 0.1;

      osc.type = "sine";
      osc.frequency.setValueAtTime(3000 * jitter, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(2000 * jitter, audioCtx.currentTime + 0.01);

      gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.01);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.01);
    } catch {
      // Silently fail if audio context unavailable
    }
  }, []);

  // Son de sortie/fermeture (sinus descendant doux)
  const playExit = useCallback(() => {
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      // Fréquence descendante pour marquer la fermeture
      osc.frequency.setValueAtTime(300, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.08);
    } catch {
      // Silently fail
    }
  }, []);

  // Son pour le PDF (double-ton ascendant doux)
  const playPdfSave = useCallback(() => {
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const playTone = (freq: number, start: number, vol: number) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, audioCtx.currentTime + start + 0.06);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + start + 0.06);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + start);
        osc.stop(audioCtx.currentTime + start + 0.06);
      };

      playTone(800, 0, 0.05);
      playTone(1200, 0.03, 0.04);
    } catch {
      // Silently fail
    }
  }, []);

  return { playClick, playIntroTick, playMechanicalClack, playScrollTick, playExit, playPdfSave };
}
