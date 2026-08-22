const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTaskById,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
} = require("../controllers/tasksController");

const {
  validateTaskBody,
  validateTaskPatchBody,
} = require("../middleware/validateTask");
const requireAuth = require("../middleware/requireAuth");

// Every task route requires a valid JWT — applied once at the router
router.use(requireAuth);

// Note: MongoDB ObjectId validation (is :id even a valid id shape?) now
// happens inside the controller via mongoose.isValidObjectId(), since
// it's a database-specific concern rather than general input shape
// validation — unlike Day 24's numeric ids, which were checked here.

router.route("/").get(getAllTasks).post(validateTaskBody, createTask);

router
  .route("/:id")
  .get(getTaskById)
  .put(validateTaskBody, replaceTask)
  .patch(validateTaskPatchBody, updateTask)
  .delete(deleteTask);

module.exports = router;
