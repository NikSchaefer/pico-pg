interface QueryErrorMessageProps {
  error: string;
}

export default function QueryErrorMessage({ error }: QueryErrorMessageProps) {
  return (
    <div className="border-b border-red-800 bg-red-900/20 px-4 py-2 text-sm text-red-400">
      <p className="font-medium text-red-300">Error</p>
      <p>{error}</p>
    </div>
  );
}
