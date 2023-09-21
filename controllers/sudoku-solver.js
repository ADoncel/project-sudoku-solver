class SudokuSolver {

  validate(puzzleString) {
    const regex = /[^\d\.]/g;
    if (puzzleString.length != 81) return 'Expected puzzle to be 81 characters long';
    if (puzzleString.search(regex) != -1) return 'Invalid characters in puzzle';
    return null;
  }

  mapSudoku(puzzleString) {
    let sudoku = {
      A: puzzleString.substring(0, 9).split(''),    //65 1
      B: puzzleString.substring(9, 18).split(''),   //66 2
      C: puzzleString.substring(18, 27).split(''),  //67 3

      D: puzzleString.substring(27, 36).split(''),  //68 4
      E: puzzleString.substring(36, 45).split(''),  //69 5
      F: puzzleString.substring(45, 54).split(''),  //70 6

      G: puzzleString.substring(54, 63).split(''),  //71 7
      H: puzzleString.substring(63, 72).split(''),  //72 8
      I: puzzleString.substring(72).split(''),      //73 9
    }

    return sudoku;
  }

  mapRegions(puzzleString, row, column) {
    let region = '';
    let regionRows = [];
    let regionColumns = [];
    let sudoku = this.mapSudoku(puzzleString);

    if (column % 3 == 0) regionColumns = [column - 3, column - 2, column - 1]
    else if (column % 3 == 1) regionColumns = [column - 1, column, column + 1]
    else if (column % 3 == 2) regionColumns = [column - 2, column - 1, column]

    let ascii = row.charCodeAt(0);
    let result = ascii - 64;

    if (result % 3 == 0)
      regionRows = [String.fromCharCode(ascii - 2), String.fromCharCode(ascii - 1), String.fromCharCode(ascii)]
    else if (result % 3 == 1)
      regionRows = [String.fromCharCode(ascii), String.fromCharCode(ascii + 1), String.fromCharCode(ascii + 2)]
    else if (result % 3 == 2)
      regionRows = [String.fromCharCode(ascii - 1), String.fromCharCode(ascii), String.fromCharCode(ascii + 1)]

    for (let i = 0; i < regionRows.length; i++) {
      for (let j = 0; j < regionColumns.length; j++) {
        region = region + sudoku[regionRows[i]][regionColumns[j]];
      }
    }

    return region;
  }

  formSolution(sudoku) {
    let string = '';
    Object.keys(sudoku).forEach((key) => string = string + sudoku[key].join(''))

    return string;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let sudoku = this.mapSudoku(puzzleString);

    if (sudoku[row][column - 1] == value) {
      let sol = this.solve(puzzleString);
      let solSudoku = this.mapSudoku(sol);
      if (solSudoku[row][column - 1] == value) return true;
      else {
        solSudoku[row][column - 1] = '.';
        if (sudoku[row].join('').search(value) != -1) return false;
      }
    } else {
      if (sudoku[row].join('').search(value) != -1) return false;
    }

    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colStr = '';
    let sudoku = this.mapSudoku(puzzleString);

    if (sudoku[row][column - 1] == value) {
      let sol = this.solve(puzzleString);
      let solSudoku = this.mapSudoku(sol);
      if (solSudoku[row][column - 1] == value) return true;
      else {
        solSudoku[row][column - 1] = '.';
        Object.keys(solSudoku).forEach((key) => colStr = colStr + solSudoku[key][column - 1])
        if (colStr.search(value) != -1) return false;
      }
    } else {
      Object.keys(sudoku).forEach((key) => colStr = colStr + sudoku[key][column - 1])
      if (colStr.search(value) != -1) return false;
    }

    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let sudokuReg;
    let sudoku = this.mapSudoku(puzzleString);

    if (sudoku[row][column - 1] == value) {
      let sol = this.solve(puzzleString);
      let solSudoku = this.mapSudoku(sol);
      if (solSudoku[row][column - 1] == value) return true;
      else {
        solSudoku[row][column - 1] = '.';
        sudokuReg = this.mapRegions(puzzleString, row, column)
        if (sudokuReg.search(value) != -1) return false;
      }
    } else {
      sudokuReg = this.mapRegions(puzzleString, row, column)
      if (sudokuReg.search(value) != -1) return false;
    }

    return true;
  }

  checkValid(sudoku, row, column, value) {
    if (this.checkRowPlacement(this.formSolution(sudoku), row, column, value) &&
      this.checkColPlacement(this.formSolution(sudoku), row, column, value) &&
      this.checkRegionPlacement(this.formSolution(sudoku), row, column, value))
      return true;

    return false;
  }

  backtrackingSol(sudoku, rows, rowidx, colidx) {
    if (rowidx === 8 && colidx === 9) return true;

    if (colidx === 9) {
      rowidx++;
      colidx = 0;
    }

    if (sudoku[rows[rowidx]][colidx] != '.')
      return this.backtrackingSol(sudoku, rows, rowidx, colidx + 1);

    for (let j = 1; j < 10; j++) {
      if (this.checkValid(sudoku, rows[rowidx], colidx + 1, j)) {
        sudoku[rows[rowidx]][colidx] = j;

        if (this.backtrackingSol(sudoku, rows, rowidx, colidx + 1))
          return true
      }
      sudoku[rows[rowidx]][colidx] = '.';
    }

    return false;
  }

  solve(puzzleString) {
    let sudoku = this.mapSudoku(puzzleString);
    let rows = Object.keys(sudoku);

    this.backtrackingSol(sudoku, rows, 0, 0);

    let solution = this.formSolution(sudoku);

    if (solution.search(/\./g) != -1) solution = null;

    return solution;
  }
}

module.exports = SudokuSolver;

