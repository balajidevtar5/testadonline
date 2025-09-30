class Deque {
    constructor() {
      this.items = [];
    }
  
    addFront(item) {
      this.items.unshift(item);
    }
  
    addRear(item) {
      this.items.push(item);
    }
  
    removeFront() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.shift();
    }
  
    removeRear() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items.pop();
    }
  
    removeAtIndex(index) {
        if (index < 0 || index >= this.items.length) {
          return null; // Index out of bounds
        }
        return this.items.splice(index, 1)[0];
      }
    peekFront() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items[0];
    }
  
    peekRear() {
      if (this.isEmpty()) {
        return null;
      }
      return this.items[this.items.length - 1];
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  
    get size() {
      return this.items.length;
    }
  }
  
  export default Deque;