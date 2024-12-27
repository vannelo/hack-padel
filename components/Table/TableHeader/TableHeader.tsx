interface TableHeaderProps {
  title: string;
  children?: React.ReactNode;
}

export default function TableHeader({ title, children }: TableHeaderProps) {
  return (
    <div
      className={`flex w-full items-center ${
        children ? "justify-between" : "justify-center"
      }`}
    >
      <h2 className="font-bold text-white md:text-2xl">{title}</h2>
      {children}
    </div>
  );
}
