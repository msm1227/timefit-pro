export default class SoundManager {
  private transitionSound: HTMLAudioElement;
  private completeSound: HTMLAudioElement;
  private initialized: boolean = false;
  private static instance: SoundManager | null = null;

  constructor() {
    if (SoundManager.instance) {
      return SoundManager.instance;
    }

    this.transitionSound = new Audio();
    this.completeSound = new Audio();

    const possiblePaths = [
      '/sounds/transition.mp3',
      'sounds/transition.mp3',
      './sounds/transition.mp3',
      '../sounds/transition.mp3'
    ];

    this.transitionSound.src = possiblePaths[0];
    this.completeSound.src = possiblePaths[0].replace('transition', 'complete');

    this.transitionSound.volume = 0.3;
    this.completeSound.volume = 0.3;

    SoundManager.instance = this;
  }

  private async verifyAudioSource(audio: HTMLAudioElement): Promise<boolean> {
    return new Promise((resolve) => {
      const handleCanPlay = () => {
        cleanup();
        resolve(true);
      };

      const handleError = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        audio.removeEventListener('canplaythrough', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };

      audio.addEventListener('canplaythrough', handleCanPlay, { once: true });
      audio.addEventListener('error', handleError, { once: true });

      audio.load();
    });
  }

  async init() {
    try {
      if (this.initialized) return;
      
      for (const path of [
        '/sounds/transition.mp3',
        'sounds/transition.mp3',
        './sounds/transition.mp3',
        '../sounds/transition.mp3'
      ]) {
        this.transitionSound.src = path;
        this.completeSound.src = path.replace('transition', 'complete');

        const [transitionOk, completeOk] = await Promise.all([
          this.verifyAudioSource(this.transitionSound),
          this.verifyAudioSource(this.completeSound)
        ]);

        if (transitionOk && completeOk) {
          console.log('Found valid audio paths:', path);
          this.initialized = true;
          return;
        }
      }

      throw new Error('Could not find valid audio paths');
    } catch (error) {
      console.error('Failed to initialize sounds:', error);
      this.initialized = false;
      throw error;
    }
  }

  async playTransition() {
    try {
      if (!this.initialized) return;
      this.transitionSound.currentTime = 0;
      await this.transitionSound.play();
    } catch (error) {
      console.warn('Could not play transition sound:', error);
    }
  }

  async playComplete() {
    try {
      if (!this.initialized) return;
      this.completeSound.currentTime = 0;
      await this.completeSound.play();
    } catch (error) {
      console.warn('Could not play complete sound:', error);
    }
  }
}