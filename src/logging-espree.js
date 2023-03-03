import * as escodegen from "escodegen";
import * as espree from "espree";
import * as estraverse from "estraverse";
import * as fs from "fs/promises";

/**
 * @desc Observes the output options and puts the code returned by addLogging() in the output specified
 * @param {*} inputFile File containing the original code
 * @param {*} outputFile File in which to stick the new code
 */
export async function transpile(inputFile, outputFile) {
  let input = await fs.readFile(inputFile, 'utf-8');
  const output = addLogging(input);
  if (outputFile === undefined) {
    console.log(output);
    return;
  }
  console.log(`Output in file: ${outputFile}`)
  await fs.writeFile(outputFile, output);
}

/**
 * @desc Builds the AST and calls upon addBeforeCode() if a function is found
 * @param {*} code Code to analyze
 * @returns The newly transformed AST
 */
export function addLogging(code) {
  const ast = espree.parse(code, { ecmaVersion: 12, loc: true });
  estraverse.traverse(ast, {
    enter: function(node, parent) {
      if (node.type === 'FunctionDeclaration' ||
        node.type === 'FunctionExpression' ||
        node.type === 'ArrowFunctionExpression') {
        addBeforeCode(node);
      }
    }
  });
  return escodegen.generate(ast);
}

/**
 * @desc Adds text after a function detailing it's name, parameters and the line at which it was found
 * @param {*} node Node of the function to analyze
 */
function addBeforeCode(node) {
  const name = node.id ? node.id.name : '<anonymous function>';
  const params = node.params.map(p => '${ ' + p.name + ' }').join(', ');
  const line = node.loc.start.line;
  const beforeCode = "console.log(`Entering " + name + `(` + params + ") at line " + line + "`);";
  const beforeNodes = espree.parse(beforeCode, { ecmaVersion: 12}).body;
  node.body.body = beforeNodes.concat(node.body.body);
}

