"use client";

import React, { useEffect, useRef } from "react";

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

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      if (!editorRef.current || quillRef.current) return;

      const QuillModule = await import("quill");
      const Quill = (QuillModule as any).default ?? QuillModule;

      // @ts-ignore
      await import("quill/dist/quill.snow.css");

      if (!mounted) return;

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
                  "#216869", // primary
                  "#49a078", // accent
                  "#9cc5a1", // secondary / muted
                  "#1f2421", // dark neutral
                  "#dce1de", // light neutral
                ],
              },
              {
                background: [
                  "#49a078",
                  "#216869",
                  "#9cc5a1",
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
      mounted = false;
    };
  }, []);

  // ✅ Sync external value WITHOUT breaking Quill
  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;

    if (value !== lastValueRef.current) {
      quill.clipboard.dangerouslyPasteHTML(value || "");
      lastValueRef.current = value || "";
    }
  }, [value]);

  return (
    <div className="w-full">
      <style jsx global>{`
        /* ================================
           QUILL – THEME SAFE (LIGHT + DARK)
        ================================= */

        .ql-toolbar.ql-snow {
          background: var(--background-atelier, rgba(255, 255, 255, 0.02));
          backdrop-blur: 40px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px 24px 0 0;
          padding: 12px;
          margin-bottom: 0;
        }

        .ql-container.ql-snow {
          background: var(--background-atelier, rgba(255, 255, 255, 0.01));
          backdrop-blur: 40px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-top: none;
          border-radius: 0 0 32px 32px;
        }

        /* Toolbar buttons */
        .ql-toolbar button {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .ql-toolbar button:hover {
          background: rgba(153, 255, 51, 0.1);
        }

        .ql-toolbar button.ql-active {
          background: var(--primary);
        }

        .ql-toolbar button.ql-active .ql-stroke {
          stroke: var(--primary-foreground);
        }

        .ql-toolbar button.ql-active .ql-fill {
          fill: var(--primary-foreground);
        }

        /* Icons */
        .ql-stroke {
          stroke: rgba(255, 255, 255, 0.4);
        }

        .ql-fill {
          fill: rgba(255, 255, 255, 0.4);
        }

        /* Pickers */
        .ql-picker-label {
          color: rgba(255, 255, 255, 0.4);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .ql-picker-label:hover {
          background: rgba(153, 255, 51, 0.1);
        }

        .ql-picker-options {
          background: var(--background);
          backdrop-blur: 3xl;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 8px;
        }

        .ql-picker-item {
          color: rgba(255, 255, 255, 0.4);
          border-radius: 8px;
        }

        .ql-picker-item:hover {
          background: rgba(153, 255, 51, 0.1);
          color: var(--primary);
        }

        .ql-picker-item.ql-selected {
          background: var(--primary);
          color: var(--primary-foreground);
        }

        /* Editor */
        .ql-editor {
          min-height: 500px;
          padding: 40px;
          font-family: var(--font-serif);
          font-size: 20px;
          line-height: 1.8;
          color: var(--foreground);
        }

        .ql-editor.ql-blank::before {
          color: rgba(255, 255, 255, 0.1);
          opacity: 1;
          font-style: italic;
          left: 40px;
        }
      `}</style>

      <div ref={editorRef} />
    </div>
  );
};
