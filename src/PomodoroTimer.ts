import { GLOBALS } from './models/Globals';

export class PomodoroTimer {
  private timerInterval: NodeJS.Timeout | null = null;
  private timeRemaining: number = GLOBALS().WorkTime; // Start by working!
  private isRunning = false;
  private isWorking = true;
  private onTick: (remaining: number) => void;
  private onComplete: () => void;

  constructor(onTick: (remaining: number) => void, onComplete: () => void) {
    this.onTick = onTick;
    this.onComplete = onComplete;
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timerInterval = setInterval(() => {
      this.timeRemaining--;
      this.onTick(this.timeRemaining);
      
      if (this.timeRemaining <= 0) {
        this.stop();
        this.onComplete();
      }
    }, 1000);
  }

  stop() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.isRunning = false;
  }

  reset() {
    this.stop();
	  this.isWorking = !this.isWorking;
    this.timeRemaining = this.isWorking ? GLOBALS().WorkTime : GLOBALS().BreakTime;
	  this.start();
  }

  getTimeRemaining()
  {
	  return this.timeRemaining;
  }

  getIsWorking()
  {
	  return this.isWorking;
  }

  getIsRunning() {
    return this.isRunning;
  }
}
