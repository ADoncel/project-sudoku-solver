const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
  test('Logic handles a valid puzzle string of 81 characters', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.isNull(solver.validate(sudoku), 'Return null when valid');
    done();
  });
  test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.ZZ..9..1.AA.8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    assert.equal(solver.validate(sudoku), 'Invalid characters in puzzle');
    done();
  });
  test('Logic handles a puzzle string that is not 81 characters in length', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.ZZ..9..1.AA.8.2.3674.3.7.2..9.47...8..1..16....926';
    assert.equal(solver.validate(sudoku), 'Expected puzzle to be 81 characters long');
    done();
  });
  test('Logic handles a valid row placement', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'C';
    let column = '3';
    let value = 4
    assert.isTrue(solver.checkRowPlacement(sudoku, row, column, value), 'Return true if valid');
    done();
  });
  test('Logic handles an invalid row placement', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'C';
    let column = '3';
    let value = 2
    assert.isFalse(solver.checkRowPlacement(sudoku, row, column, value), 'Return false if not valid');
    done();
  });
  test('Logic handles a valid column placement', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'C';
    let column = '3';
    let value = 4
    assert.isTrue(solver.checkColPlacement(sudoku, row, column, value), 'Return true if valid');
    done();
  });
  test('Logic handles an invalid column placement', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'C';
    let column = '3';
    let value = 2
    assert.isFalse(solver.checkColPlacement(sudoku, row, column, value), 'Return false if not valid');
    done();
  });
  test('Logic handles a valid region (3x3 grid) placement', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'C';
    let column = '3';
    let value = 4
    assert.isTrue(solver.checkRegionPlacement(sudoku, row, column, value), 'Return true if valid');
    done();
  });
  test('Logic handles an invalid region (3x3 grid) placement', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.';
    let row = 'C';
    let column = '3';
    let value = 2
    assert.isFalse(solver.checkRegionPlacement(sudoku, row, column, value), 'Return false if not valid');
    done();
  });
  test('Valid puzzle strings pass the solver', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    let solution = solver.solve(sudoku);
    assert.isNotNull(solution);
    assert.equal(solution.length, 81);
    assert.equal(solution.search(/\./g), -1);
    done();
  });
  test('Invalid puzzle strings fail the solver', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3574.3.7.2..9.47...8..1..16....92...4.37.'
    assert.isNull(solver.solve(sudoku), 'Return null if no solution');
    done();
  });
  test('Solver returns the expected solution for an incomplete puzzle', function(done) {
    let sudoku = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    let solution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    assert.equal(solver.solve(sudoku), solution);
    done();
  });
});
