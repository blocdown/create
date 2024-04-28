/**
 * @param {array} args
 * @returns {string}
*/

function constructArgs(args) {
  let constructed = `            arguments: {`;
  let i = 0;
  args.forEach(arg => {
    i++;
    if (arg.type === "IMAGE") {
      constructed += `
              ${arg.name}: {
                type: Scratch.ArgumentType.IMAGE,
                dataURI: ${arg.defaultVal}
              }`;
    } else if (arg.type === "BOOLEAN" || arg.type === "COSTUME" || arg.type === "SOUND") {
      constructed += `
              ${arg.name}: {
                type: Scratch.ArgumentType.${arg.type}
              }`;
    } else {
      constructed += `
              ${arg.name}: {
                type: Scratch.ArgumentType.${arg.type},
                defaultValue: "${arg.defaultVal}"
              }`;
    }
    if (i !== args.length) {
      constructed += ",";
    }
  });
  constructed += `
            }`;
  return constructed;
}

/**
 * @param {object} block
 * @returns {string}
*/

function constructBlock(block) {
  if (!block) {
    return;
  }
  let constructed = "";
  if (block.type === "BUTTON") {
    constructed = `
          {
            func: "${block.opcode}",
            blockType: Scratch.BlockType.BUTTON,
            text: "${block.text}",
          }`;
  } else if (block.type === "LABEL") {
    constructed = `
          {
            blockType: Scratch.BlockType.LABEL,
            text: "${block.text}",
          }`;
  } else if (!block.args) {
    constructed = `
          {
            opcode: "${block.opcode}",
            blockType: Scratch.BlockType.${block.type},
            text: "${block.text}",
          }`;
  } else {
    constructed = `
          {
            opcode: "${block.opcode}",
            blockType: Scratch.BlockType.${block.type},
            text: "${block.text}",
${constructArgs(block.args)}
          }`;
  }
  return constructed;
}
