'use client';

import Link from "next/link";
import React from "react";
import { Mail } from "react-feather"; // Ensure you have react-feather installed

function Page() {
  const handleMailTo = () => {
    window.location.href = "mailto:allermenger@gmail.com";
  };

  return (
    <div className="h-full fixed top-20 left-0 bg-white w-full">
      <div className="flex justify-center items-center gap-2">
        <Link
          href="/help/faq"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex items-center">
          FAQ
        </Link>
      </div>
      <div className="flex justify-center items-center gap-2 mt-4">
        <button
          onClick={handleMailTo}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex items-center">
          Send an E-mail to Support Center
          <Mail size={24} className="ml-2" />
        </button>
      </div>
    </div>
  );
}

export default Page;