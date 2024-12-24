interface ListHeaderProps {
  title: string;
  children: React.ReactNode;
}

export default function ListHeader({ title, children }: ListHeaderProps) {
  return (
    <div className="flex w-full items-center justify-between">
      <h2 className="font-bold text-white md:text-2xl">{title}</h2>
      {children}
    </div>
  );
}
