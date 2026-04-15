import { Link } from 'react-router-dom';
import { Code2, Sparkles } from 'lucide-react';

const codeLines = [
  { indent: 0, color: '#c678dd', text: 'def ', rest: 'analyze_code(source):' },
  { indent: 1, color: '#98c379', text: '"""AI-powered code review"""' },
  { indent: 1, color: '#e06c75', text: 'result ', rest: '= ai.evaluate(source)' },
  { indent: 1, color: '#c678dd', text: 'return ', rest: 'result.findings' },
  { indent: 0, text: '' },
  { indent: 0, color: '#61afef', text: '# ', rest: '✓ No issues found' },
  { indent: 0, color: '#61afef', text: '# ', rest: '✓ Code quality: A+' },
  { indent: 0, color: '#61afef', text: '# ', rest: '✓ Architecture: Clean' },
];

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-bg-blob hero-bg-top" />
      <div className="hero-bg-blob hero-bg-bottom" />

      <div className="container-main" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-grid">
          {/* Code mockup */}
          <div className="hero-mockup-wrap animate-slide-left">
            <div className="hero-mockup">
              <div className="hero-mockup-inner">
                <div className="hero-mockup-bar">
                  <div className="hero-mockup-dot" style={{ background: '#ff5f57' }} />
                  <div className="hero-mockup-dot" style={{ background: '#ffbd2e' }} />
                  <div className="hero-mockup-dot" style={{ background: '#28c840' }} />
                  <span className="hero-mockup-title">main.py — CodArch</span>
                </div>

                <div className="hero-mockup-code">
                  {codeLines.map((line, i) => (
                    <div
                      key={i}
                      className="hero-mockup-line animate-fade-in"
                      style={{
                        paddingLeft: `${line.indent * 1.5}rem`,
                        animationDelay: `${0.8 + i * 0.15}s`,
                        opacity: 0,
                      }}
                    >
                      <span style={{ color: line.color || 'var(--light)', opacity: 0.9 }}>
                        {line.text}
                      </span>
                      {line.rest && (
                        <span style={{ color: 'var(--light)', opacity: 0.7 }}>{line.rest}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="hero-mockup-glow" />
            </div>
          </div>

          {/* Content */}
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <Sparkles size={14} />
              AI-Powered Code Analysis
            </div>

            <h1 className="hero-title animate-fade-in-up">
              Evaluate Your Code{' '}
              <span>Intelligently</span>
            </h1>

            <p className="hero-subtitle animate-fade-in-up delay-200">
              Paste your code, get instant AI-driven reviews. CodArch analyzes architecture,
              code quality, and best practices — powered by Google Gemini.
            </p>

            <div className="hero-buttons animate-fade-in-up delay-300">
              <Link to="/auth" className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                <Code2 size={18} />
                Start Analyzing
              </Link>
              <a href="#features" className="btn-outline" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
