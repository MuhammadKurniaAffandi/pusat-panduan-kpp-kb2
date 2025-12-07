import { Node, mergeAttributes } from "@tiptap/core";

export default Node.create({
  name: "detailsSummary",

  // summary behaves like a block but holds inline content (phrasing)
  group: "block",

  content: "inline*",

  selectable: true,
  draggable: false,

  parseHTML() {
    return [{ tag: "summary" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["summary", mergeAttributes(HTMLAttributes), 0];
  },

  addKeyboardShortcuts() {
    return {
      // allow Enter in summary to create a new paragraph inside detailsContent
      Enter: () => {
        return false;
      },
    };
  },
});
