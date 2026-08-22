const Task = require("../models/Task");
const { sendSuccess, sendError } = require("../utils/response");

// Every function here trusts req.user to already be set by requireAuth
// middleware, and scopes every read/write to req.user.id so users can
// only ever see or modify their own tasks.

function getAllTasks(req, res) {
  const { status } = req.query;
  const result = Task.findAllByUser(req.user.id, { status });
  sendSuccess(res, 200, result, { count: result.length });
}

function getTaskById(req, res) {
  const id = Number(req.params.id);
  const task = Task.findByIdAndUser(id, req.user.id);

  if (!task) {
    return sendError(res, 404, `Task ${id} not found`);
  }

  sendSuccess(res, 200, task);
}

function createTask(req, res) {
  const { title, description, status } = req.body;
  const task = Task.create({ userId: req.user.id, title, description, status });
  sendSuccess(res, 201, task);
}

function replaceTask(req, res) {
  const id = Number(req.params.id);
  const { title, description, status } = req.body;

  const updated = Task.replace(id, req.user.id, { title, description, status });

  if (!updated) {
    return sendError(res, 404, `Task ${id} not found`);
  }

  sendSuccess(res, 200, updated);
}

function updateTask(req, res) {
  const id = Number(req.params.id);
  const updated = Task.update(id, req.user.id, req.body);

  if (!updated) {
    return sendError(res, 404, `Task ${id} not found`);
  }

  sendSuccess(res, 200, updated);
}

function deleteTask(req, res) {
  const id = Number(req.params.id);
  const deleted = Task.delete(id, req.user.id);

  if (!deleted) {
    return sendError(res, 404, `Task ${id} not found`);
  }

  sendSuccess(res, 200, null, { message: `Task ${id} deleted` });
}

module.exports = { getAllTasks, getTaskById, createTask, replaceTask, updateTask, deleteTask };
