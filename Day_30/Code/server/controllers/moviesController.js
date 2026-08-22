const mongoose = require("mongoose");
const Movie = require("../models/Movie");
const { sendSuccess, sendError } = require("../utils/response");

async function getAllMovies(req, res, next) {
  try {
    const { status, genre } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;
    if (genre) filter.genre = genre;

    const movies = await Movie.find(filter).sort({ createdAt: -1 });

    sendSuccess(res, 200, movies, { count: movies.length });
  } catch (err) {
    next(err);
  }
}

async function getMovieById(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid movie id");
    }

    const movie = await Movie.findOne({ _id: id, user: req.user._id });

    if (!movie) {
      return sendError(res, 404, `Movie ${id} not found`);
    }

    sendSuccess(res, 200, movie);
  } catch (err) {
    next(err);
  }
}

async function createMovie(req, res, next) {
  try {
    const { title, genre, status, rating, notes } = req.body;

    const movie = await Movie.create({
      title,
      genre,
      status,
      rating,
      notes,
      user: req.user._id,
    });

    sendSuccess(res, 201, movie);
  } catch (err) {
    next(err);
  }
}

async function replaceMovie(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid movie id");
    }

    const { title, genre, status, rating, notes } = req.body;

    const updated = await Movie.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { title, genre, status, rating, notes },
      { new: true, runValidators: true, overwrite: true }
    );

    if (!updated) {
      return sendError(res, 404, `Movie ${id} not found`);
    }

    sendSuccess(res, 200, updated);
  } catch (err) {
    next(err);
  }
}

async function updateMovie(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid movie id");
    }

    const updated = await Movie.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return sendError(res, 404, `Movie ${id} not found`);
    }

    sendSuccess(res, 200, updated);
  } catch (err) {
    next(err);
  }
}

async function deleteMovie(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return sendError(res, 400, "Invalid movie id");
    }

    const deleted = await Movie.findOneAndDelete({ _id: id, user: req.user._id });

    if (!deleted) {
      return sendError(res, 404, `Movie ${id} not found`);
    }

    sendSuccess(res, 200, null, { message: `Movie ${id} deleted` });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllMovies, getMovieById, createMovie, replaceMovie, updateMovie, deleteMovie };
