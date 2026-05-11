interface Props {
  value: string;
  onChange: (v: string) => void;
}

export default function SearchBar({ value, onChange }: Props) {
  return (
    <div className="search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="메모 검색..."
        value={value}
        onChange={e => onChange(e.target.value)}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="검색 초기화">
          ×
        </button>
      )}
    </div>
  );
}
