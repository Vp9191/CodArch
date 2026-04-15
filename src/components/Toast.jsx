import { useEffect } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const iconMap = { success: CheckCircle, error: XCircle, info: Info };

export default function Toast({ message, type = 'info', isOpen, onClose, duration = 4000 }) {
    useEffect(() => {
        if (isOpen && duration > 0) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const Icon = iconMap[type] || iconMap.info;

    return (
        <div className="toast-wrap animate-slide-left" style={{ animationDuration: '0.3s' }}>
            <div className={`toast-card toast-${type}`}>
                <Icon size={18} className={`toast-icon-${type}`} />
                <p className="toast-message">{message}</p>
                <button onClick={onClose} className="toast-close">
                    <X size={14} />
                </button>
            </div>
        </div>
    );
}
