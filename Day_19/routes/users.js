const express = require("express");
const router = express.Router();
const db = require("../data/users");

// ------------------------------------------------------------------
// GET /api/users
// Plain GET route returning JSON. Supports an optional ?role= query
// param, e.g. /api/users?role=admin  (QUERY PARAM example)
// ------------------------------------------------------------------
router.get("/", (req, res) => {
  const { role } = req.query;

  let result = db.getAll();

  if (role) {
    result = result.filter((u) => u.role === role);
  }

  res.status(200).json({
    success: true,
    count: result.length,
    data: result,
  });
});

// ------------------------------------------------------------------
// GET /api/users/:id
// URL PARAM example — :id is read from req.params
// ------------------------------------------------------------------
router.get("/:id", (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ success: false, error: "id must be a number" });
  }

  const user = db.getById(id);

  if (!user) {
    return res.status(404).json({ success: false, error: `User ${id} not found` });
  }

  res.status(200).json({ success: true, data: user });
});

// ------------------------------------------------------------------
// POST /api/users
// Creates a resource -> 201 Created on success
// ------------------------------------------------------------------
router.post("/", (req, res) => {
  const { name, email, role } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "name and email are required",
    });
  }

  const newUser = db.create({ name, email, role: role || "user" });
  res.status(201).json({ success: true, data: newUser });
});

// ------------------------------------------------------------------
// PUT /api/users/:id
// Full replace of a resource -> 200 on success, 404 if missing
// ------------------------------------------------------------------
router.put("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, email, role } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      error: "name and email are required for a full replace",
    });
  }

  const updated = db.replace(id, { name, email, role: role || "user" });

  if (!updated) {
    return res.status(404).json({ success: false, error: `User ${id} not found` });
  }

  res.status(200).json({ success: true, data: updated });
});

// ------------------------------------------------------------------
// PATCH /api/users/:id
// Partial update -> 200 on success, 404 if missing
// ------------------------------------------------------------------
router.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const updates = req.body || {};

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ success: false, error: "No fields to update" });
  }

  const updated = db.update(id, updates);

  if (!updated) {
    return res.status(404).json({ success: false, error: `User ${id} not found` });
  }

  res.status(200).json({ success: true, data: updated });
});

// ------------------------------------------------------------------
// DELETE /api/users/:id
// -> 200 on success (with confirmation), 404 if missing
// ------------------------------------------------------------------
router.delete("/:id", (req, res) => {
  const id = Number(req.params.id);
  const deleted = db.remove(id);

  if (!deleted) {
    return res.status(404).json({ success: false, error: `User ${id} not found` });
  }

  res.status(200).json({ success: true, message: `User ${id} deleted` });
});

module.exports = router;
