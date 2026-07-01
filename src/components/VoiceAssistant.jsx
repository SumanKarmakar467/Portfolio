import React, { useEffect, useRef, useState } from 'react';
import { certifications } from '../constants/certifications';
import { education } from '../constants/education';
import { projects } from '../constants/projects';
import { techStack } from '../constants/techStack';
import './VoiceAssistant.css';

const PROFILE = {
  name: 'Suman Karmakar',
  nickname: 'Jerry',
  role: 'Full Stack Web Developer and MERN Stack Developer',
  location: 'West Bengal, India',
  portfolio: 'https://suman-karmakar.vercel.app/',
  github: 'https://github.com/SumanKarmakar467',
  githubUsername: 'SumanKarmakar467',
  leetcode: 'https://leetcode.com/u/suman2k04/',
  leetcodeUsername: 'suman2k04',
  linkedin: 'https://www.linkedin.com/in/suman-karmakar-jerry/',
  email: 'karmakarsuman12138@gmail.com',
  summary:
    'Suman builds responsive web applications with React, Node.js, and MongoDB, with a focus on clear UI and practical backend architecture.',
  strengths: ['Problem Solving', 'Team Collaboration', 'Clean Code', 'Continuous Learning'],
  stats: ['15+ projects built', '20+ tech skills', '4+ years learning', '4 certificates'],
};

const ALL_SKILLS = Object.values(techStack).flat();

const SYSTEM_PROMPT = `You are Suman Karmakar's portfolio assistant.
Use the provided facts only. Keep answers helpful, concise, and friendly.
If a question is outside Suman's portfolio, say you do not have that detail and suggest contacting Suman directly.

Profile:
${JSON.stringify(PROFILE)}

Projects:
${JSON.stringify(projects)}

Skills:
${JSON.stringify(techStack)}

Education:
${JSON.stringify(education)}

Certifications:
${JSON.stringify(certifications)}`;

const QUICK_PROMPTS = ['Who is Suman?', 'Skills', 'Projects', 'Education', 'GitHub', 'LeetCode'];

function listNames(items, limit = items.length) {
  return items.slice(0, limit).map((item) => item.name || item.title).join(', ');
}

function getStatusLabel(status) {
  if (status === 'idle') return 'Ready';
  if (status === 'thinking') return 'Thinking...';
  return status;
}

