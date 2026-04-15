import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

const DISMISS_KEY = 'pwa-dismissed-at';
const INSTALLED_KEY = 'pwa-installed';
const COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // 3 days

function isMobile() {
    return /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        || (navigator.maxTouchPoints > 1 && window.innerWidth < 768);
}

function isInStandalone() {
    return window.matchMedia('(display-mode: standalone)').matches
        || window.navigator.standalone === true;
}

function shouldShow() {
    // Never on desktop
    if (!isMobile()) return false;
    // Never if already installed or running as PWA
    if (localStorage.getItem(INSTALLED_KEY)) return false;
    if (isInStandalone()) return false;
    // Respect cooldown after dismiss
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < COOLDOWN_MS) return false;
    return true;
}

export default function InstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!shouldShow()) return;

        function handleBeforeInstall(e) {
            e.preventDefault();
            setDeferredPrompt(e);
            setTimeout(() => setVisible(true), 3000);
        }

        function handleInstalled() {
            setVisible(false);
            setDeferredPrompt(null);
            localStorage.setItem(INSTALLED_KEY, 'true');
            localStorage.removeItem(DISMISS_KEY);
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);
        window.addEventListener('appinstalled', handleInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
            window.removeEventListener('appinstalled', handleInstalled);
        };
    }, []);

    async function handleInstall() {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            localStorage.setItem(INSTALLED_KEY, 'true');
            localStorage.removeItem(DISMISS_KEY);
        }
        setDeferredPrompt(null);
        setVisible(false);
    }

    function handleDismiss() {
        setVisible(false);
        localStorage.setItem(DISMISS_KEY, String(Date.now()));
    }

    if (!visible || !deferredPrompt) return null;

    return (
        <div className="pwa-prompt">
            <div className="pwa-prompt-card">
                <div className="pwa-prompt-icon">CA</div>
                <div className="pwa-prompt-text">
                    <p className="pwa-prompt-title">Install CodArch</p>
                    <p className="pwa-prompt-desc">Add to home screen for quick access</p>
                </div>
                <div className="pwa-prompt-actions">
                    <button onClick={handleInstall} className="pwa-prompt-install">
                        <Download size={13} /> Install
                    </button>
                    <button onClick={handleDismiss} className="pwa-prompt-close">
                        <X size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
