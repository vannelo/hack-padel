const PlayerTableLoader: React.FC = () => {
  return (
    <div className="my-32 flex flex-col items-center justify-center text-center text-white">
      <div className="mt-4 space-y-2">
        <div className="h-4 w-24 animate-pulse rounded bg-primary"></div>
        <div className="h-4 w-40 animate-pulse rounded bg-primary"></div>
        <div className="h-4 w-32 animate-pulse rounded bg-primary"></div>
      </div>
    </div>
  );
};

export default PlayerTableLoader;
