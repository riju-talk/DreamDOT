"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const quillRef = useRef<any>(null);
  const lastValueRef = useRef<string>("");
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let isMounted = true;

    const init = async () => {
      if (!editorRef.current || quillRef.current) return;

      const QuillModule = await import("quill");
      const Quill = (QuillModule as any).default ?? QuillModule;

      // @ts-ignore
      await import("quill/dist/quill.snow.css");

      if (!isMounted) return;

      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Start writing your dream...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline", "strike"],
            [{ header: [1, 2, 3, false] }],
            [{ list: "ordered" }, { list: "bullet" }],
            [
              {
                color: [
                  "#99FF33", // primary (dark)
                  "#5F8F2F", // primary (light)
                  "#6B8E6E", // secondary
                  "#FFFFFF", // white
                  "#000000", // black
                ],
              },
              {
                background: [
                  "#99FF33",
                  "#5F8F2F",
                  "#6B8E6E",
                ],
              },
            ],
            ["link"],
            ["clean"],
          ],
        },
      });

      quillRef.current = quill;

      // ✅ Correct initial content load
      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
        lastValueRef.current = value;
      }

      // ✅ Let Quill manage its state
      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        lastValueRef.current = html;
        onChange(html);
      });
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [mounted]);

  // ✅ Sync external value WITHOUT breaking Quill
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    if (value !== lastValueRef.current) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
      lastValueRef.current = value || "";
    }
  }, [value]);

  if (!mounted) {
    return (
      <div className="w-full h-96 bg-muted/50 rounded-lg border border-border/30 flex items-center justify-center">
        <p className="text-muted-foreground text-sm">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <style jsx global>{`
        /* ================================
           QUILL – UNIVERSAL THEME (LIGHT + DARK)
        ================================= */

        :root,
        .dark,
        .light {
          --ql-bg: var(--background);
          --ql-text: var(--foreground);
          --ql-primary: var(--primary);
          --ql-primary-fg: var(--primary-foreground);
          --ql-border: var(--border);
          --ql-muted: var(--muted);
          --ql-muted-fg: var(--muted-foreground);
        }

        .ql-toolbar.ql-snow {
          background: transparent;
          border: 1px solid var(--ql-border);
          border-radius: 12px 12px 0 0;
          padding: 12px 8px;
          margin-bottom: 0;
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .ql-container.ql-snow {
          background: transparent;
          border: 1px solid var(--ql-border);
          border-top: none;
          border-radius: 0 0 12px 12px;
          font-size: 16px;
        }

        /* Toolbar button styling */
        .ql-toolbar button {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          transition: all 0.2s ease;
          background: transparent;
          border: 1px solid transparent;
          padding: 4px;
        }

        .ql-toolbar button:hover {
          background: var(--ql-primary);
          background-opacity: 0.1;
        }

        .ql-toolbar button.ql-active {
          background: var(--ql-primary);
          color: var(--ql-primary-fg);
        }

        .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--ql-primary-fg);
        }

        .ql-toolbar button.ql-active .ql-fill {
          fill: var(--ql-primary-fg);
        }

        /* Icons */
        .ql-stroke {
          stroke: var(--ql-muted-fg);
          transition: stroke 0.2s ease;
        }

        .ql-fill {
          fill: var(--ql-muted-fg);
          transition: fill 0.2s ease;
        }

        /* Pickers */
        .ql-picker-label {
          color: var(--ql-muted-fg);
          border-radius: 8px;
          transition: all 0.2s ease;
          padding: 4px 8px;
          border: 1px solid transparent;
        }

        .ql-picker-label:hover {
          background: rgba(var(--ql-primary), 0.1);
        }

        .ql-picker-options {
          background: var(--ql-bg);
          border: 1px solid var(--ql-border);
          border-radius: 12px;
          padding: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .ql-picker-item {
          color: var(--ql-muted-fg);
          border-radius: 6px;
          transition: all 0.2s ease;
          padding: 4px 8px;
        }

        .ql-picker-item:hover {
          background: rgba(var(--ql-primary), 0.1);
          color: var(--ql-primary);
        }

        .ql-picker-item.ql-selected {
          background: var(--ql-primary);
          color: var(--ql-primary-fg);
        }

        /* Editor content */
        .ql-editor {
          min-height: 400px;
          padding: 32px;
          font-family: inherit;
          font-size: 16px;
          line-height: 1.8;
          color: var(--ql-text);
        }

        .ql-editor.ql-blank::before {
          color: var(--ql-muted-fg);
          opacity: 0.6;
          font-style: italic;
          left: 32px;
        }

        /* Link styling */
        .ql-editor a {
          color: var(--ql-primary);
          text-decoration: underline;
        }

        /* List styling */
        .ql-editor ol,
        .ql-editor ul {
          padding-left: 1.5em;
          margin: 0.5em 0;
        }

        .ql-editor li {
          margin-bottom: 0.25em;
        }

        /* Header styling */
        .ql-editor h1,
        .ql-editor h2,
        .ql-editor h3 {
          margin: 0.75em 0 0.5em 0;
          font-weight: 700;
          line-height: 1.2;
        }

        .ql-editor h1 {
          font-size: 2em;
        }

        .ql-editor h2 {
          font-size: 1.5em;
        }

        .ql-editor h3 {
          font-size: 1.25em;
        }

        /* Blockquote styling */
        .ql-editor blockquote {
          border-left: 4px solid var(--ql-primary);
          margin: 0.5em 0;
          padding: 0.5em 1em;
          background: rgba(var(--ql-primary), 0.05);
        }

        /* Code block styling */
        .ql-editor pre {
          background: var(--ql-muted);
          border-radius: 8px;
          padding: 12px;
          margin: 0.5em 0;
          overflow-x: auto;
        }

        .ql-editor code {
          font-family: 'Monaco', 'Courier New', monospace;
          font-size: 0.9em;
        }
      `}</style>

      <div ref={editorRef} />
    </div>
  );
};
