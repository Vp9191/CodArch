import { FileText, Trash2, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

export default function FileExplorer({ files, activeFileId, onSelectFile, onDeleteFile, onRenameFile, onAddFile, isCollapsed }) {
    const [renamingId, setRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');

    function startRename(file) { setRenamingId(file.id); setRenameValue(file.name); }

    function commitRename() {
        if (renameValue.trim() && renamingId) onRenameFile(renamingId, renameValue.trim());
        setRenamingId(null); setRenameValue('');
    }

    function handleRenameKeyDown(e) {
        if (e.key === 'Enter') commitRename();
        if (e.key === 'Escape') { setRenamingId(null); setRenameValue(''); }
    }

    return (
        <div
            className="file-explorer"
            style={{
                width: isCollapsed ? '0px' : '220px',
                minWidth: isCollapsed ? '0px' : '220px',
                borderRight: isCollapsed ? 'none' : '1px solid var(--glass-border)',
            }}
        >
            <div className="file-explorer-header">
                <span className="file-explorer-label">Files</span>
                <button onClick={onAddFile} className="file-explorer-add" title="New File">
                    <Plus size={15} />
                </button>
            </div>

            <div className="file-explorer-list">
                {files.map((file) => (
                    <div
                        key={file.id}
                        className={`file-item ${activeFileId === file.id ? 'active' : ''}`}
                        onClick={() => onSelectFile(file.id)}
                    >
                        <FileText size={14} className="file-item-icon" />

                        {renamingId === file.id ? (
                            <input
                                autoFocus
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onBlur={commitRename}
                                onKeyDown={handleRenameKeyDown}
                                className="file-item-rename"
                            />
                        ) : (
                            <span className="file-item-name">{file.name}</span>
                        )}

                        <div className="file-item-actions">
                            <button
                                onClick={(e) => { e.stopPropagation(); startRename(file); }}
                                className="file-item-action rename"
                                title="Rename"
                            >
                                <Pencil size={12} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDeleteFile(file.id); }}
                                className="file-item-action delete"
                                title="Delete"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    </div>
                ))}

                {files.length === 0 && (
                    <div className="file-empty">
                        <p className="file-empty-text">No files yet</p>
                        <button onClick={onAddFile} className="file-empty-btn">+ Add a file</button>
                    </div>
                )}
            </div>
        </div>
    );
}
