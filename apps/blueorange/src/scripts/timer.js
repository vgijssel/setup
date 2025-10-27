export class Timer {
  constructor(targetDate) {
    this.targetDate = new Date(targetDate);
    this.intervalId = null;
  }

  getTimeRemaining() {
    const now = new Date();
    const diff = this.targetDate - now;

    if (diff <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, total: diff };
  }

  start(onTick) {
    this.onTick = onTick;
    this.intervalId = setInterval(() => {
      const time = this.getTimeRemaining();
      this.onTick(time);
      if (time.total <= 0) {
        this.stop();
      }
    }, 1000);

    // Call immediately for initial display
    this.onTick(this.getTimeRemaining());
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
