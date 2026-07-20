// 1. NUMBERS & BASIC MATH

const price = 45;
const taxRate = 0.08;
const totalPrice = price + (price * taxRate);

console.log("1. Numbers:");
console.log(`Total price with tax: $${price}`); 
console.log("\n\n");


// 2. STRINGS 
const firstName = "Alex";
const lastName = "Dev";
const fullName = firstName + " " + lastName;

console.log("2. Strings:");
console.log(`Full Name: ${fullName}`);
console.log(`Uppercase Name: ${fullName.toUpperCase()}`);
console.log("\n\n");

// 3. BOOLEANS & LOGIC
const isLoggedIn = true;
const hasRights = false;
const canAccess = isLoggedIn && !hasRights;

console.log("3. Booleans:");
console.log(`User logged in: ${isLoggedIn}`);
console.log(`Can access general dashboard: ${canAccess}`);
console.log("\n".repeat(3));

// 4. TYPE CONVERSION:
const inputAge = "25"; 
const parsedAge = Number(inputAge);
const nextYearAge = parsedAge + 1;

console.log("4. Type Conversion (String to Number):");
console.log(`Input type: ${typeof inputAge}`);      // string
console.log(`Parsed type: ${typeof parsedAge}`);    // number
console.log(`Age next year: ${nextYearAge}`);
console.log("\n\n");


// ==========================================
// 5. TYPE CONVERSION: Number/Boolean -> String
// ==========================================
const score = 98;
const isPassed = true;

const scoreString = String(score);
const statusString = String(isPassed);
const num1="4"
const num2="9"


console.log("5. Type Conversion (Value to String):");
console.log(`Score as String: "${scoreString}" (Length: ${scoreString.length})`);
console.log(`Status as String: "${statusString}"`);
console.log(`String addition behaviour with digits character: ${num1 +num2} (the strings are contatenated)`);
console.log(`String subtraction behaviour with digits character: ${num2 + num1} (string converted to numeber)`);
