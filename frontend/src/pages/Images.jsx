import { useRef, useState } from 'react';
import { Image as ImageIcon, UploadCloud, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function Images({ onSaved }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  function chooseFile(next) {
    setResult(null); setError('');
    if (!next) return;
    if (!next.type.startsWith('image/')) { setError('Choose a valid image file.'); return; }
    if (next.size > 5 * 1024 * 1024) { setError('Image must be 5 MB or smaller.'); return; }
    setFile(next);
    setPreview(URL.createObjectURL(next));
  }
  async function upload(e) {
    e.preventDefault();
    if (!file) { setError('Choose an image first.'); return; }
    setLoading(true); setError(''); setResult(null);
    const body = new FormData(); body.append('image', file);
    try { const res = await api.post('/classify', body); setResult(res.data); onSaved?.(); }
    catch (err) { setError(err.response?.data?.error || 'Upload failed. Check Flask and MongoDB.'); }
    finally { setLoading(false); }
  }
  return <div className="page-content narrow-page">
    <p className="eyebrow">EXPERIMENT 8 · COMPUTER VISION</p><h1>Image analysis</h1><p className="muted page-intro">Upload a picture to validate it and inspect its image details. You can enable a pretrained classifier in the backend configuration.</p>
    <section className="panel form-panel"><div className="feature-icon blue"><ImageIcon size={22}/></div><h2>Upload an image</h2><p className="muted">JPEG, PNG, WEBP or GIF · Maximum 5 MB</p>
      <form onSubmit={upload}><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" hidden onChange={e => chooseFile(e.target.files?.[0])}/>
        <button type="button" className="upload-zone" onClick={() => inputRef.current?.click()}><UploadCloud size={28}/><strong>{file ? file.name : 'Choose an image'}</strong><span>{file ? `${(file.size/1024).toFixed(1)} KB · Click to change` : 'Click to browse files on your Mac'}</span></button>
        {preview && <img className="image-preview" src={preview} alt="Selected upload preview"/>}
        {error && <div className="alert error">{error}</div>}
        <button className="primary-btn full-btn" disabled={loading}>{loading ? 'Analyzing…' : <><Sparkles size={16}/> Analyze image</>}</button>
      </form>
    </section>
    {result && <section className="result-panel"><div className="result-heading"><Sparkles size={19}/><h2>Image result</h2></div><div className="image-result-label">{result.label}</div><div className="image-meta"><div><span>Width</span><strong>{result.width}px</strong></div><div><span>Height</span><strong>{result.height}px</strong></div><div><span>Format</span><strong>{result.format}</strong></div></div><p className="fine-print">Model: {result.model_used}. Metadata-only mode does not claim to identify the image's contents.</p></section>}
  </div>;
}
