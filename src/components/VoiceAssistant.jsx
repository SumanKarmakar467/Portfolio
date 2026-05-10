import React, { useEffect, useMemo, useRef, useState } from 'react';
import './VoiceAssistant.css';

const SYSTEM_PROMPT = `You are Suman Karmakar's portfolio voice assistant.
Use only factual, concise, helpful responses.

Profile:
- Name: Suman Karmakar (also known as Jerry)
- Role: MERN Stack Developer
- Location: West Bengal, India
- Portfolio: https://suman-karmakar.vercel.app/
- GitHub: https://github.com/SumanKarmakar467
- LinkedIn: https://www.linkedin.com/in/suman-karmakar-jerry/
- Email: karmakarsuman12138@gmail.com
- Skills: React, Node.js, Express.js, MongoDB, HTML5, CSS3, JavaScript ES6+, Git, Vite
- Projects: Portfolio website with hero, projects gallery, tech stack, education timeline, certifications, light/dark mode
- Education: Academic timeline with semester results shown on portfolio

If asked unrelated or unknown details, say you do not have that info and suggest contacting Suman directly.`;

const MODES = [
  { id: 'ttt', label: 'TTT' },
  { id: 'sts', label: 'STS' },
  { id: 'tts', label: 'TTS' },
];

const QUICK_PROMPTS = ['Who is Suman?', 'Skills', 'Projects', 'Education', 'Contact'];

export default function VoiceAssistant() {
  const [mode, setMode] = useState('ttt');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const recognitionRef = useRef(null);
  const supportsRecognition = useMemo(
    () => typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition),
    [],
  );

  useEffect(() => {
    if (!supportsRecognition) return;

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setError('');
      setStatus('listening');
    };

    recognition.onresult = async (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript?.trim() || '';
      if (!transcript) return;
      await askClaude(transcript, true);
    };

    recognition.onerror = () => {
      setError('Voice capture failed. Please try again.');
      setStatus('idle');
    };

    recognition.onend = () => {
      setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
    };

    recognitionRef.current = recognition;

    return () => recognition.stop();
  }, [supportsRecognition]);

  useEffect(() => () => window.speechSynthesis.cancel(), []);

  const stopAllAudio = () => {
    window.speechSynthesis.cancel();
    recognitionRef.current?.stop();
    setStatus('idle');
  };

  const speakText = (text) => {
    if (!text) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;

    utterance.onstart = () => setStatus('speaking');
    utterance.onend = () => setStatus('idle');
    utterance.onerror = () => setStatus('idle');

    window.speechSynthesis.speak(utterance);
  };

  const askClaude = async (question, shouldSpeak = false) => {
    if (!question.trim()) return;

    const userMessage = { role: 'user', content: question.trim() };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setError('');
    setStatus('thinking');

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

      if (shouldSpeak || mode === 'tts') speakText(answer);
      else setStatus('idle');
    } catch {
      setError('Unable to reach Claude API right now.');
      setStatus('idle');
    }
  };

  const handleSend = async (event) => {
    event.preventDefault();
    const question = input;
    setInput('');
    await askClaude(question, mode === 'tts');
  };

  const startListening = () => {
    if (!supportsRecognition) {
      setError('Speech recognition is supported in Chrome and Edge only.');
      return;
    }
    setError('');
    recognitionRef.current?.start();
  };

  const orbClass =
    status === 'listening'
      ? 'orb-listening'
      : status === 'thinking'
        ? 'orb-thinking'
        : status === 'speaking'
          ? 'orb-speaking'
          : 'orb-idle';

  return (
    <>
      <button
        type="button"
        className={`voice-launcher ${orbClass}`}
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open AI Assistant"
      >
        <span className="voice-launcher-core">AI</span>
      </button>

      {open && (
        <div className="voice-panel-wrapper">
          <div className="voice-panel rounded-2xl border border-border bg-surface/95 p-4 shadow-2xl sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-primary">AI Assistant</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-2 py-1 text-xs text-muted hover:border-primary hover:text-primary"
              >
                Close
              </button>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {MODES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setMode(item.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    mode === item.id ? 'bg-primary text-white' : 'border border-border text-muted hover:text-text'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {mode === 'sts' && (
              <div className="mb-3 flex flex-col items-center gap-2">
                <button type="button" onClick={startListening} className={`voice-orb ${orbClass}`} aria-label="Start voice input">
                  <span className="voice-orb-core">MIC</span>
                </button>
                <p className="text-xs text-muted">State: {status}</p>
                {!supportsRecognition && (
                  <p className="text-center text-xs text-amber-500">
                    SpeechRecognition works in Chrome/Edge only. Use TTT/TTS modes.
                  </p>
                )}
              </div>
            )}

            <div className="mb-3 grid grid-cols-2 gap-2">
              {QUICK_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => askClaude(prompt, mode !== 'ttt')}
                  className="rounded-full border border-border px-2 py-1.5 text-[11px] font-medium text-muted transition hover:border-primary hover:text-primary"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="mb-3 max-h-64 space-y-2 overflow-y-auto rounded-xl border border-border bg-background/30 p-3">
              {messages.length === 0 && <p className="text-xs text-muted">Ask about Suman&apos;s portfolio.</p>}
              {messages.map((msg, idx) => (
                <div
                  key={`${msg.role}-${idx}`}
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-xs ${
                    msg.role === 'user' ? 'ml-auto bg-primary text-white' : 'border border-border bg-surface text-text'
                  }`}
                >
                  {msg.content}
                </div>
              ))}
            </div>

            {error && <p className="mb-2 text-xs text-rose-400">{error}</p>}

            {(mode === 'ttt' || mode === 'tts') && (
              <form onSubmit={handleSend} className="mb-2 flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask here..."
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-text outline-none focus:border-primary"
                />
                <button type="submit" className="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white">
                  Send
                </button>
              </form>
            )}

            <button
              type="button"
              onClick={stopAllAudio}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:border-primary hover:text-primary"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </>
  );
}
