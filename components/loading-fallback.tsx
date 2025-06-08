export default function LoadingFallback() {
  return (
    <div className='fixed inset-0 bg-background flex items-center justify-center'>
      <div className='flex flex-col items-center'>
        <div className='animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-primary'></div>
        <p className='mt-4 text-lg text-foreground/80'>
          Loading application...
        </p>
      </div>
    </div>
  );
}
