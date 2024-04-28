/**
 * @param {string} string
 * @param {string} char
 * @returns {array}
*/

function getAllIndexes(string, char) {
  let indexes = [];
  for (let i = 0; i < string.length; i++) {
    if (string[i] === char) {
      indexes.push(i);
    }
  }
  return indexes;
}
