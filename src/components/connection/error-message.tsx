import { AlertCircle } from "lucide-react";

interface QueryErrorMessageProps {
  error: string;
}

export default function QueryErrorMessage({ error }: QueryErrorMessageProps) {
  return (
    <div className="border-b border-red-200 bg-red-50 px-6 py-4">
      <div className="flex items-start space-x-3">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="font-medium text-red-900 text-sm">Query Error</p>
          <p className="text-red-700 text-sm mt-1 font-mono">{error}</p>
        </div>
      </div>
    </div>
  );
}
