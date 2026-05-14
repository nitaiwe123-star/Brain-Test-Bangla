
export const SOUNDS = {
  click: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  fail: 'https://assets.mixkit.co/active_storage/sfx/253/253-preview.mp3',
  spin: 'https://assets.mixkit.co/active_storage/sfx/707/707-preview.mp3',
  achievement: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
  coin: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
  win: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
};

export type SoundName = keyof typeof SOUNDS;

class SoundService {
  private audios: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;

  constructor() {
    // Preload sounds - but browsers might delay loading until first play attempt
    if (typeof window !== 'undefined') {
      Object.entries(SOUNDS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.audios.set(key, audio);
      });
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  play(soundName: keyof typeof SOUNDS) {
    if (!this.enabled) return;
    
    const audio = this.audios.get(soundName);
    if (audio) {
      // For short sounds, reset time to 0 and play
      audio.pause();
      audio.currentTime = 0;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn(`Audio play for ${soundName} was blocked or failed:`, e);
          // Retry logic or just ignore
        });
      }
    }
  }

  stop(soundName: keyof typeof SOUNDS) {
    const audio = this.audios.get(soundName);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  loop(soundName: keyof typeof SOUNDS) {
    if (!this.enabled) return;
    const audio = this.audios.get(soundName);
    if (audio) {
      audio.loop = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn(`Audio loop for ${soundName} was blocked or failed:`, e);
        });
      }
    }
  }
}

export const soundService = new SoundService();
