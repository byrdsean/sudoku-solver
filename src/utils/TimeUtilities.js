//https://flaviocopes.com/how-to-slow-loop-javascript/
export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};
