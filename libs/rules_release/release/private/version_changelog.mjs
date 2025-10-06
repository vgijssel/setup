// Copied from https://github.com/changesets/action/blob/main/src/utils.ts
import unified from "unified";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import mdastToString from "mdast-util-to-string";
import { readFileSync, writeFileSync } from "fs";

const [_, __, version_file, changelog_file, out_file] = process.argv;
const BumpLevels = {
  dep: 0,
  patch: 1,
  minor: 2,
  major: 3,
};

function getChangelogEntry(changelog, version) {
  let ast = unified().use(remarkParse).parse(changelog);

  let highestLevel = BumpLevels.dep;

  let nodes = ast.children;
  let headingStartInfo;
  let endIndex;

  for (let i = 0; i < nodes.length; i++) {
    let node = nodes[i];
    if (node.type === "heading") {
      let stringified = mdastToString(node);
      let match = stringified.toLowerCase().match(/(major|minor|patch)/);
      if (match !== null) {
        let level = BumpLevels[match[0]];
        highestLevel = Math.max(level, highestLevel);
      }
      if (headingStartInfo === undefined && stringified === version) {
        headingStartInfo = {
          index: i,
          depth: node.depth,
        };
        continue;
      }
      if (
        endIndex === undefined &&
        headingStartInfo !== undefined &&
        headingStartInfo.depth === node.depth
      ) {
        endIndex = i;
        break;
      }
    }
  }
  if (headingStartInfo) {
    ast.children = ast.children.slice(headingStartInfo.index + 1, endIndex);
  }
  return {
    content: unified().use(remarkStringify).stringify(ast),
    highestLevel: highestLevel,
  };
}

const version = readFileSync(version_file, "utf8");
const changelog = readFileSync(changelog_file, "utf8");
const versionChangelog = getChangelogEntry(changelog, version);

console.log(out_file);

writeFileSync(out_file, versionChangelog.content, "utf8");
