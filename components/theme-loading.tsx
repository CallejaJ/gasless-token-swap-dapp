export default function ThemeLoading() {
  return (
    <div className='fixed inset-0 bg-background flex items-center justify-center'>
      <div className='animate-pulse text-foreground/80'>Loading theme...</div>
    </div>
  );
}
