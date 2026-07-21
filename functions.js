
//isEven declaration
function isEven(number){
    if(number % 2 === 0)
        return true 
    return false
}

//isEven arrow
const isEvenArrow = (number) => number%2 ===0;

function maxOfThree(number1,number2,number3){
    //guard clauses 
      if (
    typeof number1 !== "number" ||
    typeof number2 !== "number" ||
    typeof number3 !== "number"
     ) {
    throw new TypeError("All three arguments must be numbers");
    }
 
    if(number1>=number2 && number1 >= number3){
        return number1
    } 
    if(number2>=number1 && number2 >= number3){
        return number2
    } 
    if(number3>=number2 && number3 >= number1){
        return number3
    } 
}


//maxOfThree Arrow function
const maxOfThreeArrow =(number1,number2,number3) =>{ 
          if (
    typeof number1 !== "number" ||
    typeof number2 !== "number" ||
    typeof number3 !== "number"
     ) {
    throw new TypeError("All three arguments must be numbers");
    }
    if(number1>=number2 && number1 >= number3){
        return number1
    } 
    if(number2>=number1 && number2 >= number3){
        return number2
    } 
    if(number3>=number2 && number3 >= number1){
        return number3
    } }

//FizzBuzz arrow function 
function fizzBuzz(n){
    for(let i=1; i<=n ; i++){
      if(i%3===0 && i%5===0){
         console.log("FizzBuzz")
      } else if(i%3===0 ){
         console.log("Fizz")
      } else if(i%5===0){
         console.log("Buzz")
      } 
    }    
}

//fizzBuzz arrow function
const fizzBuzzArrow = (n) => {
  const result = [];
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) result.push("FizzBuzz");
    else if (i % 3 === 0) result.push("Fizz");
    else if (i % 5 === 0) result.push("Buzz");
    else result.push(String(i));
  }
  return result;
};

// gradeClassifier function with guard clause
function gradeClassifier(score) {
  // Guard clauses: reject bad input before doing any real logic
  if (typeof score !== "number" || Number.isNaN(score)) {
    throw new TypeError("Score must be a valid number");
  }
  if (score < 0 || score > 100) {
    throw new RangeError("Score must be between 0 and 100");
  }
 
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 70) return "C";
  if (score >= 60) return "D";
  return "F";
}
 
//gradeCassfiier Arrow function with guard clause
const gradeClassifierArrow = (score) => {
  if (typeof score !== "number" || Number.isNaN(score)) {
    throw new TypeError("Score must be a valid number");
  }
  if (score < 0 || score > 100) {
    throw new RangeError("Score must be between 0 and 100");
  }
 
  switch (true) {
    case score >= 90:
      return "A";
    case score >= 80:
      return "B";
    case score >= 70:
      return "C";
    case score >= 60:
      return "D";
    default:
      return "F";
  }
};
 
 
console.log(`isEven Function : simple -> ${isEven(4)} arrow -> ${isEvenArrow(5)}`);                  // true false
console.log(`\n\nmaxOfThree Function : simple ->${maxOfThree(3, 9, 7)} arrow -> ${maxOfThreeArrow(3, 9, 7)}`); // 9 9
console.log("\n\nfizzBuzz Function :simple -> ") ;
fizzBuzz(15);        
console.log("\n\narrow ->")
console.log(fizzBuzzArrow(13).join("\n"))                         // array of 15 entries
console.log(`\n\ngradeClassifier function :simple -> ${gradeClassifier(85)}  arrow -> ${gradeClassifierArrow(59)}`); // B F
 