function constructExtension() {
  let extension = extensionRaw.value;
  let lines = extension.split("\n");
  let ext = getOtherExtData();
  let constructed = `${ext.websiteStuff}(function(Scratch) {
  "use strict";
${ext.unsandboxDisclaimer}
  class ${ext.class} {
    getInfo() {
      return {
        id: "${ext.id}",
        name: "${ext.name}",${ext.colors}
        blocks: [`;
  let i = 0;
  let blockOpcodes = [];
  lines.forEach(line => {
    i++;
    let block = extractBlockParts(line);
    if (!block) {
      return;
    }
    if (block.type !== "LABEL") {
      blockOpcodes.push(block.opcode);
    }
    constructed += constructBlock(block);
    if (!(i === lines.length)) {
      constructed += ",";
    }
  });
  constructed += `
        ],
      };
    }

    ${genrateFuntionsForOpcodes(blockOpcodes)}
  }
  Scratch.extensions.register(new ${ext.class}());
})(Scratch);`;
  extensionDisplay.value = constructed;
}

