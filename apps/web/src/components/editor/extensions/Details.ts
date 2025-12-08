import { Node, mergeAttributes } from "@tiptap/core";

export interface DetailsOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    details: {
      toggleDetails: () => ReturnType;
      setDetails: (attrs?: Record<string, unknown>) => ReturnType;
    };
  }
}

export default Node.create<DetailsOptions>({
  name: "details",

  group: "block",

  content: "detailsSummary detailsContent",

  addOptions() {
    return {
      HTMLAttributes: { class: "details-block" },
    };
  },

  addAttributes() {
    return {
      open: {
        default: false,
        parseHTML: (el) => el.hasAttribute("open"),
        renderHTML: (attrs) => (attrs.open ? { open: "" } : {}),
      },
      class: {
        default: this.options.HTMLAttributes.class,
        parseHTML: (el) =>
          el.getAttribute("class") || this.options.HTMLAttributes.class,
        renderHTML: (attrs) => ({ class: attrs.class }),
      },
    };
  },

  parseHTML() {
    return [{ tag: "details" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["details", mergeAttributes(HTMLAttributes), 0];
  },

  addCommands() {
    return {
      toggleDetails:
        () =>
        ({ commands }) => {
          // ✅ Fixed: Tambahkan type annotation untuk attrs
          return commands.updateAttributes(
            "details",
            (attrs: Record<string, unknown>) => ({
              ...(attrs || {}),
              open: !Boolean(attrs?.open),
            })
          );
        },
      setDetails:
        (attrs = {}) =>
        ({ commands }) => {
          return commands.insertContent({
            type: "details",
            attrs,
            content: [
              {
                type: "detailsSummary",
                content: [{ type: "text", text: "Summary" }],
              },
              {
                type: "detailsContent",
                content: [
                  {
                    type: "paragraph",
                    content: [{ type: "text", text: "Content…" }],
                  },
                ],
              },
            ],
          });
        },
    };
  },

  /**
   * NodeView: create a DOM details element, listen clicks on summary,
   * and sync the open attribute to the editor document.
   */
  addNodeView() {
    return ({ node, getPos, editor }) => {
      // create root <details>
      const dom = document.createElement("details");
      dom.className =
        node.attrs.class ||
        this.options.HTMLAttributes.class ||
        "details-block";
      if (node.attrs.open) dom.setAttribute("open", "");

      const onClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;

        const summaryEl = target.closest("summary");
        if (!summaryEl) return;

        // prevent ProseMirror from interfering
        event.preventDefault();
        event.stopPropagation();

        // Toggle open attribute on DOM immediately for visual feedback
        const isOpen = dom.hasAttribute("open");
        if (isOpen) dom.removeAttribute("open");
        else dom.setAttribute("open", "");

        // Update the node attribute in the document so it persists in state
        const pos = (typeof getPos === "function" ? getPos() : getPos) as
          | number
          | null;
        if (pos === null || pos === undefined) return;

        const tr = editor.state.tr.setNodeMarkup(pos, undefined, {
          ...(node.attrs || {}),
          open: !isOpen,
          class: dom.className,
        });
        editor.view.dispatch(tr);
      };

      dom.addEventListener("click", onClick);

      return {
        dom,
        contentDOM: dom,
        ignoreMutation: (mutation) => {
          // ignore attribute changes (we manage them)
          if (
            mutation.type === "attributes" &&
            (mutation.attributeName === "open" ||
              mutation.attributeName === "class")
          ) {
            return true;
          }
          return false;
        },
        destroy() {
          dom.removeEventListener("click", onClick);
        },
      };
    };
  },
});
