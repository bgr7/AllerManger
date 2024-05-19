/**
 * CallBacks:
 * __________________________________________________________________________________
 * All the callback function should have one parameter:
 * function(result){};
 * And the result parameter will contain an array of objects that look like BarcodeScanner.
 * result = [{Format: the barcode type, Value: the value of the barcode}];
 * __________________________________________________________________________________
 * 
 * You can use either the set functions or just access the properties directly to set callback or 
 * other properties. Just always remember to call Init() before starting to decode something never mess
 * around with the SupportedFormats property.
 * 
 */
interface BarcodeScannerConfig {
    Multiple: boolean;
    DecodeFormats: string[];
    ForceUnique: boolean;
    LocalizationFeedback: boolean;
    SkipOrientation: boolean;
  }
  
  interface Barcode {
    Format: string;
    Value: string;
  }
  
  interface Localization {
    x: number;
    y: number;
    width: number;
    height: number;
  }
  
  interface BarcodeScanner {
    Config: BarcodeScannerConfig;
    SupportedFormats: string[];
    ScanCanvas: HTMLCanvasElement | null;
    ScanContext: CanvasRenderingContext2D | null;
    SquashCanvas: HTMLCanvasElement;
    ImageCallback: ((result: Barcode[]) => void) | null;
    streamCallback: ((result: Barcode[]) => void) | null;
    LocalizationCallback: ((result: Localization[]) => void) | null;
    Stream: HTMLVideoElement | null;
    DecodeStreamActive: boolean;
    Decoded: string[];
    DecoderWorker: Worker;
    OrientationCallback: ((result: any) => void) | null;
    init: () => void;
    SetRotationSkip: (value: boolean) => void;
    SetImageCallback: (callBack: (result: Barcode[]) => void) => void;
    setStreamCallback: (callBack: (result: Barcode[]) => void) => void;
    SetLocalizationCallback: (callBack: (result: Localization[]) => void) => void;
    SwitchLocalizationFeedback: (bool: boolean) => void;
    DecodeSingleBarcode: () => void;
    DecodeMultiple: () => void;
    SetDecodeFormats: (formats: string[]) => void;
    SkipFormats: (formats: string[]) => void;
    AddFormats: (formats: string[]) => void;
    DecodeImage: (image: string | HTMLImageElement) => void;
    DecodeStream: (stream: HTMLVideoElement) => void;
    StopStreamDecode: () => void;
    BarcodeScannerDecodeImage: (image: HTMLImageElement, orientation: number, sceneCaptureType: string) => void;
    DetectVerticalSquash: (img: HTMLImageElement) => number;
    FixCanvas: (canvas: HTMLCanvasElement) => HTMLCanvasElement;
  }
  
  const BarcodeScanner: BarcodeScanner = {
    Config: {
      Multiple: true,
      DecodeFormats: ["Code128", "Code93", "Code39", "EAN-13", "2Of5", "Inter2Of5", "Codabar"],
      ForceUnique: true,
      LocalizationFeedback: false,
      SkipOrientation: false,
    },
    SupportedFormats: ["Code128", "Code93", "Code39", "EAN-13", "2Of5", "Inter2Of5", "Codabar"],
    ScanCanvas: null,
    ScanContext: null,
    SquashCanvas: document.createElement("canvas"),
    ImageCallback: null,
    streamCallback: null,
    LocalizationCallback: null,
    Stream: null,
    DecodeStreamActive: false,
    Decoded: [],
    DecoderWorker: new Worker("DecoderWorker.js"),
    OrientationCallback: null,
    init: function () {
      BarcodeScanner.ScanCanvas = BarcodeScanner.FixCanvas(document.createElement("canvas"));
      BarcodeScanner.ScanCanvas.width = 640;
      BarcodeScanner.ScanCanvas.height = 480;
      BarcodeScanner.ScanContext = BarcodeScanner.ScanCanvas.getContext("2d");
    },
    SetRotationSkip: function (value: boolean) {
      BarcodeScanner.Config.SkipOrientation = value;
    },
    SetImageCallback: function (callBack: (result: Barcode[]) => void) {
      BarcodeScanner.ImageCallback = callBack;
    },
    setStreamCallback: function (callBack: (result: Barcode[]) => void) {
      BarcodeScanner.streamCallback = callBack;
    },
    SetLocalizationCallback: function (callBack: (result: Localization[]) => void) {
      BarcodeScanner.LocalizationCallback = callBack;
      BarcodeScanner.Config.LocalizationFeedback = true;
    },
    SwitchLocalizationFeedback: function (bool: boolean) {
      BarcodeScanner.Config.LocalizationFeedback = bool;
    },
    DecodeSingleBarcode: function () {
      BarcodeScanner.Config.Multiple = false;
    },
    DecodeMultiple: function () {
      BarcodeScanner.Config.Multiple = true;
    },
    SetDecodeFormats: function (formats: string[]) {
      BarcodeScanner.Config.DecodeFormats = [];
      for (let i = 0; i < formats.length; i++) {
        if (BarcodeScanner.SupportedFormats.indexOf(formats[i]) !== -1) {
          BarcodeScanner.Config.DecodeFormats.push(formats[i]);
        }
      }
      if (BarcodeScanner.Config.DecodeFormats.length === 0) {
        BarcodeScanner.Config.DecodeFormats = BarcodeScanner.SupportedFormats.slice();
      }
    },
    SkipFormats: function (formats: string[]) {
      for (let i = 0; i < formats.length; i++) {
        const index = BarcodeScanner.Config.DecodeFormats.indexOf(formats[i]);
        if (index >= 0) {
          BarcodeScanner.Config.DecodeFormats.splice(index, 1);
        }
      }
    },
    AddFormats: function (formats: string[]) {
      for (let i = 0; i < formats.length; i++) {
        if (BarcodeScanner.SupportedFormats.indexOf(formats[i]) !== -1) {
          if (BarcodeScanner.Config.DecodeFormats.indexOf(formats[i]) === -1) {
            BarcodeScanner.Config.DecodeFormats.push(formats[i]);
          }
        }
      }
    },
    BarcodeScannerImageCallback: function (e: MessageEvent) {
      if (e.data.success === "localization") {
        if (BarcodeScanner.Config.LocalizationFeedback) {
          BarcodeScanner.LocalizationCallback(e.data.result);
        }
        return;
      }
      if (e.data.success === "orientationData") {
        BarcodeScanner.OrientationCallback(e.data.result);
        return;
      }
      const filteredData: Barcode[] = [];
      for (let i = 0; i < e.data.result.length; i++) {
        if (
          BarcodeScanner.Decoded.indexOf(e.data.result[i].Value) === -1 ||
          BarcodeScanner.Config.ForceUnique === false
        ) {
          filteredData.push(e.data.result[i]);
          if (BarcodeScanner.Config.ForceUnique) BarcodeScanner.Decoded.push(e.data.result[i].Value);
        }
      }
      BarcodeScanner.ImageCallback(filteredData);
      BarcodeScanner.Decoded = [];
    },
    BarcodeScannerStreamCallback: function (e: MessageEvent) {
      if (e.data.success === "localization") {
        if (BarcodeScanner.Config.LocalizationFeedback) {
          BarcodeScanner.LocalizationCallback(e.data.result);
        }
        return;
      }
      if (e.data.success && BarcodeScanner.DecodeStreamActive) {
        const filteredData: Barcode[] = [];
        for (let i = 0; i < e.data.result.length; i++) {
          if (
            BarcodeScanner.Decoded.indexOf(e.data.result[i].Value) === -1 ||
            BarcodeScanner.ForceUnique === false
          ) {
            filteredData.push(e.data.result[i]);
            if (BarcodeScanner.ForceUnique) BarcodeScanner.Decoded.push(e.data.result[i].Value);
          }
        }
        if (filteredData.length > 0) {
          BarcodeScanner.streamCallback(filteredData);
        }
      }
      if (BarcodeScanner.DecodeStreamActive) {
        BarcodeScanner.ScanContext.drawImage(
          BarcodeScanner.Stream,
          0,
          0,
          BarcodeScanner.ScanCanvas.width,
          BarcodeScanner.ScanCanvas.height
        );
        BarcodeScanner.DecoderWorker.postMessage({
          scan: BarcodeScanner.ScanContext.getImageData(
            0,
            0,
            BarcodeScanner.ScanCanvas.width,
            BarcodeScanner.ScanCanvas.height
          ).data,
          scanWidth: BarcodeScanner.ScanCanvas.width,
          scanHeight: BarcodeScanner.ScanCanvas.height,
          multiple: BarcodeScanner.Config.Multiple,
          decodeFormats: BarcodeScanner.Config.DecodeFormats,
          cmd: "normal",
          rotation: 1,
        });
      }
      if (!BarcodeScanner.DecodeStreamActive) {
        BarcodeScanner.Decoded = [];
      }
    },
    DecodeImage: function (image: string | HTMLImageElement) {
      if (image instanceof Image || image instanceof HTMLImageElement) {
        image.exifdata = false;
        if (image.complete) {
          if (BarcodeScanner.Config.SkipOrientation) {
            BarcodeScanner.BarcodeScannerDecodeImage(image, 1, "");
          } else {
            EXIF.getData(image, function (exifImage: any) {
              let orientation = EXIF.getTag(exifImage, "Orientation");
              let sceneType = EXIF.getTag(exifImage, "SceneCaptureType");
              if (typeof orientation !== "number") orientation = 1;
              BarcodeScanner.BarcodeScannerDecodeImage(exifImage, orientation, sceneType);
            });
          }
        } else {
          const img = new Image();
          img.onload = function () {
            if (BarcodeScanner.Config.SkipOrientation) {
              BarcodeScanner.BarcodeScannerDecodeImage(img, 1, "");
            } else {
              EXIF.getData(this, function (exifImage: any) {
                let orientation = EXIF.getTag(exifImage, "Orientation");
                let sceneType = EXIF.getTag(exifImage, "SceneCaptureType");
                if (typeof orientation !== "number") orientation = 1;
                BarcodeScanner.BarcodeScannerDecodeImage(exifImage, orientation, sceneType);
              });
            }
          };
          img.src = image.src;
        }
      } else {
        const img = new Image();
        img.onload = function () {
          if (BarcodeScanner.Config.SkipOrientation) {
            BarcodeScanner.BarcodeScannerDecodeImage(img, 1, "");
          } else {
            EXIF.getData(this, function (exifImage: any) {
              let orientation = EXIF.getTag(exifImage, "Orientation");
              let sceneType = EXIF.getTag(exifImage, "SceneCaptureType");
              if (typeof orientation !== "number") orientation = 1;
              BarcodeScanner.BarcodeScannerDecodeImage(exifImage, orientation, sceneType);
            });
          }
        };
        img.src = image;
      }
    },
    DecodeStream: function (stream: HTMLVideoElement) {
      BarcodeScanner.Stream = stream;
      BarcodeScanner.DecodeStreamActive = true;
      BarcodeScanner.DecoderWorker.onmessage = BarcodeScanner.BarcodeScannerStreamCallback;
      BarcodeScanner.ScanContext.drawImage(
        stream,
        0,
        0,
        BarcodeScanner.ScanCanvas.width,
        BarcodeScanner.ScanCanvas.height
      );
      BarcodeScanner.DecoderWorker.postMessage({
        scan: BarcodeScanner.ScanContext.getImageData(
          0,
          0,
          BarcodeScanner.ScanCanvas.width,
          BarcodeScanner.ScanCanvas.height
        ).data,
        scanWidth: BarcodeScanner.ScanCanvas.width,
        scanHeight: BarcodeScanner.ScanCanvas.height,
        multiple: BarcodeScanner.Config.Multiple,
        decodeFormats: BarcodeScanner.Config.DecodeFormats,
        cmd: "normal",
        rotation: 1,
      });
    },
    StopStreamDecode: function () {
      BarcodeScanner.DecodeStreamActive = false;
      BarcodeScanner.Decoded = [];
    },
    BarcodeScannerDecodeImage: function (image: HTMLImageElement, orientation: number, sceneCaptureType: string) {
      if (orientation === 8 || orientation === 6) {
        if (sceneCaptureType === "Landscape" && image.width > image.height) {
          orientation = 1;
          BarcodeScanner.ScanCanvas.width = 640;
          BarcodeScanner.ScanCanvas.height = 480;
        } else {
          BarcodeScanner.ScanCanvas.width = 480;
          BarcodeScanner.ScanCanvas.height = 640;
        }
      } else {
        BarcodeScanner.ScanCanvas.width = 640;
        BarcodeScanner.ScanCanvas.height = 480;
      }
      BarcodeScanner.DecoderWorker.onmessage = BarcodeScanner.BarcodeScannerImageCallback;
      BarcodeScanner.ScanContext.drawImage(
        image,
        0,
        0,
        BarcodeScanner.ScanCanvas.width,
        BarcodeScanner.ScanCanvas.height
      );
      BarcodeScanner.Orientation = orientation;
      BarcodeScanner.DecoderWorker.postMessage({
        scan: BarcodeScanner.ScanContext.getImageData(
          0,
          0,
          BarcodeScanner.ScanCanvas.width,
          BarcodeScanner.ScanCanvas.height
        ).data,
        scanWidth: BarcodeScanner.ScanCanvas.width,
        scanHeight: BarcodeScanner.ScanCanvas.height,
        multiple: BarcodeScanner.Config.Multiple,
        decodeFormats: BarcodeScanner.Config.DecodeFormats,
        cmd: "normal",
        rotation: orientation,
        postOrientation: BarcodeScanner.PostOrientation,
      });
    },
    DetectVerticalSquash: function (img: HTMLImageElement) {
      const ih = img.naturalHeight;
      const canvas = BarcodeScanner.SquashCanvas;
      canvas.width = 1;
      canvas.height = ih;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      try {
        const data = ctx.getImageData(0, 0, 1, ih).data;
      } catch (err) {
        console.log("Cannot check verticalSquash: CORS?");
        return 1;
      }
      let sy = 0;
      let ey = ih;
      let py = ih;
      while (py > sy) {
        const alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
          ey = py;
        } else {
          sy = py;
        }
        py = (ey + sy) >> 1;
      }
      const ratio = py / ih;
      return ratio === 0 ? 1 : ratio;
    },
    FixCanvas: function (canvas: HTMLCanvasElement) {
      const ctx = canvas.getContext("2d");
      const drawImage = ctx.drawImage;
      ctx.drawImage = function (
        img: HTMLImageElement,
        sx: number,
        sy: number,
        sw?: number,
        sh?: number,
        dx?: number,
        dy?: number,
        dw?: number,
        dh?: number
      ) {
        let vertSquashRatio = 1;
        if (!!img && img.nodeName === "IMG") {
          vertSquashRatio = BarcodeScanner.DetectVerticalSquash(img);
          sw || (sw = img.naturalWidth);
          sh || (sh = img.naturalHeight);
        }
        if (arguments.length === 9)
          drawImage.call(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
        else if (typeof sw !== "undefined")
          drawImage.call(ctx, img, sx, sy, sw, sh / vertSquashRatio);
        else drawImage.call(ctx, img, sx, sy);
      };
      return canvas;
    },
  };