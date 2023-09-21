const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('API Solve', () => {
    test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'solution');
          assert.isNotNull(res.body.solution);
          assert.equal(res.body.solution.length, 81);
          assert.equal(res.body.solution.search(/\./g), -1);
          done();
        });
    });
    test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({})
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field missing' );
          done();
        });
    });
    test('Solve a puzzle with invalid characters: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3AA4.3.7.2..9.47...8..1..16....926914.37.'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle' );
          done();
        });
    });
    test('Solve a puzzle with incorrect length: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3AA4.3.7.2..9.47...8..1..16....914.37.'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long' );
          done();
        });
    });
    test('Solve a puzzle that cannot be solved: POST request to /api/solve', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/solve')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3574.3.7.2..9.47...8..1..16....92...4.37.'
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Puzzle cannot be solved' );
          done();
        });
    });
  });

  suite('API Check', () => {
    test('Check a puzzle placement with all fields: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'C3',
          value: '4',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.isTrue(res.body.valid);
          done();
        });
    });
    test('Check a puzzle placement with single placement conflict: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'D2',
          value: '5',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict)
          assert.equal(res.body.conflict.length, 1)
          assert.equal(res.body.conflict[0], 'column')
          done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'B3',
          value: '2',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict)
          assert.isAtLeast(res.body.conflict.length, 2)
          done();
        });
    });
    test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..',
          coordinate: 'B3',
          value: '2',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'valid');
          assert.property(res.body, 'conflict');
          assert.isFalse(res.body.valid);
          assert.isArray(res.body.conflict)
          assert.isAtLeast(res.body.conflict.length, 3)
          assert.equal(res.body.conflict[0], 'row')
          assert.equal(res.body.conflict[1], 'column')
          assert.equal(res.body.conflict[2], 'region')
          done();
        });
    });
    test('Check a puzzle placement with missing required fields: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'C3',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });
    test('Check a puzzle placement with invalid characters: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3AA4.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'B3',
          value: '2',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid characters in puzzle' );
          done();
        });
    });
    test('Check a puzzle placement with incorrect length: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47..914.37.',
          coordinate: 'C3',
          value: '2',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');
          done();
        });
    });
    test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'P0',
          value: '2',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid coordinate');
          done();
        });
    });
    test('Check a puzzle placement with invalid placement value: POST request to /api/check', function(done) {
      chai
        .request(server)
        .keepOpen()
        .post('/api/check')
        .send({
          puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
          coordinate: 'C3',
          value: '32',
        })
        .end(function(err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.type, 'application/json');
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value');
          done();
        });
    });
  });
});

