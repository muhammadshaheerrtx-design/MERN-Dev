# Product & Inventory Insights Engine (Day 6 Capstone)

A pure Node.js CLI tool built to process and analyze product inventory data without external libraries. This project wraps up **Week 1 of the MERN Stack Internship**, covering pure JavaScript fundamentals before moving into frameworks.

---

## What It Does

The script loads a 15-item JSON dataset (`products.json`) and performs a series of analytical transformations to produce formatted terminal reports:

- **Inventory Summary:** Calculates total inventory valuation, total stock units, and average product price.
- **Category Breakdown:** Aggregates stock count and financial value per category.
- **Search & Filter Engine:** Queries products by keyword (matches name/tags), category, and custom price range.
- **Dynamic Sorter:** Sorts products by price, rating, stock, or name without mutating the original dataset.
- **Discount Simulator:** Calculates new prices and total customer savings if a category goes on sale.
- **Supplier Audit:** Extracts nested supplier metadata safely using optional chaining.

---

## Tech Stack & Requirements

- **Runtime:** Node.js (v18+ recommended)
- **Language:** ES6+ JavaScript
- **Dependencies:** None (uses native `fs`, `path`, and `readline` modules)

---


## What It Does not Do 
For now the project is not dynamic and does not take input from the user therefore it onlys works with predefined inputs 

---

## File Structure

```text
day-6/
├── products.json    # Sample dataset (15 product records)
├── index.js         # Core script containing analytical functions
└── README.md        # Project documentation
