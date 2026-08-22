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

const { validateTaskBody, validateTaskPatchBody, validateIdParam } = require("../middleware/validateTask");
const requireAuth = require("../middleware/requireAuth");

// Every task route requires a valid JWT — applied once at the router
// level since it's shared across all of them.
router.use(requireAuth);

router.route("/")
  .get(getAllTasks)
  .post(validateTaskBody, createTask);

router.route("/:id")
  .get(validateIdParam, getTaskById)
  .put(validateIdParam, validateTaskBody, replaceTask)
  .patch(validateIdParam, validateTaskPatchBody, updateTask)
  .delete(validateIdParam, deleteTask);

module.exports = router;
