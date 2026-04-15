import { useAuth } from '../context/AuthContext';
import { Play, Share2, Trash2, LogOut, Loader2 } from 'lucide-react';

export default function ActionBar({ onAnalyze, onShare, onClearAll, onShowResults, isAnalyzing, hasResults }) {
    const { user, logOut } = useAuth();

    async function handleLogout() {
        try { await logOut(); } catch (err) { console.error('[CodArch] Logout error:', err); }
    }

    return (
        <div className="action-bar">
            <div className="action-bar-left">
                <button onClick={onAnalyze} disabled={isAnalyzing} className="action-btn-analyze">
                    {isAnalyzing ? <Loader2 size={15} className="animate-spin" /> : <Play size={15} />}
                    {isAnalyzing ? 'Analyzing...' : 'Analyze'}
                </button>

                {hasResults && (
                    <button onClick={onShowResults} className="action-btn-results animate-fade-in">
                        Show Results
                    </button>
                )}

                <div className="action-divider action-hide-mobile" />

                <button onClick={onShare} className="action-btn-ghost action-hide-mobile">
                    <Share2 size={14} /> Share
                </button>

                <button onClick={onClearAll} className="action-btn-ghost danger action-hide-mobile">
                    <Trash2 size={14} /> Clear All
                </button>
            </div>

            <div className="action-bar-right">
                {user && (
                    <span className="action-username action-hide-mobile">
                        {user.displayName || user.email}
                    </span>
                )}
                <button onClick={handleLogout} className="action-btn-ghost">
                    <LogOut size={14} /> Logout
                </button>
            </div>
        </div>
    );
}
