"use client";

const ArrowRight: React.FC = ({}) => {
  return (
    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-black">
      <svg
        className="h-3 w-3"
        xmlns="http://www.w3.org/2000/svg"
        fill="black"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 8l4 4m0 0l-4 4m4-4H3"
        />
      </svg>
    </div>
  );
};

export default ArrowRight;
