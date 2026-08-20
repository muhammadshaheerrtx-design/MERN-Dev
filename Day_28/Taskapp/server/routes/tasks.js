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

router.use(requireAuth);

router.route("/").get(getAllTasks).post(validateTaskBody, createTask);

router
  .route("/:id")
  .get(getTaskById)
  .put(validateTaskBody, replaceTask)
  .patch(validateTaskPatchBody, updateTask)
  .delete(deleteTask);

module.exports = router;
