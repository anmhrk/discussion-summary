import ReactMarkdown from "react-markdown";

interface SummaryProps {
  summary: string;
}

export const Summary = ({ summary }: SummaryProps) => {
  return (
    <div className="w-full prose dark:prose-invert prose-sm max-w-none p-4 rounded-lg border border-gray-300 dark:border-[#2D2D2F] bg-white dark:bg-[#1D1D1F] dark:text-white">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-4">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-3">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-medium mb-2">{children}</h3>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-1 ml-4 mb-4">
              {children}
            </ul>
          ),
          li: ({ children }) => (
            <li className="text-sm leading-6">{children}</li>
          ),
          p: ({ children }) => (
            <p className="text-sm leading-6 mb-4">{children}</p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {summary}
      </ReactMarkdown>
    </div>
  );
};
