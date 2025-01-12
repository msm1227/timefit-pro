export default class SoundManager {
  private transitionSound: HTMLAudioElement;
  private completeSound: HTMLAudioElement;
  private warmupCompleteSound: HTMLAudioElement;
  private workCompleteSound: HTMLAudioElement;
  private initialized: boolean = false;
  private static instance: SoundManager;

  constructor() {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }
    this.transitionSound = new Audio();
    this.completeSound = new Audio();
    this.warmupCompleteSound = new Audio();
    this.workCompleteSound = new Audio();
    SoundManager.instance = this;
  }

  async init() {
    try {
      if (this.initialized) return;

      // Initialize sounds with user interaction to comply with browser autoplay policies
      this.transitionSound.src = '/sounds/transition.wav';
      this.completeSound.src = '/sounds/complete.wav';
      this.warmupCompleteSound.src = '/sounds/transition.wav';
      this.workCompleteSound.src = '/sounds/complete.wav';
      
      // Set volume
      this.transitionSound.volume = 0.3;
      this.completeSound.volume = 0.3;
      this.warmupCompleteSound.volume = 0.3;
      this.workCompleteSound.volume = 0.3;
      
      // Load the audio files
      await Promise.all([
        new Promise((resolve, reject) => {
          this.transitionSound.addEventListener('canplaythrough', resolve, { once: true });
          this.transitionSound.addEventListener('error', reject, { once: true });
        }),
        new Promise((resolve, reject) => {
          this.completeSound.addEventListener('canplaythrough', resolve, { once: true });
          this.completeSound.addEventListener('error', reject, { once: true });
        }),
        new Promise((resolve, reject) => {
          this.warmupCompleteSound.addEventListener('canplaythrough', resolve, { once: true });
          this.warmupCompleteSound.addEventListener('error', reject, { once: true });
        }),
        new Promise((resolve, reject) => {
          this.workCompleteSound.addEventListener('canplaythrough', resolve, { once: true });
          this.workCompleteSound.addEventListener('error', reject, { once: true });
        })
      ]);

      this.initialized = true;
    } catch (error) {
      console.warn('Failed to initialize sounds:', error);
    }
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.init();
    }
  }

  async playTransition() {
    try {
      if (!this.initialized) return;
      // Clone the audio element for overlapping sounds
      const sound = this.transitionSound.cloneNode() as HTMLAudioElement;
      sound.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play transition sound:', error);
    }
  }

  async playComplete() {
    try {
      if (!this.initialized) return;
      // Clone the audio element for reliable playback
      const sound = this.completeSound.cloneNode() as HTMLAudioElement;
      sound.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play complete sound:', error);
    }
  }

  async playWarmupComplete() {
    try {
      if (!this.initialized) return;
      // Clone the audio element for reliable playback
      const sound = this.warmupCompleteSound.cloneNode() as HTMLAudioElement;
      sound.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play warmup complete sound:', error);
    }
  }

  async playWorkComplete() {
    try {
      if (!this.initialized) return;
      // Clone the audio element for reliable playback
      const sound = this.workCompleteSound.cloneNode() as HTMLAudioElement;
      sound.play().catch(console.warn);
    } catch (error) {
      console.warn('Could not play work complete sound:', error);
    }
  }
}