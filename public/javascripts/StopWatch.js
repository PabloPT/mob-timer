//TODO: implement THREE.Clock for easier time keeping

class StopWatch extends THREE.Group {
  constructor(durationMinutes) {
    super();
    this.durationSeconds = 60;
    this.countDownSeconds = 0;
    this.intervalHandle = null;
    this.isRunning = false;
    this.paused = false;
    this.timeIsUp = false;
    this.setDuration(durationMinutes);
  }

  setDuration(durationMinutes) {
    console.log('setting new duration: ', durationMinutes);
    this.countDownSeconds = this.durationSeconds = durationMinutes * 60;
  }

  getCountDown() {
    const minutes = Math.floor(this.countDownSeconds / 60);
    let seconds = this.countDownSeconds % 60;
    if (seconds < 10) seconds = '0' + seconds;
    return ` ${minutes}:${seconds} `;
  }

  start() {
    if (this.isRunning) return; //if is running, do nothing
    this.timeIsUp = false;
    this.isRunning = true;
    this.countDownSeconds = this.durationSeconds;
    this.countDownSeconds--;
    this.intervalHandle = setInterval(() => {
      if (this.paused) {
        return;
      }
      this.countDownSeconds--;
      if (this.countDownSeconds <= 0) {
        this.timeIsUp = true;
        this.isRunning = false;
        clearInterval(this.intervalHandle);
      }
    }, 1000);
  }
  pause() {
    //pause count down
    this.paused = true;
  }
  resume() {
    //pause count down
    this.paused = false;
  }
  reset() {
    clearInterval(this.intervalHandle);
    this.isRunning = false;
    this.timeIsUp = false;
    this.countDownSeconds = this.durationSeconds;
    //set
  }
}
