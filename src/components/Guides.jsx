import { Upload, Code2, Cpu, CheckCircle2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const steps = [
  { icon: Upload, step: '01', title: 'Paste or Upload Code', description: 'Add your code files to the editor. Supports multiple files and auto-detects language.' },
  { icon: Code2, step: '02', title: 'Review in Editor', description: 'Use the built-in CodeMirror editor with syntax highlighting. Organize files in the explorer.' },
  { icon: Cpu, step: '03', title: 'AI Analyzes Your Code', description: 'Click "Analyze" and Google Gemini evaluates your code for quality, bugs, and architecture.' },
  { icon: CheckCircle2, step: '04', title: 'Get Detailed Results', description: 'Receive severity-scored findings with actionable fix suggestions. Improve your code instantly.' },
];

function StepCard({ step, index, total }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const Icon = step.icon;

  return (
    <div
      ref={ref}
      className={`step-card ${visible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${index * 0.15}s`, opacity: visible ? undefined : 0 }}
    >
      {index < total - 1 && <div className="step-connector" />}

      <div className="step-icon-wrap">
        <Icon size={28} />
        <span className="step-number">{step.step}</span>
      </div>

      <h3 className="step-card-title">{step.title}</h3>
      <p className="step-card-desc">{step.description}</p>
    </div>
  );
}

export default function Guides() {
  return (
    <section id="guides" className="guides-section">
      <div className="container-main section-padding">
        <div className="guides-header">
          <h2 className="guides-title">
            How It <span>Works</span>
          </h2>
          <p className="guides-subtitle">
            Get started in four simple steps — from pasting code to receiving AI-powered insights.
          </p>
        </div>

        <div className="guides-grid">
          {steps.map((step, index) => (
            <StepCard key={step.step} step={step} index={index} total={steps.length} />
          ))}
        </div>
      </div>
    </section>
  );
}
