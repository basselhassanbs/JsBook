import "./code-editor.css";
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import prettier from "prettier";
import parser from "prettier/parser-babel";

interface CodeEditorProps {
  initialValue: string;
  onChange: (value: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
  const editorRef = useRef<any>();

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeModelContent(() => {
      onChange(editor.getValue());
    });
  };

  //   const handleEditorChange: OnChange = (value, event) => {
  //     onChange(value || "");
  //   };

  const handleFormatClick = () => {
    const unformatted = editorRef.current.getValue();

    const formatted = prettier
      .format(unformatted, {
        parser: "babel",
        plugins: [parser],
        semi: true,
        useTabs: false,
        singleQuote: true,
      })
      .replace(/\n$/, "");

    editorRef.current.setValue(formatted);
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={handleFormatClick}
      >
        Format
      </button>
      <Editor
        height="100%"
        defaultLanguage="javascript"
        defaultValue={initialValue}
        theme="vs-dark"
        // onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          tabSize: 2,
          showUnused: false,
          fontSize: 16,
          folding: false,
          lineNumbersMinChars: 3,
          scrollBeyondLastLine: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
