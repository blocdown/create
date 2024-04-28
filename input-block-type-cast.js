/**
 * @param {string} rawVal
 * @returns {string}
*/

function castInputType(rawVal) {
  let val = rawVal.toLowerCase();
  if (val === "s" || val === "str" || val === "t" || val === "txt" || val === "text") {
    return "STRING";
  } else if (val === "no" || val === "num" || val === "#") {
    return "NUMBER";
  } else if (val === "b" || val === "bool") {
    return "BOOLEAN";
  } else if (val === "a" || val === "d" || val === "dir" || val === "direction") {
    return "ANGLE";
  } else if (val === "c" || val === "colour") {
    return "COLOR";
  } else if (val === "m") {
    return "MATRIX";
  } else if (val === "n") {
    return "NOTE";
  } else if (val === "cm") {
    return "COSTUME";
  } else if (val === "sd") {
    return "SOUND";
  } else if (val === "i" || val === "img") {
    return "IMAGE";
  } else {
    return val.toUpperCase();
  }
}

/**
 * @param {string} rawVal
 * @returns {string}
*/

function castBlockType(rawVal) {
  let val = rawVal.toLowerCase();
  if (val === "r") {
    return "REPORTER";
  } else if (val === "b" || val === "bool") {
    return "BOOLEAN";
  } else if (val === "c") {
    return "COMMAND";
  } else if (val === "lb" || val === "lbl") {
    return "LABEL";
  } else if (val === "bt" || val === "btn") {
    return "BUTTON";
  } else if (val === "h") {
    return "HAT";
  } else if (val === "e") {
    return "EVENT";
  } else if (val === "l") {
    return "LOOP";
  } else if (val === "cl") {
    return "CONDITIONAL";
  } else {
    return val.toUpperCase();
  }
}
