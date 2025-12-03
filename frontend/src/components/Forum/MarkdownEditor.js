import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { 
  EyeIcon,
  PencilIcon,
  CodeBracketIcon,
  PhotoIcon,
  LinkIcon,
  ListBulletIcon
} from '@heroicons/react/24/outline';
import 'highlight.js/styles/github-dark.css';

/**
 * Composant éditeur Markdown avec prévisualisation
 */
const MarkdownEditor = ({ 
  value = '', 
  onChange, 
  placeholder = 'Écrivez votre message en Markdown...',
  minHeight = '200px',
  maxHeight = '600px',
  showPreview = true,
  showToolbar = true,
  name = 'content'
}) => {
  const [previewMode, setPreviewMode] = useState(false);
  const [cursorPosition, setCursorPosition] = useState(null);

  const handleTextareaChange = (e) => {
    const newValue = e.target.value;
    setCursorPosition(e.target.selectionStart);
    if (onChange) {
      onChange(e);
    }
  };

  const insertText = (before, after = '', placeholderText = '') => {
    const textarea = document.activeElement;
    if (textarea && textarea.tagName === 'TEXTAREA') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = value;
      const beforeText = text.substring(0, start);
      const selectedText = text.substring(start, end) || placeholderText;
      const afterText = text.substring(end);
      const newText = beforeText + before + selectedText + after + afterText;
      const newPosition = start + before.length + selectedText.length + after.length;
      
      if (onChange) {
        const event = {
          target: {
            name: textarea.name || name || 'content',
            value: newText
          }
        };
        onChange(event);
        
        // Restaurer le curseur
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(newPosition, newPosition);
        }, 0);
      }
    }
  };

  const toolbarButtons = [
    { 
      icon: 'B', 
      action: () => insertText('**', '**', 'texte en gras'),
      title: 'Gras (Ctrl+B)',
      isText: true
    },
    { 
      icon: 'I', 
      action: () => insertText('_', '_', 'texte en italique'),
      title: 'Italique (Ctrl+I)',
      isText: true
    },
    { 
      icon: CodeBracketIcon, 
      action: () => insertText('`', '`', 'code'),
      title: 'Code inline'
    },
    { 
      icon: CodeBracketIcon, 
      action: () => insertText('```\n', '\n```', 'votre code ici'),
      title: 'Bloc de code'
    },
    { 
      icon: LinkIcon, 
      action: () => insertText('[', '](url)', 'texte du lien'),
      title: 'Lien'
    },
    { 
      icon: ListBulletIcon, 
      action: () => insertText('- ', '', 'élément de liste'),
      title: 'Liste'
    },
    { 
      icon: PhotoIcon, 
      action: () => insertText('![', '](url)', 'description de l\'image'),
      title: 'Image'
    }
  ];

  return (
    <div className="w-full">
      {showToolbar && (
        <div className="flex items-center justify-between bg-gray-100 border border-gray-300 rounded-t-lg px-3 py-2">
          <div className="flex items-center gap-1">
            {toolbarButtons.map((button, index) => {
              const Icon = button.icon;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={button.action}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded transition-colors font-semibold"
                  title={button.title}
                >
                  {button.isText ? (
                    <span className="text-sm">{Icon}</span>
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </button>
              );
            })}
          </div>
          
          {showPreview && (
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-200 rounded transition-colors"
            >
              {previewMode ? (
                <>
                  <PencilIcon className="w-4 h-4" />
                  Éditer
                </>
              ) : (
                <>
                  <EyeIcon className="w-4 h-4" />
                  Prévisualiser
                </>
              )}
            </button>
          )}
        </div>
      )}

      <div className="relative border border-gray-300 rounded-b-lg overflow-hidden">
        {previewMode ? (
          <div 
            className="prose prose-sm max-w-none p-4 bg-white min-h-[200px]"
            style={{ minHeight, maxHeight, overflowY: 'auto' }}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                code: ({ node, inline, className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {value || '*Commencez à écrire pour voir la prévisualisation...*'}
            </ReactMarkdown>
          </div>
        ) : (
          <textarea
            name={name}
            id={name}
            value={value}
            onChange={handleTextareaChange}
            placeholder={placeholder}
            className="w-full px-4 py-3 border-0 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            style={{ 
              minHeight, 
              maxHeight,
              fontFamily: 'monospace',
              fontSize: '14px',
              lineHeight: '1.6'
            }}
          />
        )}
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
        <div className="flex gap-4">
          <span>**gras**</span>
          <span>_italique_</span>
          <span>`code`</span>
          <span>[lien](url)</span>
        </div>
        <span>{value.length} caractères</span>
      </div>
    </div>
  );
};

export default MarkdownEditor;

