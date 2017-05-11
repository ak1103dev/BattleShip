const _ = require('lodash');
const { expect } = require('chai');
const isLegal = require('../src/utils/isLegal');

const board = _.times(100, _.constant(false));

describe('legal or illegal placement', () => {
  describe('When place ship on center', () => {
    it('it should be legal because of empty board', () => {
      const expectedValue = true;
      const input = [12, 13, 14];
      expect(isLegal(board, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship overlap', () => {
      const expectedValue = false;
      const input = [12, 13, 14];
      const newBoard = _.cloneDeep(board);
      newBoard[12] = true;
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is diagonally adjacent', () => {
      const expectedValue = false;
      const input = [12, 13, 14];
      const newBoard = _.cloneDeep(board);
      newBoard[5] = true;
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is horizontally adjacent', () => {
      const expectedValue = false;
      const input = [12, 13, 14];
      const newBoard = _.cloneDeep(board);
      newBoard[11] = true;
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is vertically adjacent', () => {
      const expectedValue = false;
      const input = [12, 13, 14];
      const newBoard = _.cloneDeep(board);
      newBoard[23] = true;
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
  });
  describe('When place ship on corner', () => {
    it('it should be legal', () => {
      const expectedValue = true;
      const input = [0, 1, 2];
      expect(isLegal(board, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is horizontally adjacent', () => {
      const expectedValue = false;
      const input = [0, 1, 2];
      const newBoard = _.cloneDeep(board);
      newBoard[3] = true;
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is vertically adjacent', () => {
      const expectedValue = false;
      const input = [98, 99];
      const newBoard = _.cloneDeep(board);
      newBoard[89] = true;
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is diagonally adjacent', () => {
      const expectedValue = false;
      const input = [90, 91, 92];
      const newBoard = _.cloneDeep(board);
      newBoard[83] = true;
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
  });
});
