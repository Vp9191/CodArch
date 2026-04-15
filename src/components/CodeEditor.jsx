import { useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, lineNumbers, highlightActiveLine, highlightActiveLineGutter, keymap } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { oneDark } from '@codemirror/theme-one-dark';
import {
    syntaxHighlighting,
    defaultHighlightStyle,
    bracketMatching,
    foldGutter,
    indentOnInput,
} from '@codemirror/language';
import { closeBrackets } from '@codemirror/autocomplete';
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search';

// Detect language extension from file name
function getLanguageExtension(fileName) {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'jsx':
        case 'mjs':
            return javascript({ jsx: true });
        case 'ts':
        case 'tsx':
            return javascript({ jsx: true, typescript: true });
        case 'py':
            return python();
        case 'html':
            return html();
        case 'css':
            return css();
        case 'java':
            return java();
        case 'c':
        case 'cpp':
        case 'h':
        case 'hpp':
            return cpp();
        default:
            return javascript();
    }
}

// Custom dark theme to match CodArch palette
const codArchTheme = EditorView.theme({
    '&': {
        height: '100%',
        fontSize: '13.5px',
        fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    },
    '.cm-content': {
        caretColor: '#76ABAE',
        padding: '8px 0',
    },
    '.cm-cursor, .cm-dropCursor': {
        borderLeftColor: '#76ABAE',
        borderLeftWidth: '2px',
    },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
        backgroundColor: 'rgba(118, 171, 174, 0.2) !important',
    },
    '.cm-gutters': {
        backgroundColor: '#1a1e25',
        color: 'rgba(238, 238, 238, 0.2)',
        border: 'none',
        paddingRight: '8px',
    },
    '.cm-activeLineGutter': {
        backgroundColor: 'rgba(118, 171, 174, 0.08)',
        color: 'rgba(238, 238, 238, 0.5)',
    },
    '.cm-activeLine': {
        backgroundColor: 'rgba(118, 171, 174, 0.04)',
    },
    '.cm-foldGutter .cm-gutterElement': {
        color: 'rgba(238, 238, 238, 0.15)',
    },
    '.cm-matchingBracket': {
        backgroundColor: 'rgba(118, 171, 174, 0.25)',
        outline: '1px solid rgba(118, 171, 174, 0.4)',
    },
    '.cm-selectionMatch': {
        backgroundColor: 'rgba(118, 171, 174, 0.12)',
    },
    '.cm-searchMatch': {
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        outline: '1px solid rgba(245, 158, 11, 0.5)',
    },
    '.cm-tooltip': {
        backgroundColor: '#31363F',
        border: '1px solid rgba(118, 171, 174, 0.15)',
        borderRadius: '8px',
    },
}, { dark: true });

export default function CodeEditor({ fileName, content, onChange }) {
    const editorRef = useRef(null);
    const viewRef = useRef(null);

    // Create editor
    useEffect(() => {
        if (!editorRef.current) return;

        const langExt = getLanguageExtension(fileName);

        const state = EditorState.create({
            doc: content || '',
            extensions: [
                lineNumbers(),
                highlightActiveLine(),
                highlightActiveLineGutter(),
                history(),
                foldGutter(),
                indentOnInput(),
                bracketMatching(),
                closeBrackets(),
                highlightSelectionMatches(),
                syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
                oneDark,
                codArchTheme,
                langExt,
                keymap.of([
                    ...defaultKeymap,
                    ...historyKeymap,
                    ...searchKeymap,
                    indentWithTab,
                ]),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                }),
                EditorView.lineWrapping,
            ],
        });

        const view = new EditorView({
            state,
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => {
            view.destroy();
            viewRef.current = null;
        };
        // Only re-create when file changes (by fileName identity)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fileName]);

    return (
        <div
            ref={editorRef}
            className="flex-1 overflow-hidden"
            style={{ background: '#1a1e25' }}
        />
    );
}
