import { Settings, Users } from "lucide-react"
import React from "react"

function Page() {
  const productUrl = process.env.NEXT_PUBLIC_PRODUCT
  const UserUrl = process.env.NEXT_PUBLIC_USER

  return (
    <div className="h-full fixed top-20 left-0 bg-white w-full">
      <div className="flex justify-center items-center gap-2 p-2">
        <a
          href={productUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition duration-200 flex items-center"
        >
          Product Management
          <Settings size={24} className="ml-2" />
        </a>
        <a
          href={UserUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition duration-200 flex items-center"
        >
          User Management
          <Users size={24} className="ml-2" />
        </a>
      </div>
    </div>
  )
}

export default Page
