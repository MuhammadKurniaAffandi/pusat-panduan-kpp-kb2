// apps/web/src/components/editor/extensions/DetailsContent.ts
import { Node, mergeAttributes } from "@tiptap/core";

export default Node.create({
  name: "detailsContent",

  group: "block",

  content: "block*",

  parseHTML() {
    // internal content container — in HTML it's often a <div> or directly children nodes
    return [{ tag: "div" }, { tag: "details > *:not(summary)" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes({ class: "details-content" }, HTMLAttributes),
      0,
    ];
  },
});
