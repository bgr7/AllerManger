"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation" // Import from 'next/navigation' instead of 'next/router'
import BarCodeScanner from "barcode-react-scanner"
import { ScanBarcode, X } from "lucide-react"

const Scanner = (): JSX.Element => {
  const [code, setCode] = useState<string>("")
  const [isScannerActive, setIsScannerActive] = useState<boolean>(false)
  const router = useRouter()

  const handleUpdate = (err: any, resp: any): void => {
    if (resp) {
      const scannedCode = resp.getText()
      setCode(scannedCode)
      router.push(`/product/${scannedCode}`)
    }
  }

  const handleButtonClick = (): void => {
    setIsScannerActive(!isScannerActive)
  }

  return (
    <div className="m-auto my-2 max-w-[350px] ">
      {!isScannerActive ? (
        <button 
        className="px-4 py-2 bg-primary text-white rounded-lg flex items-center justify-center m-auto"
         onClick={handleButtonClick}>
          Scan Product 
          <ScanBarcode size={20} className="ml-2 text-red-300" />
         </button>
      ) : (
        <>
        <div className="border-4 border-red-700 overflow-hidden rounded-2xl">
          <BarCodeScanner onUpdate={handleUpdate} />

        </div>
        <button 
        className="px-4 my-4 py-2 bg-red-500 text-white rounded-lg flex items-center justify-center m-auto"
         onClick={handleButtonClick}>
          Cancel
          <X size={20} className="ml-2 text-white-300" />
         </button>
        </>
      )}
    </div>
  )
}

export default Scanner
