import { AlertTriangle } from 'lucide-react';

export default function CustomConfirm({ isOpen, onConfirm, onCancel, title, message }) {
    if (!isOpen) return null;

    return (
        <div className="confirm-overlay animate-fade-in" onClick={onCancel}>
            <div className="confirm-panel animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
                <div className="confirm-body">
                    <div className="confirm-icon">
                        <AlertTriangle size={20} style={{ color: '#f59e0b' }} />
                    </div>
                    <div>
                        <h3 className="confirm-title">{title || 'Are you sure?'}</h3>
                        <p className="confirm-message">{message || 'This action cannot be undone.'}</p>
                    </div>
                </div>
                <div className="confirm-actions">
                    <button onClick={onCancel} className="confirm-btn-cancel">Cancel</button>
                    <button onClick={onConfirm} className="confirm-btn-danger">Confirm</button>
                </div>
            </div>
        </div>
    );
}
