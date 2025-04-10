export default function AuthWrapper({ children }) {
  return (
    <div className="h-screen bg-background-light flex items-center justify-center px-4 overflow-hidden dark:bg-background-dark dark:text-text-light">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 shadow-xl rounded-2xl border border-background-dark">
        {children}
      </div>
    </div>
  );
}
