import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { tags } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

// Custom SQL syntax highlighting theme for light mode
const sqlTheme = createTheme({
  theme: "light",
  settings: {
    background: "transparent",
    foreground: "#334155",
    caret: "#0f172a",
    selection: "rgba(59, 130, 246, 0.2)",
    selectionMatch: "rgba(59, 130, 246, 0.2)",
    lineHighlight: "rgba(0, 0, 0, 0.02)",
  },
  styles: [
    { tag: tags.keyword, color: "#dc2626" }, // SELECT, FROM, WHERE
    { tag: tags.operator, color: "#2563eb" }, // =, >, <
    { tag: tags.string, color: "#059669" }, // String literals
    { tag: tags.comment, color: "#6b7280", fontStyle: "italic" }, // Comments
    { tag: tags.number, color: "#7c3aed" }, // Numbers
    { tag: tags.variableName, color: "#374151" }, // Column names
    { tag: tags.typeName, color: "#dc2626" }, // Data types
    { tag: tags.function(tags.variableName), color: "#7c3aed" }, // Functions
    { tag: tags.propertyName, color: "#2563eb" }, // Properties
    { tag: tags.definition(tags.propertyName), color: "#ea580c" }, // Table names
  ],
});

interface SqlEditorProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SqlEditor({ query, setQuery }: SqlEditorProps) {
  return (
    <div className="border-b border-slate-200 bg-white sql-editor">
      <style jsx global>{`
        .sql-editor .cm-editor {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 14px;
          line-height: 1.5;
        }
        .sql-editor .cm-content {
          padding: 16px 0;
        }
        .sql-editor .cm-line {
          padding: 0 20px;
        }
        .sql-editor .cm-gutters {
          background-color: transparent;
          color: #9ca3af;
          border-right: 1px solid #e5e7eb;
        }
        .sql-editor .cm-activeLineGutter {
          background-color: transparent;
          color: #6b7280;
        }
        .sql-editor .cm-activeLine {
          background-color: rgba(59, 130, 246, 0.05);
        }
        .sql-editor .cm-selectionBackground {
          background-color: rgba(59, 130, 246, 0.2);
        }
        .sql-editor .cm-cursor {
          border-left: 2px solid #0f172a;
        }
      `}</style>
      <CodeMirror
        value={query}
        height="160px"
        extensions={[sql()]}
        theme={sqlTheme}
        onChange={(value) => setQuery(value)}
        placeholder="SELECT * FROM users LIMIT 100;"
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          highlightSelectionMatches: true,
          foldGutter: false,
          dropCursor: false,
          allowMultipleSelections: false,
          indentOnInput: true,
          bracketMatching: true,
        }}
      />
    </div>
  );
}
