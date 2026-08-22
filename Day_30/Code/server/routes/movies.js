const express = require("express");
const router = express.Router();

const {
  getAllMovies,
  getMovieById,
  createMovie,
  replaceMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/moviesController");

const { validateMovieBody, validateMoviePatchBody } = require("../middleware/validateMovie");
const requireAuth = require("../middleware/requireAuth");

// Every movie route requires a valid JWT.
router.use(requireAuth);

router.route("/")
  .get(getAllMovies)
  .post(validateMovieBody, createMovie);

router.route("/:id")
  .get(getMovieById)
  .put(validateMovieBody, replaceMovie)
  .patch(validateMoviePatchBody, updateMovie)
  .delete(deleteMovie);

module.exports = router;
