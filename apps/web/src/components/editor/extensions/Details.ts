import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";
import type { Node as ProseMirrorNode } from "prosemirror-model";
import type { Editor as TiptapEditor } from "@tiptap/core";

export interface DetailsOptions {
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    details: {
      toggleDetails: () => ReturnType;
      setDetails: (attrs?: Record<string, any>) => ReturnType;
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
        ({ commands, state }) => {
          const { selection } = state;
          const pos = selection.$from.before(selection.$from.depth);
          // simple attempt: update nearest ancestor details if selection inside it
          return commands.updateAttributes("details", (attrs) => ({
            ...(attrs || {}),
            open: !Boolean(attrs?.open),
          }));
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

      // We don't create inner DOM for children here - ProseMirror will render child nodes inside 'contentDOM'.
      // But to ensure children are rendered in correct order, we create a wrapper element where content will be appended.
      // Using the details element itself as the contentDOM works: ProseMirror will append child nodes as children of details.
      // We'll attach an event listener to the details element to handle clicks on <summary>.
      const onClick = (event: MouseEvent) => {
        // if click happened inside an editable element (like when selecting text), ignore unless it's summary element itself
        // find the nearest summary ancestor of the clicked target (if any)
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

      // Return node view with 'dom' and 'contentDOM' where ProseMirror will render the child nodes.
      // We let ProseMirror render child nodes directly into the details element (contentDOM = dom).
      // That will produce <details><summary>...</summary><div class="details-content">...</div></details>
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
