export function BackgroundEffects() {
  return (
    <>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-500/5 rounded-full filter blur-3xl animate-blob" />
      <div className="absolute top-0 -right-20 w-80 h-80 bg-purple-500/5 rounded-full filter blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute -bottom-40 left-20 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl animate-blob animation-delay-4000" />
    </>
  );
}