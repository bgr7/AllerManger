import Image from "next/image";
import { client, urlFor } from "../lib/sanity";
import Link from "next/link";

// Function to extract image dimensions from the reference string
const extractImageDimensions = (
  ref: string
): { width: number; height: number } => {
  const dimensions = ref.split("-").slice(-2)[0];
  const [width, height] = dimensions.split("x").map(Number);
  return { width, height };
};

async function getData() {
  const query = "*[_type == 'category']";
  const data = await client.fetch(query);
  return data;
}

export default async function Categories() {
  const data = await getData();
  return (
    <>
      <div className="container flex justify-center items-center">
        <div className="grid gap-1 grid-cols-3 md:w-[800px] w-full p-2">
          {data.map((item: any, idx: any) => (
            <Link href={`/${item.slug.current}`} key={idx} className="w-[%30] h-[200px] flex flex-col items-center justify-center">
              <div className="overflow-hidden rounded-lg bg-gray-100 w-full h-full mb-2">
                <Image
                  src={urlFor(item.images.asset._ref).url()}
                  width={400}
                  height={400}
                  alt={item.name}
                  className="object-center object-cover cursor-pointer w-full h-full"
                />
              </div>
              <h3 className="mt-2 text-center text-xs text-primary">
                {item.name}
              </h3>
            </Link>
          ))}
        </div>
      </div>
      <Link href={'/all'} className="px-4 m-auto mb-4 py-2 w-40 bg-blue-500 text-white rounded-lg flex items-center justify-center">
        SHOW ALL
      </Link>
    </>
  );
}
