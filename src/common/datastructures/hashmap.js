class HashMap {
  constructor() {
    this.map = new Map();
  }
  
 
  add(key, item) {
    if (!this.map.has(key)) {
      this.map.set(key, item);
    }
  }

    remove(key) {
      this.map.delete(key);
    }
  
    contains(key) {
      return this.map.has(key);
    }
  
    get(key) {
      return this.map.get(key);
    }
  
    peek() {
      const iterator = this.map.keys();
      return iterator.next().value; 
    }

    peekFront() {
        const lastAddedKey = Array.from(this.map.keys()).pop(); 
        return this.map.get(lastAddedKey); 
      }

      getAllData() {
        return Array.from(this.map.values()).reverse();
      }

      getAllDataWithKey(){
        return Array.from(this.map.entries()).map(([key, value]) => ({ key, value })).reverse();
      }
   
  
    isEmpty() {
      return this.map.size === 0;
    }
  
    get size() {
      return this.map.size;
    }
  }
  
  export default HashMap;
  