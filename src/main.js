import {
  collection, addDoc, deleteDoc, doc,
  onSnapshot, orderBy, query, serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase.js';

const memosCol = collection(db, 'memos');
const q        = query(memosCol, orderBy('createdAt', 'desc'));
const badge    = document.getElementById('syncBadge');
const addBtn   = document.getElementById('addBtn');
const listEl   = document.getElementById('list');
const inputEl  = document.getElementById('input');

function formatDate(ts) {
  if (!ts) return '방금 전';
  const d   = ts.toDate();
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${pad(d.getMonth()+1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function render(memos) {
  if (memos.length === 0) {
    listEl.innerHTML = '<p class="empty">메모가 없습니다.</p>';
    return;
  }
  listEl.innerHTML = memos.map(m => `
    <div class="memo-item">
      <div style="flex:1">
        <div class="memo-text">${escapeHtml(m.text)}</div>
        <div class="memo-meta">${formatDate(m.createdAt)}</div>
      </div>
      <button class="del-btn" data-id="${m.id}" title="삭제">×</button>
    </div>
  `).join('');

  listEl.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteMemo(btn.dataset.id));
  });
}

// 실시간 리스너
onSnapshot(q,
  snapshot => {
    render(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    badge.textContent = '실시간 동기화';
    badge.className   = 'sync-badge live';
  },
  err => {
    console.error(err);
    badge.textContent = 'Firebase 연결 오류';
    badge.className   = 'sync-badge error';
  }
);

async function addMemo() {
  const text = inputEl.value.trim();
  if (!text) return;
  addBtn.disabled = true;
  inputEl.value   = '';
  await addDoc(memosCol, { text, createdAt: serverTimestamp() });
  addBtn.disabled = false;
}

async function deleteMemo(id) {
  await deleteDoc(doc(db, 'memos', id));
}

addBtn.addEventListener('click', addMemo);
inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) addMemo();
});
