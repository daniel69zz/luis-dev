import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/** Renderiza Markdown de forma segura (react-markdown no interpreta HTML crudo). */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-dev">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, ...props }) => <a target="_blank" rel="noreferrer" {...props} />,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
