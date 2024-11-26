import HackPadelLogo from "@/components/Layout/HackPadelLogo/HackPadelLogo";

export default function Admin() {
  return (
    <div className="flex min-h-[100vh] flex-col items-center bg-black p-64 text-white">
      <HackPadelLogo />
      <h3 className="mt-4 font-bold">Admin</h3>
    </div>
  );
}
