import { X } from 'lucide-react';
import { useEffect, useMemo } from 'react';

function parseMarkdown(text) {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) =>
        `<pre class="analysis-code-block"><code>${code.trim()}</code></pre>`
    );
    html = html.replace(/`([^`]+)`/g, '<code class="analysis-inline-code">$1</code>');
    html = html.replace(/^#### (.+)$/gm, '<h4 class="analysis-h4">$1</h4>');
    html = html.replace(/^### (.+)$/gm, '<h3 class="analysis-h3">$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2 class="analysis-h2">$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1 class="analysis-h1">$1</h1>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/^---$/gm, '<hr class="analysis-hr" />');
    html = html.replace(/^- (.+)$/gm, '<li class="analysis-li">$1</li>');
    html = html.replace(/((?:<li class="analysis-li">.*<\/li>\n?)+)/g, '<ul class="analysis-ul">$1</ul>');
    html = html.replace(/^\d+\. (.+)$/gm, '<li class="analysis-li-ordered">$1</li>');
    html = html.replace(/((?:<li class="analysis-li-ordered">.*<\/li>\n?)+)/g, '<ol class="analysis-ol">$1</ol>');
    html = html.replace(/\n\n/g, '</p><p class="analysis-p">');
    html = `<p class="analysis-p">${html}</p>`;
    html = html.replace(/<p class="analysis-p"><\/p>/g, '');
    html = html.replace(/<p class="analysis-p">(<h[1-4])/g, '$1');
    html = html.replace(/(<\/h[1-4]>)<\/p>/g, '$1');
    html = html.replace(/<p class="analysis-p">(<pre)/g, '$1');
    html = html.replace(/(<\/pre>)<\/p>/g, '$1');
    html = html.replace(/<p class="analysis-p">(<hr)/g, '$1');
    html = html.replace(/<p class="analysis-p">(<ul)/g, '$1');
    html = html.replace(/(<\/ul>)<\/p>/g, '$1');
    html = html.replace(/<p class="analysis-p">(<ol)/g, '$1');
    html = html.replace(/(<\/ol>)<\/p>/g, '$1');
    return html;
}

export default function AnalysisModal({ isOpen, onClose, result }) {
    useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    useEffect(() => {
        function handleEsc(e) { if (e.key === 'Escape' && isOpen) onClose(); }
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [isOpen, onClose]);

    const htmlContent = useMemo(() => parseMarkdown(result), [result]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-panel modal-panel-lg animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-header-left">
                        <div className="modal-header-icon">✦</div>
                        <h2 className="modal-header-title">Analysis Results</h2>
                    </div>
                    <button onClick={onClose} className="modal-close">
                        <X size={18} />
                    </button>
                </div>
                <div className="modal-body">
                    {result ? (
                        <div className="analysis-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
                    ) : (
                        <p className="modal-body-empty">No analysis results yet. Click "Analyze" to get started.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
