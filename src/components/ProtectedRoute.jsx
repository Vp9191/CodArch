import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: 'var(--primary-dark)' }}
            >
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                        style={{
                            background: 'var(--accent)',
                            color: 'var(--primary-dark)',
                            animation: 'pulse-glow 2s ease-in-out infinite',
                        }}
                    >
                        CA
                    </div>
                    <p className="text-sm" style={{ color: 'var(--light)', opacity: 0.5 }}>
                        Loading...
                    </p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" replace />;
    }

    return children;
}
