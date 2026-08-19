const mongoose = require("mongoose");
const Task = require("../models/Task");
const { sendSuccess, sendError } = require("../utils/response");

// Every task is scoped to req.user.id (or a database error is invalid
// enough that we can't even attempt the query, e.g. a malformed id).

async function getAllTasks(req, res, next) {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });

    sendSuccess(res, 200, tasks, { count: tasks.length });
  } catch (err) {
    next(err);
  }
}

async function getTaskById(req, res, next) {
  try {
    const { id } = req.params;

    // A malformed id (not a valid 24-char hex ObjectId) would otherwise
    // throw a raw Mongoose CastError — we check up front so we can
    // return a clean, specific 400 instead of falling through to a
    // generic 500.
    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return sendError(res, 404, `Task ${id} not found`);
    }

    sendSuccess(res, 200, task);
  } catch (err) {
    next(err);
  }
}

async function createTask(req, res, next) {
  try {
    const { title, description, status } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      user: req.user._id,
    });

    sendSuccess(res, 201, task);
  } catch (err) {
    next(err);
  }
}

async function replaceTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    const { title, description, status } = req.body;

    // findOneAndUpdate with { new: true, runValidators: true }:
    // - new: true      -> return the document AFTER the update
    // - runValidators   -> re-run schema validation on the update, since
    //                      Mongoose does NOT validate updates by default
    const updated = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, description, status },
      { new: true, runValidators: true, overwrite: true }
    );

    if (!updated) {
      return sendError(res, 404, `Task ${id} not found`);
    }

    sendSuccess(res, 200, updated);
  } catch (err) {
    next(err);
  }
}

async function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    const updated = await Task.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return sendError(res, 404, `Task ${id} not found`);
    }

    sendSuccess(res, 200, updated);
  } catch (err) {
    next(err);
  }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid task id");
    }

    const deleted = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) {
      return sendError(res, 404, `Task ${id} not found`);
    }

    sendSuccess(res, 200, null, { message: `Task ${id} deleted` });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllTasks, getTaskById, createTask, replaceTask, updateTask, deleteTask };
