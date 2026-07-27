export class Cart {
  #items = [];

  addItem(product, quantity = 1) {
    if (!product || quantity <= 0) return this;

    const existing = this.#items.find((item) => item.product.id === product.id);

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.#items.push({ product, quantity });
    }

    return this;
  }

  removeItem(productId) {
    this.#items = this.#items.filter((item) => item.product.id !== productId);
    return this;
  }

  updateQuantity(productId, quantity) {
    const item = this.#items.find((item) => item.product.id === productId);
    if (!item) return this;

    if (quantity <= 0) {
      return this.removeItem(productId);
    }

    item.quantity = quantity;
    return this;
  }

  getItems() {
    return [...this.#items];
  }

  getSubtotal() {
    return this.#items.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    );
  }

  getItemCount() {
    return this.#items.reduce((sum, { quantity }) => sum + quantity, 0);
  }

  applyDiscount(percentage) {
    const subtotal = this.getSubtotal();
    const discount = subtotal * (percentage / 100);
    return {
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discount.toFixed(2)),
      total: Number((subtotal - discount).toFixed(2)),
    };
  }

  clear() {
    this.#items = [];
    return this;
  }

  getReceipt() {
    return this.#items.map(({ product, quantity }) => ({
      name: product.name,
      quantity,
      unitPrice: `$${product.price}`,
      lineTotal: `$${(product.price * quantity).toFixed(2)}`,
    }));
  }
}
