import Link from "next/link";
import { simplifiedProduct } from "../interface";
import { client } from "../lib/sanity";
import Image from "next/image";

async function getData() {
  const query = `*[_type == "product"] {
    _id,
    "imageUrl": images[0].asset->url,
    code,
    name,
    "slug": slug.current,
    "categoryName": category->name
  }`;

  const data = await client.fetch(query);

  return data;
}

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  const data: simplifiedProduct[] = await getData();

  return (
    <>
    <div className="bg-white">
      <hr className="border-2 border-primary border-opacity-65" />
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 text-center w-full p-7">
            Our Products
          </h2>
        </div>
        <div className="container flex justify-center items-center">
          <div className="mt-6 grid gap-1 grid-cols-3 md:w-[800px] w-full p-4">
            {data.map((product) => (
              <div key={product._id} className="w-full mb-24 flex flex-col items-center justify-center group">
                <div className="relative aspect-square rounded-lg bg-gray-100 w-full h-full mb-2 overflow-hidden">
                  <Image
                    src={product.imageUrl}
                    alt="Product image"
                    className="object-center object-contain cursor-pointer w-full h-full"
                    width={100}
                    height={100}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium text-white">{product.code}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-between w-full px-2">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/product/${product.code}`}>
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.categoryName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>

  );
}
