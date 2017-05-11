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
    const newBoard = _.cloneDeep(board);
    newBoard[0] = true;
    newBoard[9] = true;
    newBoard[90] = true;
    newBoard[99] = true;
    it('it should be legal', () => {
      const expectedValue = true;
      const input = [12, 13, 14];
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is horizontally adjacent', () => {
      const expectedValue = false;
      const input = [1, 2, 3];
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is vertically adjacent', () => {
      const expectedValue = false;
      const input = [80, 81, 82];
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
    it('it should be illegal because ship is diagonally adjacent', () => {
      const expectedValue = false;
      const input = [86, 87, 88];
      expect(isLegal(newBoard, input)).to.equal(expectedValue);
    });
  });
});
