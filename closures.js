// 1. makeCounter()

function makeCounter(start = 0) {
  let count = start; // private state can only be reached by closures

  return {
    increment() {
      count += 1;
      return count;
    },
    decrement() {
      count -= 1;
      return count;
    },
    get() {
      return count;
    },
  };
}

const counterA = makeCounter();
const counterB = makeCounter(100);

console.log("counterA.increment():", counterA.increment()); 
console.log("counterA.increment():", counterA.increment()); 
console.log("counterA.decrement():", counterA.decrement()); 
console.log("counterA.get():", counterA.get());              

console.log("counterB.increment():", counterB.increment()); 
console.log("counterB.get():", counterB.get());              

// Every call to makeCounter() creates a fresh scope.


// 2. Greeting generator

function makeGreeter(name) {
  const greeting = `Hello, ${name}!`; // captured by the closure greet

  return function greet() {
    return greeting;
  };
}

const greetAli = makeGreeter("Ali");
const greetSara = makeGreeter("Sara");

console.log(greetAli()); 
console.log(greetSara()); 

// Each returned function still points to its own `greeting`resulting in unique different greetings for different names
