'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function(app) {

  let solver = new SudokuSolver();

  /** If value submitted to /api/check is already placed in puzzle on that coordinate, the returned value will be an object containing a valid property with true if value is not conflicting.
  */
  app.route('/api/check')
    .post((req, res) => {
      if (!req.body.hasOwnProperty('puzzle')
        || !req.body.hasOwnProperty('coordinate')
        || !req.body.hasOwnProperty('value')) {
        res.json({ error: 'Required field(s) missing' });
        return;
      }

      let puzzle = req.body.puzzle
      let coordinate = req.body.coordinate
      let value = parseInt(req.body.value)

      let error = solver.validate(puzzle);
      if (error) {
        res.json({ error: error });
        return;
      }

      if (isNaN(value) || value <= 0 || value > 9) {
        res.json({ error: 'Invalid value' });
        return;
      }
      if (!coordinate.match(/^[A-Ia-i][1-9]$/g) || coordinate == '') {
        res.json({ error: 'Invalid coordinate' });
        return;
      }

      let row = coordinate[0].toUpperCase();
      let column = parseInt(coordinate[1])

      let result = {
        valid: false,
      }

      let conflict = [];

      if (!solver.checkRowPlacement(puzzle, row, column, value)) {
        conflict.push("row")
      }
      if (!solver.checkColPlacement(puzzle, row, column, value)) {
        conflict.push("column")
      }
      if (!solver.checkRegionPlacement(puzzle, row, column, value)) {
        conflict.push("region")
      }

      if (conflict.length > 0) result.conflict = conflict;
      else result.valid = true;

      res.json(result)
    });

  app.route('/api/solve')
    .post((req, res) => {
      let puzzle = req.body.puzzle

      if (!puzzle) {
        res.json({ error: 'Required field missing' });
        return;
      }

      let error = solver.validate(puzzle);
      if (error) {
        res.json({ error: error });
        return;
      }

      let solution = solver.solve(puzzle)
      if (!solution) res.json({ error: 'Puzzle cannot be solved' })
      else res.json({ solution: solution })
    });
};
