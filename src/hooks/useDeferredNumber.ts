import React, {useEffect, useState} from "react";

export function useDeferredNumber(
  externalValue: number | undefined | null,
  onCommit: (num: number | null) => void
) {
  const [text, setText] = useState<string>(
    externalValue != null ? String(externalValue).replace('.', ',') : ''
  );

  useEffect(() => {
    const normalized = externalValue != null ? String(externalValue).replace('.', ',') : '';
    if (normalized !== text) setText(normalized);
  }, [externalValue]);

  const commit = () => {
    const parsed = parseFloat(text.replace(',', '.'));
    if (!Number.isNaN(parsed)) onCommit(parsed);
    else onCommit(null);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      commit();
      (e.target as HTMLInputElement).blur();
    }
  };

  return {
    text,
    setText,
    commit,
    handleKey,
  };
};