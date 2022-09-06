import puzzles from "../api/puzzles.json";

const getRandomArrayItem = (arr) => {
  let index = Math.floor(Math.random() * arr.length);
  return { index, value: arr[index] };
};

const setCamelCase = (str) => {
  if (str === null || str === undefined) return str;

  let camel = "";
  str.split(" ").forEach((s) => {
    camel += `${s[0].toLocaleUpperCase()}${s.substring(1)} `;
  });
  return camel.trim();
};

export const getAvailablePuzzles = () => {
  let availablePuzzles = [];
  Object.keys(puzzles).forEach((p) => {
    for (let i = 0; i < puzzles[p].length; i++) {
      let text = `${setCamelCase(p)} ${i + 1}`;
      availablePuzzles.push({
        text,
        value: text.toLocaleLowerCase(),
        id: text.toLocaleLowerCase().replace(" ", ""),
      });
    }
  });
  return availablePuzzles;
};

export const getPuzzle = (value) => {
  if (value.toLocaleLowerCase() === "random") {
    //Get a random key
    let key = getRandomArrayItem(Object.keys(puzzles)).value;

    //Get random puzzle for that key
    return getRandomArrayItem(puzzles[key]).value;
  }

  let parts = value.split(" ");
  let puz = puzzles[parts[0]][+parts[1] - 1];
  return puz;
};
