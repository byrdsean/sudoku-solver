import { puzzleConsts as puzzleVals } from "./Constants";

export const setDisplayValue = (item) => {
  if (item.isOriginal) return item.value;
  return puzzleVals.minimumValue <= item.value &&
    item.value <= puzzleVals.maximumValue
    ? item.value
    : "";
};

export const setBoardItemClass = (item) => {
  if (item.isOriginal) return "orig";
  if (!item.isOriginal && item.value !== 0) return "answer";
  return "";
};
