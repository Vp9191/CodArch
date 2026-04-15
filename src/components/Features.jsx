import { Shield, Zap, FileCode2, BarChart3, Bug, Layers } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const features = [
  { icon: FileCode2, title: 'Multi-File Analysis', description: 'Analyze multiple files at once. Our AI reviews your entire codebase holistically for architecture patterns.' },
  { icon: Zap, title: 'Instant Feedback', description: 'Get real-time code evaluation powered by Google Gemini. Results in seconds, not minutes.' },
  { icon: Shield, title: 'Security Scanning', description: 'Detect common vulnerabilities like SQL injection, XSS, and hardcoded secrets automatically.' },
  { icon: BarChart3, title: 'Quality Scoring', description: 'Receive severity-rated findings — Critical, Warning, and Info — so you know what to fix first.' },
  { icon: Bug, title: 'Bug Detection', description: 'AI identifies potential bugs, logic errors, and edge cases you might have missed.' },
  { icon: Layers, title: 'Architecture Review', description: 'Evaluate your code structure, design patterns, and modularity for cleaner architecture.' },
];

function FeatureCard({ feature, index }) {
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

  const Icon = feature.icon;

  return (
    <div
      ref={ref}
      className={`feature-card ${visible ? 'animate-fade-in-up' : ''}`}
      style={{ animationDelay: `${index * 0.1}s`, opacity: visible ? undefined : 0 }}
    >
      <div className="feature-card-glow" />
      <div className="feature-icon-box">
        <Icon size={22} />
      </div>
      <h3 className="feature-card-title">{feature.title}</h3>
      <p className="feature-card-desc">{feature.description}</p>
    </div>
  );
}

export default function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container-main section-padding">
        <div className="features-header">
          <h2 className="features-title">
            Powerful <span>Features</span>
          </h2>
          <p className="features-subtitle">
            Everything you need to write better code, catch bugs early, and maintain clean architecture.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
