"use client";

import { useCallback, useRef, useEffect } from "react";
import { ANIMATION } from "@/data/constants";

let sharedAudioContext: AudioContext | null = null;

// Log audio errors only in development
function logAudioError(context: string, error: unknown): void {
  if (process.env.NODE_ENV === "development") {
    console.warn(`[useSound] ${context}:`, error);
  }
}

function checkIsMuted(): boolean {
  if (typeof window === "undefined") return false;
  // Check localStorage preference
  if (localStorage.getItem("soundMuted") === "true") return true;
  // Check prefers-reduced-motion
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  return false;
}

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!sharedAudioContext) {
    try {
      sharedAudioContext = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    } catch (error) {
      logAudioError("Failed to create AudioContext", error);
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
  const lastSoundTime = useRef(0);
  const isMutedRef = useRef(false);

  // Check mute status on mount and listen for changes
  useEffect(() => {
    isMutedRef.current = checkIsMuted();

    const handleMuteChange = () => {
      isMutedRef.current = checkIsMuted();
    };

    window.addEventListener("storage", handleMuteChange);
    // Custom event for same-tab updates
    window.addEventListener("soundMuteChanged", handleMuteChange);

    return () => {
      window.removeEventListener("storage", handleMuteChange);
      window.removeEventListener("soundMuteChanged", handleMuteChange);
    };
  }, []);

  const throttle = (callback: () => void, limit: number = ANIMATION.throttleLimit) => {
    const now = Date.now();
    if (now - lastSoundTime.current < limit) return;
    lastSoundTime.current = now;
    callback();
  };

  useEffect(() => {
    isUnmountedRef.current = false;
    return () => {
      isUnmountedRef.current = true;
    };
  }, []);

  // Son de clic "designer" (sinus doux avec jitter)
  const playClick = useCallback(() => {
    if (isMutedRef.current) return;
    const now = Date.now();
    if (now - lastSoundTime.current < ANIMATION.throttleLimit) return;
    lastSoundTime.current = now;

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
    } catch (error) {
      logAudioError("playClick", error);
    }
  }, []);

  // Son d'intro (tick "design" composite)
  const playIntroTick = useCallback((freq: number) => {
    if (isMutedRef.current) return;
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
    } catch (error) {
      logAudioError("playIntroTick", error);
    }
  }, []);

  // Son mécanique raffiné (avec jitter sur la fréquence et le mix)
  const playMechanicalClack = useCallback((freq: number, dur: number) => {
    if (isMutedRef.current) return;
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
    } catch (error) {
      logAudioError("playMechanicalClack", error);
    }
  }, []);

  // Son de défilement très subtil (avec micro-jitter)
  const playScrollTick = useCallback(() => {
    if (isMutedRef.current) return;
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
    } catch (error) {
      logAudioError("playScrollTick", error);
    }
  }, []);

  // Son de sortie/fermeture (sinus descendant doux)
  const playExit = useCallback(() => {
    if (isMutedRef.current) return;
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
    } catch (error) {
      logAudioError("playExit", error);
    }
  }, []);

  // Son pour le PDF (double-ton ascendant doux)
  const playPdfSave = useCallback(() => {
    if (isMutedRef.current) return;
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
    } catch (error) {
      logAudioError("playPdfSave", error);
    }
  }, []);

  // Son de Glitch / Static Noise (Version Mystérieuse/Dark)
  const playGlitch = useCallback(() => {
    if (isMutedRef.current) return;
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const t = audioCtx.currentTime;
      
      // Oscillateur 1 : La base sombre
      const osc1 = audioCtx.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(110, t); // La2 (Grave)
      osc1.frequency.exponentialRampToValueAtTime(60, t + 0.3); // Pitch down (Chute)

      // Oscillateur 2 : La dissonance (Triton ou léger detune)
      const osc2 = audioCtx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(114, t); // Légèrement désaccordé -> Battement lent
      osc2.frequency.exponentialRampToValueAtTime(58, t + 0.3);

      // Filtre pour étouffer le son (Ambiance)
      const filter = audioCtx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, t);
      filter.frequency.linearRampToValueAtTime(200, t + 0.3); // Le son se ferme

      // Gain (Enveloppe)
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.05); // Attaque douce (pas de click)
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4); // Release long

      // Connexions
      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);

      // Start
      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + 0.4);
      osc2.stop(t + 0.4);

    } catch (error) {
      logAudioError("playGlitch", error);
    }
  }, []);

  // Son de changement de langue (Morphing/Whoosh numérique)
  const playLanguageSwitch = useCallback(() => {
    if (isMutedRef.current) return;
    const audioCtx = getAudioContext();
    if (!audioCtx || isUnmountedRef.current) return;

    try {
      const t = audioCtx.currentTime;
      const dur = 0.3;

      // Source de bruit
      const bufferSize = audioCtx.sampleRate * dur;
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;

      // Filtre balayage (Le "Whoosh")
      const filter = audioCtx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.value = 5; // Résonance pour accentuer l'effet
      filter.frequency.setValueAtTime(400, t);
      filter.frequency.exponentialRampToValueAtTime(3000, t + dur); // Monte vers l'aigu

      // Gain (Fade in/out)
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.1, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      
      noise.start(t);
    } catch (error) {
      logAudioError("playLanguageSwitch", error);
    }
  }, []);

  return { playClick, playIntroTick, playMechanicalClack, playScrollTick, playExit, playPdfSave, playGlitch, playLanguageSwitch };
}
