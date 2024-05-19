// components/BarcodeScanner.js
"use client";

import { useEffect } from 'react';

const BarcodeScanner = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.3.1.min.js';
    script.async = true;
    document.body.appendChild(script);

    const exifScript = document.createElement('script');
    exifScript.src = 'exif.min.js';
    exifScript.async = true;
    document.body.appendChild(exifScript);

    const barcodeScript = document.createElement('script');
    barcodeScript.src = 'BarcodeScanner.min.js';
    barcodeScript.async = true;
    document.body.appendChild(barcodeScript);

    const appScript = document.createElement('script');
    appScript.src = 'app.min.js';
    appScript.async = true;
    document.body.appendChild(appScript);

    script.onload = () => {
      appScript.onload = () => {
        const resultElement = document.getElementById('code');
        if (typeof setupLiveReader === 'function') {
          setupLiveReader(resultElement);
        } else {
          appScript.onload = () => setupLiveReader(resultElement);
        }
      };
    };

    return () => {
      document.body.removeChild(script);
      document.body.removeChild(exifScript);
      document.body.removeChild(barcodeScript);
      document.body.removeChild(appScript);
    };
  }, []);

  return (
    <>
      <p id="code">code will appear here</p>
    </>
  );
};

export default BarcodeScanner;
