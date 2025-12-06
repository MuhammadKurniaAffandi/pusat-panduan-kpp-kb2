import React from "react";
import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
export default function Component() {
  return (
    <NodeViewWrapper className="react-component">
      <label contentEditable={false}>React Component</label>

      <NodeViewContent className="content is-editable" />
    </NodeViewWrapper>
  );
}
