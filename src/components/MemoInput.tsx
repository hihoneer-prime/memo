import { useState } from 'react';
import { addMemo } from '../services/memoService';

export default function MemoInput() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleAdd() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setLoading(true);
    setText('');
    await addMemo(trimmed);
    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAdd();
  }

  return (
    <div className="input-row">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메모를 입력하세요... (Ctrl+Enter로 추가)"
      />
      <button className="add-btn" onClick={handleAdd} disabled={loading}>
        추가
      </button>
    </div>
  );
}
