export class Die {

  constructor(public value = 1, public locked = false) {}

  roll() {
    if(this.locked) return;
    this.value = Math.floor(Math.random() * 6) + 1;
  }

  toggleLock() {
    this.locked = !this.locked;
  }

  reset() {
    this.value = 1;
    this.locked = false;
  }
}
