interface ErrorAlertProps {
  message: string | null;
}

export function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="mt-4 rounded-md bg-red-50 border border-red-300 px-4 py-3 text-sm text-red-700"
    >
      {message}
    </div>
  );
}
