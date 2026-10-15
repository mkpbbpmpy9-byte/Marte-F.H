import React, { useState, useEffect, useRef } from 'react';
import { useEditor } from '../context/EditorContext';

interface EditableTextProps {
  value: string;
  onChange: (newValue: string) => void;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
  multiline?: boolean;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
  label?: string; // Optional hover badge tooltip
}

export const EditableText: React.FC<EditableTextProps> = ({
  value,
  onChange,
  as: Component = 'span',
  multiline = false,
  placeholder = 'Click to edit...',
  className = '',
  style,
  label,
}) => {
  const { isEditMode, isPreviewMode } = useEditor();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  // Sync draft if prop changes from outside (e.g. undo/redo)
  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const commit = () => {
    setIsEditing(false);
    if (draft !== value) {
      onChange(draft);
    }
  };

  const cancel = () => {
    setIsEditing(false);
    setDraft(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      cancel();
    } else if (e.key === 'Enter' && !multiline) {
      e.stopPropagation();
      commit();
    }
  };

  // If not in editing mode or preview mode is active, render regular pristine markup
  if (!isEditMode || isPreviewMode) {
    return (
      <Component className={className} style={style}>
        {value}
      </Component>
    );
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          rows={Math.max(2, draft.split('\n').length)}
          className={`w-full bg-blue-50/70 text-black border border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-none p-1 resize-y ${className}`}
          style={{
            ...style,
            fontFamily: 'inherit',
            fontSize: style?.fontSize || 'inherit',
            fontWeight: style?.fontWeight || 'inherit',
            lineHeight: style?.lineHeight || 'inherit',
            letterSpacing: style?.letterSpacing || 'inherit',
          }}
        />
      );
    }

    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={`bg-blue-50/70 text-black border border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-none px-1 py-0.5 inline-block ${className}`}
        style={{
          ...style,
          fontFamily: 'inherit',
          fontSize: style?.fontSize || 'inherit',
          fontWeight: style?.fontWeight || 'inherit',
          lineHeight: style?.lineHeight || 'inherit',
          letterSpacing: style?.letterSpacing || 'inherit',
          width: '100%',
          maxWidth: '100%',
        }}
      />
    );
  }

  return (
    <Component
      onClick={(e) => {
        e.stopPropagation();
        setIsEditing(true);
      }}
      title={label ? `Click to edit: ${label}` : 'Click to edit text'}
      className={`group relative cursor-text transition-all duration-150 hover:outline hover:outline-1 hover:outline-dashed hover:outline-blue-400/90 hover:bg-blue-50/30 ${className}`}
      style={style}
    >
      {value || (
        <span className="text-gray-400 italic">[{placeholder}]</span>
      )}
    </Component>
  );
};
