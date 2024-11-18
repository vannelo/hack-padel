import Image from "next/image";

const TableLoader: React.FC = () => {
  return (
    <div className="my-32 flex flex-col items-center justify-center text-center text-white">
      <div className="mt-4 flex flex-col items-center justify-center space-y-2">
        <Image
          src="/img/loader.png"
          alt="Hack Padel Logo"
          width={80}
          height={150}
          className="mb-2 animate-pulse"
        />
        <div className="h-1 w-24 animate-pulse rounded bg-primary"></div>
      </div>
    </div>
  );
};

export default TableLoader;
