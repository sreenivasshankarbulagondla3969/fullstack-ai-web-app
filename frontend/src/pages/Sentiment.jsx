import { useState } from 'react';
import { Brain, Mic, Send, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function Sentiment({ onSaved }) {
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(''); setResult(null);
    if (!text.trim()) { setError('Enter some text to analyze.'); return; }
    setLoading(true);
    try {
      const response = await api.post('/sentiment', { text });
      setResult(response.data); onSaved?.();
    } catch (err) { setError(err.response?.data?.error || 'Could not reach the API. Check Flask and MongoDB.'); }
    finally { setLoading(false); }
  }

  function startSpeech() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setError('Speech recognition is not supported in this browser. You can type your text instead.'); return; }
    const recognition = new Recognition();
    recognition.lang = 'en-IN'; recognition.interimResults = false;
    recognition.onstart = () => { setListening(true); setError(''); };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setError('Microphone access failed. Check browser permissions or type your text.'); setListening(false); };
    recognition.onresult = event => setText(prev => `${prev}${prev ? ' ' : ''}${event.results[0][0].transcript}`);
    recognition.start();
  }

  return <div className="page-content narrow-page">
    <p className="eyebrow">EXPERIMENT 6 · AI INTEGRATION</p><h1>Sentiment AI</h1><p className="muted page-intro">Analyze a sentence and classify its overall tone using the VADER sentiment model.</p>
    <section className="panel form-panel"><div className="feature-icon purple"><Brain size={22}/></div><h2>Analyze your text</h2><p className="muted">Try a review, feedback message, or short sentence.</p>
      <form onSubmit={submit}><label htmlFor="sentiment-text">Text to analyze</label><textarea id="sentiment-text" rows="6" maxLength="10000" value={text} onChange={e => setText(e.target.value)} placeholder="Example: This application is wonderful and easy to use!" />
        <div className="input-footer"><span>{text.length}/10,000 characters</span><button type="button" className="secondary-btn" onClick={startSpeech} disabled={listening}><Mic size={15}/>{listening ? 'Listening…' : 'Speak'}</button></div>
        {error && <div className="alert error">{error}</div>}
        <button className="primary-btn full-btn" disabled={loading}>{loading ? 'Analyzing…' : <><Send size={16}/> Analyze sentiment</>}</button>
      </form>
    </section>
    {result && <section className="result-panel"><div className="result-heading"><Sparkles size={19}/><h2>Analysis result</h2></div><div className="result-main"><span className={`result-badge ${result.label}`}>{result.label}</span><div><div className="result-score">{Math.round(result.score * 100)}%</div><p className="muted">Sentiment strength</p></div></div>
      <div className="score-list">{Object.entries(result.scores || {}).map(([key, value]) => <div key={key} className="score-row"><span>{key}</span><div className="score-track"><div className="score-fill" style={{width:`${Math.max(0, value * 100)}%`}}/></div><strong>{Number(value).toFixed(3)}</strong></div>)}</div>
      <p className="fine-print">VADER is a rule-based sentiment tool. Its result is an estimate, not a fact about the author's intent.</p>
    </section>}
  </div>;
}
