"use client";

import { useRouter } from "next/navigation";

export function RegisterAccountButton() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/register'); // Redirect to the registration page
  };

  return (
    <button
      onClick={handleClick}
      className="w-full flex items-center font-semibold justify-center h-14 px-6 mt-4 text-xl transition-colors duration-300 bg-white border-2 border-black text-black rounded-lg focus:shadow-outline hover:bg-slate-200"
    >
      <span className="ml-4">Register Account</span>
    </button>
  );
}
