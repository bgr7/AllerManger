"use client"

import { fullProduct } from "@/app/interface";
import { client, urlFor } from "@/app/lib/sanity";
import { Button } from "@/components/ui/button";
import { Star, Truck } from "lucide-react";
import { useUser } from "@clerk/nextjs";

import Image from "next/image";
import React, { useEffect, useState } from "react";

const getRecommendedProducts = async (userId) => {
  const query = `
  *[_type == "product" && 
  !(_id in *[_type == "user" && id == "${userId}"][0].allergies[].affectedProducts[]._ref) &&
  !(_id in *[_type == "user" && id == "${userId}"][0].favoriteProducts[]._ref) &&
  category._ref in *[_type == "category" && !(_id in *[_type == "user" && id == "${userId}"][0].allergies[].affectedProducts[].category._ref) &&
                                    !(_id in *[_type == "user" && id == "${userId}"][0].favoriteProducts[].category._ref)]._id]`;
  const data = await client.fetch(query);
  return data;
}

const fetchAllergiesData = async (slug, userId) => {
  const query = `
    {
      "product": *[_type == "product" && code == "${slug}"][0] {
        _id,
        images,
        code,
        name,
        description,
        "slug": slug.current,
        "category": category->{
          _id,
          name
        },
        "allergies": *[_type == "allergies" && references(^._id)] {
          name
        }
      },
      "user": *[_type == "user" && id == "${userId}"][0] {
        allergies[]->{
          affectedProducts[]->{
            _id
          }
        }
      },
      "recommendedProducts": *[_type == "product" && category._ref == ^.product.category._ref && _id != ^.product._id] {
        _id,
        name,
        slug,
        images
      }
    }
  `;
  return await client.fetch(query, { slug, userId });
};

const fetchDislikedIngredientsData = async (slug, userId) => {
  const query = `
    {
      "product": *[_type == "product" && code == "${slug}"][0] {
        _id,
        images,
        code,
        name,
        description,
        "slug": slug.current,
        "category": category->{
          _id,
          name
        },
        "allergies": *[_type == "allergies" && references(^._id)] {
          name
        }
      },
      "user": *[_type == "user" && id == "${userId}"][0] {
        favoriteProducts[]->{
          _id
        }
      },
      "recommendedProducts": *[_type == "product" && category._ref == ^.product.category._ref && _id != ^.product._id] {
        _id,
        name,
        slug,
        images
      }
    }
  `;
  return await client.fetch(query, { slug, userId });
};

export const dynamic = "force-dynamic";

export default function ProductPage({ params }) {
  const { user: userClerk } = useUser();
  const [recProduct, setRecProduct] = useState([]);
  const [productData, setProductData] = useState(null);
  const [isProductInAllergies, setIsProductInAllergies] = useState(false);
  const [isProductInDislikedIngredients, setIsProductInDislikedIngredients] = useState(false);

  useEffect(() => {
    if (userClerk) {
      const userId = userClerk.id;

      const fetchData = async () => {
        const allergiesData = await fetchAllergiesData(params.slug, userId);
        const dislikedIngredientsData = await fetchDislikedIngredientsData(params.slug, userId);

        const { product, user: allergiesUser } = allergiesData;
        const { user: dislikedUser } = dislikedIngredientsData;

        setProductData(product);

        const productInAllergies = allergiesUser.allergies.some(allergy =>
          allergy.affectedProducts.some(p => p._id === product._id)
        );
        const productInDislikedIngredients = dislikedUser.favoriteProducts.some(p => p._id === product._id);

        setIsProductInAllergies(productInAllergies);
        setIsProductInDislikedIngredients(productInDislikedIngredients);

        const recommendedProducts = await getRecommendedProducts(userId);
        setRecProduct(recommendedProducts);
      };

      fetchData();
    }
  }, [userClerk, params.slug]);

  if (!productData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <hr className="border-2 border-primary border-opacity-65" />
      <div className="mx-auto max-w-[800px] px-4 md:px-8 flex items-center justify-center">
        <div className={`rounded-lg border-4 py-8 ${isProductInAllergies ? 'border-4 border-red-600' : isProductInDislikedIngredients ? 'border-4 border-yellow-400' : 'border-4 border-green-400'} grid gap-8 md:grid-cols-2 p-4 m-4`}>
          {productData?.images && productData.images[0]?.asset?._ref ? (
            <Image
              src={urlFor(productData.images[0].asset._ref).url()}
              width={200}
              height={200}
              alt={productData.name}
              className="object-center object-contain cursor-pointer max-w-[250px] h-full"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Image not available</span>
            </div>
          )}
          <div className="md:py-8">
            <div className="mb-4">
              <span className="mb-1 inline-block text-gray-500">
                {productData?.category.name}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
                {productData?.name}
              </h2>
            </div>
            {isProductInAllergies && (
              <div className="mb-4 text-red-600">
                This product contains ingredients you are allergic to.
              </div>
            )}
            {isProductInDislikedIngredients && (
              <div className="mb-4 text-yellow-600">
                This product contains ingredients you dislike.
              </div>
            )}
            {(!isProductInDislikedIngredients && !isProductInAllergies) && (
              <div className="mb-4 text-green-600">
                This product is safe for you.
              </div>
            )}
            <span className="font-bold">Allergies:</span><br />
            {productData?.allergies && productData.allergies.length > 0 ? (
              <ul>
                {productData.allergies.map((allergy, index) => (
                  <li key={index}>{allergy.name}</li>
                ))}
              </ul>
            ) : (
              <span>No allergies found for this product.</span>
            )}
            <div className="mb-4">
              <div className="flex items-end gap-2">
                <span className="mb-0.5">
                  <span className="font-bold text-sm text-gray-500">Code: <br />{productData?.code}</span>
                </span>
              </div>
            </div>
            <p className="text-base text-gray-500 tracking-wide">
              {productData?.description}
            </p>
          </div>
        </div>
      </div>
      <hr className="border-2 border-primary border-opacity-65 mt-8" />
      <div className="mt-8 flex flex-col items-center justify-center ">
        <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">
          Recommended Products
        </h2>
        <div className="mt-6 grid gap-1 grid-cols-3 md:w-[800px] w-full p-4">
          {recProduct?.map((recProduct) => (
            <div key={recProduct._id} className="w-full mb-24 flex flex-col items-center justify-center group">
              <Image
                src={urlFor(recProduct.images[0].asset._ref).url()}
                width={200}
                height={200}
                alt={recProduct.name}
                className="object-center object-contain cursor-pointer w-full h-full"              />
              <h3 className="text-md font-semibold text-gray-800 mt-2">
                {recProduct.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
