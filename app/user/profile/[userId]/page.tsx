"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"

interface Allergy {
  _id: string
  name: string
}

interface Product {
  _id: string
  name: string
}

interface User {
  id: string
  email: string
  name: string
  username: string
  role: string
  allergies: { _ref: string; _key: string }[]
  favoriteProducts: { _ref: string; _key: string }[]
}

export default function ShowUserProfilePage() {
  const { user: clerkUser } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [allergies, setAllergies] = useState<Allergy[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await fetch(`/api/getUser/${clerkUser?.id}`)
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data")
        }

        const userData = await userResponse.json()
        setUser(userData)

        // Fetch allergy data
        const allergyResponse = await fetch(`/api/getAllergies`)
        if (!allergyResponse.ok) {
          throw new Error("Failed to fetch allergy data")
        }
        const allergyData = await allergyResponse.json()
        setAllergies(allergyData)

        // Fetch product data
        const productResponse = await fetch(`/api/getProducts`)
        if (!productResponse.ok) {
          throw new Error("Failed to fetch product data")
        }
        const productData = await productResponse.json()
        setProducts(productData)

        setLoading(false)
      } catch (error: any) {
        setError(error.message)
        setLoading(false)
      }
    }

    if (clerkUser) {
      fetchData()
    }
  }, [clerkUser])

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex space-x-2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    )
  }

  if (error) return <p>Error loading data: {error}</p>

  return (
    <div className="absolute w-full bg-white top-20 left-0 right-0 bottom-0">
      <div className="max-w-lg mx-auto p-4 bg-white shadow-md rounded">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Email:
            <input
              type="email"
              name="email"
              value={user?.email || ""}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Name:
            <input
              type="text"
              name="name"
              value={user?.name || ""}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Username:
            <input
              type="text"
              name="username"
              value={user?.username || ""}
              readOnly
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            />
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Role:
            <select
              name="role"
              value={user?.role || ""}
              disabled
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm sm:text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Allergies:
            <div className="mt-2 space-y-2">
              {allergies.map((allergy) => (
                <div key={allergy._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={allergy._id}
                    checked={
                      user?.allergies.some((a) => a._ref === allergy._id) ||
                      false
                    }
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={allergy._id}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {allergy.name}
                  </label>
                </div>
              ))}
            </div>
          </label>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Disliked Ingredients:
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
              {products.map((product) => (
                <div key={product._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={product._id}
                    checked={
                      user?.favoriteProducts.some(
                        (p) => p._ref === product._id
                      ) || false
                    }
                    readOnly
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={product._id}
                    className="ml-2 block text-sm text-gray-900"
                  >
                    {product.name}
                  </label>
                </div>
              ))}
            </div>
          </label>
        </div>
        <button
          onClick={() => router.push("/")}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Return Home
        </button>
      </div>
    </div>
  )
}
