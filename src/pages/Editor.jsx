import { useState, useCallback, useEffect, useRef } from 'react';
import ActionBar from '../components/ActionBar';
import FileExplorer from '../components/FileExplorer';
import EditorTabs from '../components/EditorTabs';
import CodeEditor from '../components/CodeEditor';
import CustomConfirm from '../components/CustomConfirm';
import AnalysisModal from '../components/AnalysisModal';
import Toast from '../components/Toast';
import { PanelLeftClose, PanelLeftOpen, Upload } from 'lucide-react';

let nextId = 1;
function generateId() { return `file-${Date.now()}-${nextId++}`; }

const DEFAULT_FILE = {
    id: generateId(),
    name: 'main.js',
    content: '// Welcome to CodArch!\n// Paste your code here and click "Analyze" to get an AI review.\n\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n',
};

export default function Editor() {
    const [files, setFiles] = useState([DEFAULT_FILE]);
    const [activeFileId, setActiveFileId] = useState(DEFAULT_FILE.id);
    const [openTabIds, setOpenTabIds] = useState([DEFAULT_FILE.id]);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [showResults, setShowResults] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef(null);
    const [confirmState, setConfirmState] = useState({ open: false, title: '', message: '', onConfirm: null });
    const [toast, setToast] = useState({ open: false, message: '', type: 'info' });

    const showToast = useCallback((message, type = 'info') => {
        setToast({ open: true, message, type });
    }, []);

    const activeFile = files.find((f) => f.id === activeFileId);

    function handleAddFile() {
        const newFile = { id: generateId(), name: `file${files.length + 1}.js`, content: '' };
        setFiles((p) => [...p, newFile]);
        setOpenTabIds((p) => [...p, newFile.id]);
        setActiveFileId(newFile.id);
        showToast('New file created', 'success');
    }

    function handleSelectFile(id) {
        setActiveFileId(id);
        if (!openTabIds.includes(id)) setOpenTabIds((p) => [...p, id]);
    }

    function handleCloseTab(id) {
        const newTabs = openTabIds.filter((t) => t !== id);
        setOpenTabIds(newTabs);
        if (activeFileId === id) setActiveFileId(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null);
    }

    function handleDeleteFile(id) {
        const file = files.find((f) => f.id === id);
        setConfirmState({
            open: true, title: 'Delete File',
            message: `Are you sure you want to delete "${file?.name}"?`,
            onConfirm: () => {
                setFiles((p) => p.filter((f) => f.id !== id));
                setOpenTabIds((p) => p.filter((t) => t !== id));
                if (activeFileId === id) {
                    const remaining = files.filter((f) => f.id !== id);
                    setActiveFileId(remaining.length > 0 ? remaining[0].id : null);
                }
                setConfirmState({ open: false });
                showToast('File deleted', 'info');
            },
        });
    }

    function handleRenameFile(id, newName) {
        setFiles((p) => p.map((f) => (f.id === id ? { ...f, name: newName } : f)));
    }

    function handleContentChange(newContent) {
        setFiles((p) => p.map((f) => (f.id === activeFileId ? { ...f, content: newContent } : f)));
    }

    function readFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ name: file.name, content: e.target.result });
            reader.onerror = () => resolve({ name: file.name, content: `// Error reading ${file.name}` });
            reader.readAsText(file);
        });
    }

    async function handleFileUpload(fileList) {
        const uploaded = [];
        for (const file of fileList) {
            if (file.size > 1024 * 512) { showToast(`${file.name} is too large (max 512KB)`, 'error'); continue; }
            const { name, content } = await readFile(file);
            uploaded.push({ id: generateId(), name, content });
        }
        if (uploaded.length > 0) {
            setFiles((p) => [...p, ...uploaded]);
            setOpenTabIds((p) => [...p, ...uploaded.map((f) => f.id)]);
            setActiveFileId(uploaded[0].id);
            showToast(`${uploaded.length} file(s) uploaded`, 'success');
        }
    }

    function handleDrop(e) { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length > 0) handleFileUpload(Array.from(e.dataTransfer.files)); }
    function handleDragOver(e) { e.preventDefault(); setIsDragOver(true); }
    function handleDragLeave(e) { e.preventDefault(); setIsDragOver(false); }
    function handleFilePicker() { fileInputRef.current?.click(); }
    function onFileInputChange(e) { if (e.target.files.length > 0) { handleFileUpload(Array.from(e.target.files)); e.target.value = ''; } }

    useEffect(() => {
        function handleKeyDown(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); handleAnalyze(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') { e.preventDefault(); handleAddFile(); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') { e.preventDefault(); setSidebarCollapsed((p) => !p); }
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') { e.preventDefault(); handleFilePicker(); }
        }
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    });

    async function handleAnalyze() {
        if (files.length === 0) { showToast('No files to analyze', 'error'); return; }
        const nonEmptyFiles = files.filter((f) => f.content.trim());
        if (nonEmptyFiles.length === 0) { showToast('All files are empty', 'error'); return; }
        setIsAnalyzing(true);
        showToast('Starting AI analysis...', 'info');
        try {
            const { analyzeCode } = await import('../services/gemini.js');
            const result = await analyzeCode(nonEmptyFiles);
            setAnalysisResult(result);
            showToast('Analysis complete!', 'success');
        } catch (err) {
            console.error('[CodArch] Analysis error:', err);
            showToast(err.message || 'Analysis failed. Check your API key.', 'error');
        } finally {
            setIsAnalyzing(false);
        }
    }

    function handleShare() {
        const allCode = files.map((f) => `// === ${f.name} ===\n${f.content}`).join('\n\n');
        navigator.clipboard.writeText(allCode).then(() => showToast('Code copied to clipboard!', 'success'))
            .catch(() => showToast('Failed to copy', 'error'));
    }

    function handleClearAll() {
        setConfirmState({
            open: true, title: 'Clear All Files',
            message: 'This will delete all files and their contents. Are you sure?',
            onConfirm: () => {
                const freshFile = { id: generateId(), name: 'main.js', content: '' };
                setFiles([freshFile]); setActiveFileId(freshFile.id); setOpenTabIds([freshFile.id]);
                setAnalysisResult(null); setConfirmState({ open: false }); showToast('All files cleared', 'info');
            },
        });
    }

    return (
        <div className="editor-page" onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
            <input ref={fileInputRef} type="file" multiple onChange={onFileInputChange} style={{ display: 'none' }}
                accept=".js,.jsx,.ts,.tsx,.py,.html,.css,.java,.c,.cpp,.h,.hpp,.json,.md,.txt,.xml,.yaml,.yml,.sh,.sql,.rb,.go,.rs,.php,.swift,.kt" />

            {isDragOver && (
                <div className="drag-overlay animate-fade-in">
                    <div className="drag-overlay-inner">
                        <Upload size={48} className="drag-overlay-icon" />
                        <p className="drag-overlay-title">Drop files to upload</p>
                        <p className="drag-overlay-sub">Supported: JS, TS, Python, HTML, CSS, Java, C/C++, and more</p>
                    </div>
                </div>
            )}

            <ActionBar onAnalyze={handleAnalyze} onShare={handleShare} onClearAll={handleClearAll}
                onShowResults={() => setShowResults(true)} isAnalyzing={isAnalyzing} hasResults={!!analysisResult} />

            <div className="editor-main">
                <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="sidebar-toggle-mobile">
                    {sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
                </button>

                <FileExplorer files={files} activeFileId={activeFileId} onSelectFile={handleSelectFile}
                    onDeleteFile={handleDeleteFile} onRenameFile={handleRenameFile} onAddFile={handleAddFile}
                    isCollapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)} />

                <div className="editor-area">
                    <EditorTabs files={files} openTabIds={openTabIds} activeFileId={activeFileId}
                        onSelectFile={handleSelectFile} onCloseTab={handleCloseTab} onAddFile={handleAddFile} />

                    {activeFile ? (
                        <CodeEditor key={activeFile.id} fileName={activeFile.name}
                            content={activeFile.content} onChange={handleContentChange} />
                    ) : (
                        <div className="editor-empty">
                            <div className="editor-empty-inner animate-fade-in">
                                <div className="editor-empty-logo">CA</div>
                                <p className="editor-empty-text">No file selected</p>
                                <button onClick={handleAddFile} className="editor-empty-btn">+ Create a new file</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <AnalysisModal isOpen={showResults} onClose={() => setShowResults(false)} result={analysisResult} />
            <CustomConfirm isOpen={confirmState.open} title={confirmState.title} message={confirmState.message}
                onConfirm={confirmState.onConfirm} onCancel={() => setConfirmState({ open: false })} />
            <Toast isOpen={toast.open} message={toast.message} type={toast.type} onClose={() => setToast({ open: false })} />
        </div>
    );
}
