import { SignUp } from "@clerk/nextjs"
import Image from "next/image"

export default function Page() {
  return (
    <div className="flex flex-col top-0 left-0 fixed h-screen w-screen items-center justify-center min-h-screen bg-gray-100">      
    <Image src="/logo-black-reg.svg" alt="logo" width={220} height={50} />
      <SignUp path="/sign-up"/>
    </div>
  )
}
