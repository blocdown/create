const codeUP = document.getElementById("code-unparsed");
const codeDisplay = document.getElementById("code-parsed");

/*
  @param {string} rawVal
  @returns {string}
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

/*
  @param {string} rawVal
  @returns {string}
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

/*
  @returns {object}
*/

function getOtherExtData() {
  let name = document.getElementById("ext-name").value;
  let extClass = document.getElementById("ext-class").value;
  let id = document.getElementById("ext-id").value;
  
  let extUnsandbox = document.getElementById("ext-unsandbox").checked;
  let unsandboxDisclaimer = "";
  if (extUnsandbox) {
    unsandboxDisclaimer = `
  if (!Scratch.extensions.unsandboxed) {
    throw new Error("The ${name} extension must run unsandboxed");
  }
`;
  }
  let websiteStuff = "";
  let colors = "";
  return {
    name,
    class: extClass,
    id,
    unsandboxDisclaimer,
    websiteStuff,
    colors
  }
}

/*
  @param {string} val
  @returns {array}
*/

function getParts(val) {
  let parts = [];
  let rawParts = val.split("|");
  if (rawParts.length < 3) {
    return;
  }
  let part = rawParts.pop();
  parts.unshift(part);
  part = rawParts.pop();
  parts.unshift(part);
  part = rawParts.join("|");
  parts.unshift(part);
  return parts;
}

/*
  @param {string} string
  @param {string} char
  @returns {array}
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

/*
  @param {string} rawText
  @returns {object}
*/

function extractArgsAndTextParts(rawText) {
  let openBracketIs = getAllIndexes(rawText, "[");
  let closeBracketIs = getAllIndexes(rawText, "]");
  if (openBracketIs.length !== closeBracketIs.length) {
    return;
  }
  let blockTextParts = [];
  let args = [];
  let arg;
  let textPart = rawText.slice(0, openBracketIs[0]);
  blockTextParts.push(textPart);
  for (let i = 0; i < openBracketIs.length; i++) {
    arg = rawText.slice(openBracketIs[i] + 1, closeBracketIs[i]);
    args.push(arg);
    if (!(openBracketIs[(i + 1)])) {
      textPart = rawText.slice(closeBracketIs[i] + 1);
    } else {
      textPart = rawText.slice(closeBracketIs[i] + 1, openBracketIs[(i + 1)]);
    }
    blockTextParts.push(textPart);
  }
  return {
    textParts: blockTextParts,
    args: args
  };
}

/*
  @param {array} parts
  @param {array} argCodes
  @returns {string}
*/

function constructBlockText(parts, argCodes) {
  let text = parts.shift();
  for (let i = 0; i < parts.length; i++) {
    text += `[${argCodes[i]}]`;
    text += parts[i];
  }
  return text;
}

/*
  @param {string} rawVal
  @returns {object}
*/

function extractBlockParts(rawVal) {
  let blockparts = {};
  let codeParts = getParts(rawVal);
  if (!codeParts) {
    return;
  }
  let rawText = codeParts.shift();
  blockparts.opcode = codeParts.shift();
  blockparts.type = castBlockType(codeParts.shift());
  if (!(rawText.includes("["))) {
    blockparts.text = rawText;
    return blockparts;
  }
  let textPartsandArgs = extractArgsAndTextParts(rawText);
  if (!textPartsandArgs) {
    return;
  }
  let rawArgs = textPartsandArgs.args;
  let textParts = textPartsandArgs.textParts;
  let blockArgs = [];
  let argCodes = [];
  for (let i = 0; i < rawArgs.length; i++) {
    let argParts = getParts(rawArgs[i]);
    if (!argParts) {
      return;
    }
    let arg = {
      defaultVal: argParts[0],
      name: argParts[1],
      type: castInputType(argParts[2])
    };
    blockArgs.push(arg);
    argCodes.push(argParts[1]);
  }
  blockparts.text = constructBlockText(textParts, argCodes);
  blockparts.args = blockArgs;
  return blockparts;
}

/*
  @param {array} args
  @returns {string}
*/

function parseArgs(args) {
  let parsed = `            arguments: {`;
  let i = 0;
  args.forEach(arg => {
    i++;
    if (arg.type === "IMAGE") {
      parsed += `
              ${arg.name}: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: ${arg.defaultVal}
              }`;
    } else if (arg.type === "BOOLEAN" || arg.type === "COSTUME" || arg.type === "SOUND") {
      parsed += `
              ${arg.name}: {
                type: Scratch.ArgumentType.${arg.type}
              }`;
    } else {
      parsed += `
              ${arg.name}: {
                type: Scratch.ArgumentType.${arg.type},
                defaultValue: "${arg.defaultVal}"
              }`;
    }
    if (!(i === args.length)) {
      parsed += ",";
    }
    parsed += `
            }`;
  });
  return parsed;
}

/*
  @param {object} block
  @returns {string}
*/

function parseBlock(block) {
  if (!block) {
    return;
  }
  let parsed = "";
  if (block.type === "BUTTON") {
    parsed = `
          {
            func: "${block.opcode}",
            blockType: Scratch.BlockType.BUTTON,
            text: "${block.text}",
          }`;
  } else if (block.type === "LABEL") {
    parsed = `
          {
            blockType: Scratch.BlockType.LABEL,
            text: "${block.text}",
          }`;
  } else if (!block.args) {
    parsed = `
          {
            opcode: "${block.opcode}",
            blockType: Scratch.BlockType.${block.type},
            text: "${block.text}",
          }`;
  } else {
    parsed = `
          {
            opcode: "${block.opcode}",
            blockType: Scratch.BlockType.${block.type},
            text: "${block.text}",
${parseArgs(block.args)}
          }`;
  }
  return parsed;
}

function parseCode() {
  let code = codeUP.value;
  let lines = code.split("\n");
  let ext = getOtherExtData();
  let parsed = `${ext.websiteStuff}(function(Scratch) {
  "use strict";
${ext.unsandboxDisclaimer}
  class ${ext.class} {
    getInfo() {
      return {
        id: "${ext.id}",
        name: "${ext.name}",${ext.colors}
        blocks: [`;
  let i = 0;
  lines.forEach(line => {
    i++;
    let block = extractBlockParts(line);
    if (!block) {
      return;
    }
    parsed += parseBlock(block);
    if (!(i === lines.length)) {
      parsed += ",";
    }
  });
  parsed += `
        ],
      };
    }
  
  }
  Scratch.extensions.register(new ${ext.class}());
})(Scratch);`;
  codeDisplay.value = parsed;
}

