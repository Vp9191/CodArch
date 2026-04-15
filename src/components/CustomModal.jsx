import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function CustomModal({ isOpen, onClose, title, children }) {
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay animate-fade-in" onClick={onClose}>
            <div className="modal-panel modal-panel-sm animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                {title && (
                    <div className="modal-header">
                        <h2 className="modal-header-title">{title}</h2>
                        <button onClick={onClose} className="modal-close">
                            <X size={18} />
                        </button>
                    </div>
                )}
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}
