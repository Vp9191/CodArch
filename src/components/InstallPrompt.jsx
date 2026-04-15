import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Check if already dismissed this session
        if (sessionStorage.getItem('pwa-dismissed')) {
            setDismissed(true);
        }

        function handleBeforeInstall(e) {
            e.preventDefault();
            setDeferredPrompt(e);
            // Show install prompt after a short delay
            setTimeout(() => setShowPrompt(true), 3000);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        // Hide if already installed
        window.addEventListener('appinstalled', () => {
            setShowPrompt(false);
            setDeferredPrompt(null);
            console.log('[CodArch] PWA installed');
        });

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    async function handleInstall() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log('[CodArch] Install prompt outcome:', outcome);
        setDeferredPrompt(null);
        setShowPrompt(false);
    }

    function handleDismiss() {
        setShowPrompt(false);
        setDismissed(true);
        sessionStorage.setItem('pwa-dismissed', 'true');
    }

    if (!showPrompt || dismissed || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[90] animate-slide-left" style={{ animationDuration: '0.4s' }}>
            <div
                className="flex items-center gap-4 px-5 py-4 rounded-2xl shadow-2xl max-w-sm"
                style={{
                    background: 'var(--secondary-dark)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
                }}
            >
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                    style={{ background: 'var(--accent)', color: 'var(--primary-dark)' }}
                >
                    CA
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: 'var(--light)' }}>
                        Install CodArch
                    </p>
                    <p className="text-xs" style={{ color: 'var(--light)', opacity: 0.45 }}>
                        Add to your home screen for quick access
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleInstall}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all"
                        style={{ background: 'var(--accent)', color: 'var(--primary-dark)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--accent-hover)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--accent)'; }}
                    >
                        <Download size={13} /> Install
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="p-1 rounded-lg cursor-pointer transition-opacity"
                        style={{ color: 'var(--light)', opacity: 0.3 }}
                        onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