function getPortfolioAnswer(question) {
  const text = question.toLowerCase();
  const words = text.split(/[^a-z0-9+#.]+/).filter(Boolean);
  const asksAboutSuman =
    /\b(who|about|profile|bio|yourself|suman|jerry|work|developer|role)\b/.test(text) ||
    text.includes('tell me about');

  const projectMatch = projects.find((project) => text.includes(project.title.toLowerCase()));
  const skillMatch = ALL_SKILLS.find((skill) => text.includes(skill.name.toLowerCase()));

  if (projectMatch) {
    return `${projectMatch.title}: ${projectMatch.description} Tech used: ${projectMatch.technologies.join(', ')}. GitHub: ${projectMatch.github}. Live: ${projectMatch.live}.`;
  }

  if (skillMatch) {
    return `${skillMatch.name} is listed in Suman's portfolio skills with a ${skillMatch.level}% proficiency level. His wider stack includes ${listNames(ALL_SKILLS, 12)}.`;
  }

  if (/\b(project|projects|portfolio|app|website|work)\b/.test(text)) {
    const featured = projects.filter((project) => project.featured);
    return `Suman's portfolio includes ${projects.length} showcased projects. Featured projects are ${featured
      .map((project) => `${project.title} (${project.technologies.join(', ')})`)
      .join('; ')}. Other projects include ${projects
      .filter((project) => !project.featured)
      .map((project) => project.title)
      .join(', ')}.`;
  }

  if (/\b(skill|skills|stack|technology|technologies|tech|frontend|backend|database|tool|tools|ai)\b/.test(text)) {
    return `Suman's skills include frontend: ${listNames(techStack.frontend)}; backend: ${listNames(
      techStack.backend,
    )}; databases/cloud: ${listNames(techStack.database)}; AI tools: ${listNames(techStack.ai)}; tools: ${listNames(
      techStack.tools,
    )}.`;
  }

  if (/\b(education|college|school|degree|cgpa|grade|study|studied|b.tech|btech)\b/.test(text)) {
    return education
      .map((item) => `${item.degree} from ${item.institution}, ${item.location} (${item.duration}) - ${item.grade}. ${item.description}`)
      .join(' ');
  }

  if (/\b(github|repository|repositories|repo|repos|commit|commits)\b/.test(text)) {
    return `Suman's GitHub username is ${PROFILE.githubUsername}. Profile: ${PROFILE.github}. Featured repository links include ${projects
      .slice(0, 4)
      .map((project) => `${project.title}: ${project.github}`)
      .join('; ')}.`;
  }

  if (/\b(leetcode|dsa|problem|solving|coding)\b/.test(text)) {
    return `Suman's LeetCode username is ${PROFILE.leetcodeUsername}. Profile: ${PROFILE.leetcode}. The portfolio also includes a live LeetCode Progress section and his Leet_Code_Matrics dashboard project.`;
  }

  if (/\b(contact|email|mail|linkedin|location|hire|connect|phone)\b/.test(text)) {
    return `You can contact Suman by email at ${PROFILE.email}, LinkedIn at ${PROFILE.linkedin}, GitHub at ${PROFILE.github}, or through the Contact section. He is based in ${PROFILE.location}.`;
  }

  if (/\b(certificate|certification|certifications|course)\b/.test(text)) {
    return `Suman has ${certifications.length} certifications: ${certifications
      .map((item) => `${item.title} from ${item.issuer}`)
      .join('; ')}.`;
  }

  if (asksAboutSuman || words.length <= 2) {
    return `${PROFILE.name}, also known as ${PROFILE.nickname}, is a ${PROFILE.role} from ${PROFILE.location}. ${PROFILE.summary} His strengths include ${PROFILE.strengths.join(
      ', ',
    )}, and the portfolio highlights ${PROFILE.stats.join(', ')}.`;
  }

  return '';
}

export default function VoiceAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [open, setOpen] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages, status, open]);

  useEffect(() => {
    if (!open || messages.length > 0) return;
    setMessages([
      {
        role: 'assistant',
        content:
          'Hi, I am Suman portfolio assistant. Ask me about Suman, projects, skills, education, GitHub, LeetCode, certifications, or contact details.',
      },
    ]);
  }, [messages.length, open]);

  const askClaude = async (question) => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setStatus('thinking');

    const localAnswer = getPortfolioAnswer(question);
    if (localAnswer) {
      window.setTimeout(() => {
        setMessages((prev) => [...prev, { role: 'assistant', content: localAnswer }]);
        setStatus('idle');
      }, 180);
      return;
    }

    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: SYSTEM_PROMPT,
          messages: nextMessages.slice(-12),
        }),
      });

      if (!response.ok) throw new Error('Assistant request failed');

      const data = await response.json();
      const answer = (data?.text || 'Sorry, I could not generate a response right now.').trim();
      setMessages((prev) => [...prev, { role: 'assistant', content: answer }]);
      setStatus('idle');
    } catch {
      const fallbackAnswer =
        'I can answer from Suman portfolio data about his profile, projects, skills, education, GitHub, LeetCode, certifications, and contact details. For anything else, please contact Suman directly.';
      setMessages((prev) => [...prev, { role: 'assistant', content: fallbackAnswer }]);
      setStatus('idle');
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const question = input.trim();
    if (!question || status === 'thinking') return;
    setInput('');
    await askClaude(question);
  };

  const orbClass = status === 'thinking' ? 'orb-thinking' : 'orb-idle';

  return (
    <>
      <button
        type="button"
        className={`voice-launcher ${orbClass}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open AI Assistant"
      >
        <span className="voice-launcher-core">AI</span>
        <span className="voice-launcher-ring" />
      </button>

      {open && (
        <div className="voice-panel-wrapper">
          <div className="voice-panel">
            <div className="voice-panel-glow" />
            <div className="voice-header">
              <div>
                <p className="voice-kicker">Portfolio Intelligence</p>
                <h3>AI Assistant</h3>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="voice-close"
              >
                Close
              </button>
            </div>

            <div className="voice-status-card">
              <div>
                <span className="voice-status-label">Text Assistant</span>
                <strong>{getStatusLabel(status)}</strong>
              </div>
              <span className={`voice-status-dot is-${status}`} />
            </div>

            <div className="voice-quick-grid">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askClaude(prompt)}
                  className="voice-quick"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="voice-messages">
              {messages.length === 0 && (
                <div className="voice-empty">
                  <span>Ask about Suman, projects, skills, education, or contact.</span>
                </div>
              )}
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}`}
                  className={`voice-message ${msg.role === 'user' ? 'is-user' : 'is-assistant'}`}
                >
                  {msg.content}
                  <span className="voice-message-time">Now</span>
                </div>
              ))}
              {status === 'thinking' && (
                <div className="voice-message is-assistant is-typing">
                  <span className="voice-typing-dots">
                    <i />
                    <i />
                    <i />
                  </span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="voice-form">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask here..."
                className="voice-input"
              />
              <button type="submit" className="voice-send" disabled={status === 'thinking' || !input.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
