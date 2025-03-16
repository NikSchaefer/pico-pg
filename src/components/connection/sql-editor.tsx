import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { tags } from "@lezer/highlight";
import { createTheme } from "@uiw/codemirror-themes";

// Custom SQL syntax highlighting theme for dark mode
const sqlTheme = createTheme({
  theme: "dark",
  settings: {
    background: "transparent",
    foreground: "#f2f2f2",
    caret: "#ffffff",
    selection: "rgba(59, 130, 246, 0.3)",
    selectionMatch: "rgba(59, 130, 246, 0.3)",
    lineHighlight: "rgba(255, 255, 255, 0.07)",
  },
  styles: [
    { tag: tags.keyword, color: "#ff7b72" }, // SELECT, FROM, WHERE
    { tag: tags.operator, color: "#79c0ff" }, // =, >, <
    { tag: tags.string, color: "#a5d6ff" }, // String literals
    { tag: tags.comment, color: "#8b949e", fontStyle: "italic" }, // Comments
    { tag: tags.number, color: "#d2a8ff" }, // Numbers
    { tag: tags.variableName, color: "#c9d1d9" }, // Column names
    { tag: tags.typeName, color: "#ff7b72" }, // Data types
    { tag: tags.function(tags.variableName), color: "#d2a8ff" }, // Functions
    { tag: tags.propertyName, color: "#79c0ff" }, // Properties
    { tag: tags.definition(tags.propertyName), color: "#ffa657" }, // Table names
  ],
});

interface SqlEditorProps {
  query: string;
  setQuery: (query: string) => void;
}

export default function SqlEditor({ query, setQuery }: SqlEditorProps) {
  return (
    <div className="border-b border-slate-700 sql-editor">
      <style jsx global>{`
        .sql-editor .cm-editor {
          font-family:
            ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 16px;
        }
        .sql-editor .cm-content {
          padding: 8px 0;
        }
        .sql-editor .cm-line {
          padding: 0 16px;
        }
        .sql-editor .cm-gutters {
          background-color: transparent;
          color: #6c6c8a;
        }
        .sql-editor .cm-activeLineGutter {
          background-color: transparent;
        }
        .sql-editor .cm-activeLine {
          background-color: transparent;
        }
      `}</style>
      <CodeMirror
        value={query}
        height="140px"
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
