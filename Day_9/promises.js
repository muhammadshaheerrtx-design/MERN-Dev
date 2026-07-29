// Utility: Delays execution for a specified duration using Promises
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//Check inventory availability
async function checkInventory(cart) {
  await delay(500);
  console.log("Inventory checked:", cart.items.join(", "));
  return { ...cart, inventoryVerified: true };
}

//Process payment (fails intentionally if total > 500)
async function processPayment(cart) {
  await delay(700);
  if (cart.total > 500) {
    throw new Error(`Payment failed: Amount $${cart.total} exceeds the limit.`);
  }
  console.log(`Payment of $${cart.total} processed.`);
  return { ...cart, paymentId: "PAY-98765" };
}

// Generate order confirmation
async function createOrder(cart) {
  await delay(400);
  const orderId = "o" + Math.floor(1000 + Math.random() * 9000);
  console.log(`Order ${orderId} created successfully!`);
  return { orderId, status: "SUCCESS", items: cart.items };
}

//Promise Chaining
function checkoutWithPromises(cart) {
  console.log("Checkout using Promises chain");
  return checkInventory(cart)
    .then((verifiedCart) => processPayment(verifiedCart))
    .then((paidCart) => createOrder(paidCart))
    .then((order) => {
      console.log("Result:", order);
      return order;
    })
    .catch((error) => {
      console.error(" Caught Error (.then):", error.message);
    });
}

// async/await with try/catch
async function checkoutWithAsyncAwait(cart) {
  console.log("--- Running async/await ---");
  try {
    const verifiedCart = await checkInventory(cart);
    const paidCart = await processPayment(verifiedCart);
    const order = await createOrder(paidCart);
    console.log("Result:", order);
    return order;
  } catch (error) {
    console.error(" Caught Error (async/await):", error.message);
  }
}

// Main execution runner
async function main() {
  const validCart = { items: ["Mechanical Keyboard", "Mouse"], total: 150 };
  const expensiveCart = { items: ["4K Monitor", "GPU"], total: 1200 };

  // 1. Successful execution using .then()
  await checkoutWithPromises(validCart);

  console.log("\n-----------------------------------\n");

  // 2. Successful execution using async/await
  await checkoutWithAsyncAwait(validCart);

  console.log("\n-----------------------------------\n");

  // 3. Deliberate failure caught gracefully with try/catch
  await checkoutWithAsyncAwait(expensiveCart);
}

main();
