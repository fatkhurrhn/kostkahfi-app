import React from 'react';
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from 'lexical';
import { INSERT_UNORDERED_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND } from '@lexical/list';
// import { INSERT_LINK_COMMAND } from '@lexical/link';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-300 bg-gray-50">
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold')}
        title="Bold"
      >
        <i className="ri-bold"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic')}
        title="Italic"
      >
        <i className="ri-italic"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline')}
        title="Underline"
      >
        <i className="ri-underline"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left')}
        title="Align Left"
      >
        <i className="ri-align-left"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center')}
        title="Align Center"
      >
        <i className="ri-align-center"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right')}
        title="Align Right"
      >
        <i className="ri-align-right"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND)}
        title="Bullet List"
      >
        <i className="ri-list-unordered"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND)}
        title="Numbered List"
      >
        <i className="ri-list-ordered"></i>
      </button>
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => {
          const url = prompt('Enter URL:');
          if (url) editor.dispatchCommand(INSERT_LINK_COMMAND, url);
        }}
        title="Insert Link"
      >
        <i className="ri-link"></i>
      </button>
    </div>
  );
}