const extensionRaw = document.getElementById("code-Raw");
const extensionDisplay = document.getElementById("code-parsed");

/**
 * Gets the other extension data
  * @returns {object}
  *  {object} - Object containing extension data:
  *    - name: string - The extension's name
  *    - class: string - The extension's class name
  *    - id: string - The extension's ID
  *    - unsandboxed: boolean - Whether the extension must run unsandboxed
  *    - unsandboxDisclaimer: string - The disclaimer to be shown when the extension is unsandboxed
  *    - websiteStuff: string - The website stuff to be added to the extension
  *    - colors: string - The colors to be used in the extension
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
    unsandboxed: extUnsandbox,
    unsandboxDisclaimer,
    websiteStuff,
    colors
  }
}

/**
 * Gets the 3 parts of the given val, seperated by a pipe (|)
 * @param {string} val - The value to be split
 * @returns {array} - The 3 parts of the value
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

/**
 * Extracts the text parts and args from the given block text
 * @param {string} rawText - The block text to extract the parts from
 * @returns {array} - The extracted parts
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

/**
 * Assembles the block text from the given parts and arg codes
 * @param {array} parts - The text parts
 * @param {array} args - The arg codes
 * @returns {string} - The assembled block text
 */

function constructBlockText(parts, argCodes) {
  let text = parts.shift();
  for (let i = 0; i < parts.length; i++) {
    text += `[${argCodes[i]}]`;
    text += parts[i];
  }
  return text;
}

/**
 * Extracts the block parts from the given text
 * @param {string} rawVals - The text to extract the parts from
 * @returns {object}
 *  {object} - The extracted parts:
 *    - opcode: string - The block's opcode
 *    - type: string - The block's type
 *    - text: string - The block's text
 *    - args: array - The block's args
 */

function extractBlockParts(rawVal) {
  let blockparts = {};
  let extensionParts = getParts(rawVal);
  if (!extensionParts) {
    return;
  }
  let rawText = extensionParts.shift();
  blockparts.opcode = extensionParts.shift();
  blockparts.type = castBlockType(extensionParts.shift());
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

/**
 * Generates the functions for the given opcodes
 * @param {array} opcodes - The opcodes to generate the functions for
 * @returns {string} - The generated functions
 */

function genrateFuntionsForOpcodes(opcodes) {
  if (!opcodes) {
    return "";
  }
  let functions = "";
  opcodes.forEach(opcode => {
    functions += `
    ${opcode}(args, util) {
      
    }
`;
  });
  return functions;
}