import { X, Plus } from 'lucide-react';

export default function EditorTabs({ files, openTabIds, activeFileId, onSelectFile, onCloseTab, onAddFile }) {
    const openFiles = openTabIds.map((id) => files.find((f) => f.id === id)).filter(Boolean);

    return (
        <div className="editor-tabs">
            {openFiles.map((file) => (
                <div
                    key={file.id}
                    className={`editor-tab ${activeFileId === file.id ? 'active' : ''}`}
                    onClick={() => onSelectFile(file.id)}
                >
                    <span className="editor-tab-name">{file.name}</span>
                    <button
                        onClick={(e) => { e.stopPropagation(); onCloseTab(file.id); }}
                        className="editor-tab-close"
                    >
                        <X size={12} />
                    </button>
                </div>
            ))}

            <button onClick={onAddFile} className="editor-tab-add" title="New File">
                <Plus size={14} />
            </button>
        </div>
    );
}
