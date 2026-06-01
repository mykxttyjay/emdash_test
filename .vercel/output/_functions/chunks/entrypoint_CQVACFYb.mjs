import '@vercel/routing-utils';
import path__default from 'node:path';
import colors from 'piccolore';
import { parse as parse$1, stringify as stringify$1, unflatten as unflatten$1 } from 'devalue';
import 'es-module-lexer';
import { r as removeTrailingForwardSlash, R as ROUTE_TYPE_HEADER, a as REROUTE_DIRECTIVE_HEADER, s as shouldAppendForwardSlash, b as appendForwardSlash, A as AstroError, i as i18nNoLocaleFoundInPath, c as ResponseSentError, p as pipelineSymbol, d as ActionNotFoundError, e as REDIRECT_STATUS_CODES, f as ActionsReturnedInvalidDataError, E as EndpointDidNotReturnAResponse, g as REROUTABLE_STATUS_CODES, h as isPropagatingHint, j as getPropagationHint$1, M as MissingMediaQueryDirective, N as NoMatchingImport, k as escapeHTML, l as bufferPropagatedHead, m as isHeadAndContent, n as isRenderTemplateResult, O as OnlyResponseCanBeReturned, o as isPromise, q as promiseWithResolvers, t as encoder, u as chunkToByteArray, v as chunkToString, w as chunkToByteArrayOrString, x as toAttributeString, y as markHTMLString, z as renderSlotToString, B as maybeRenderHead, C as containsServerDirective, F as Fragment, D as renderSlots, S as ServerIslandComponent, G as createAstroComponentInstance, H as Renderer, I as NoMatchingRenderer, J as formatList, K as NoClientOnlyHint, L as internalSpreadAttributes, P as voidElementNames, Q as renderTemplate, T as createRenderInstruction, U as renderElement$1, V as SlotString, W as mergeSlotInstructions, X as HTMLString, Y as isHTMLString, Z as isRenderInstruction, _ as isAstroComponentInstance, $ as isRenderInstance, a0 as renderCspContent, a1 as isNode, a2 as isDeno, a3 as MiddlewareNoDataOrNextCalled, a4 as MiddlewareNotAResponse, a5 as CacheNotEnabled, a6 as defineMiddleware, a7 as NOOP_MIDDLEWARE_HEADER, a8 as decryptString, a9 as createSlotValueFromString, aa as DEFAULT_404_COMPONENT, ab as DEFAULT_404_ROUTE, ac as default404Instance, ad as decodeKey, ae as RouteCache, af as sequence, ag as ReservedSlotName, ah as getRouteGenerator, ai as isRoute404, aj as isRoute500, ak as removeLeadingForwardSlash, al as SessionStorageInitError, am as SessionStorageSaveError, an as getParams, ao as collapseDuplicateSlashes, ap as setOriginPathname, aq as getProps, ar as ForbiddenRewrite, as as copyRequest, at as ASTRO_GENERATOR, au as getOriginPathname, av as LocalsReassigned, aw as generateCspDigest, ax as PrerenderClientAddressNotAvailable, ay as ClientAddressNotAvailable, az as StaticClientAddressNotAvailable, aA as REWRITE_DIRECTIVE_HEADER_KEY, aB as REWRITE_DIRECTIVE_HEADER_VALUE, aC as AstroResponseHeadersReassigned, aD as responseSentSymbol$1, aE as prependForwardSlash, aF as collapseDuplicateLeadingSlashes, aG as joinPaths, aH as isInternalPath, aI as collapseDuplicateTrailingSlashes, aJ as hasFileExtension, aK as LocalsNotAnObject, aL as routeHasHtmlExtension, aM as clientAddressSymbol, aN as fileExtension, aO as slash, aP as routeIsRedirect, aQ as routeIsFallback, aR as getFallbackRoute, aS as findRouteToRewrite } from './sequence_DO5rsetM.mjs';
import { clsx } from 'clsx';
import { serialize, parse } from 'cookie';
import { s as spreadAttributes } from './index_DbzAPd79.mjs';
import { createStorage } from 'unstorage';

function matchPattern(url, remotePattern) {
  return matchProtocol(url, remotePattern.protocol) && matchHostname(url, remotePattern.hostname, true) && matchPort(url, remotePattern.port) && matchPathname(url, remotePattern.pathname, true);
}
function matchPort(url, port) {
  return !port || port === url.port;
}
function matchProtocol(url, protocol) {
  return !protocol || protocol === url.protocol.slice(0, -1);
}
function matchHostname(url, hostname, allowWildcard = false) {
  if (!hostname) {
    return true;
  } else if (!allowWildcard || !hostname.startsWith("*")) {
    return hostname === url.hostname;
  } else if (hostname.startsWith("**.")) {
    const slicedHostname = hostname.slice(2);
    return slicedHostname !== url.hostname && url.hostname.endsWith(slicedHostname);
  } else if (hostname.startsWith("*.")) {
    const slicedHostname = hostname.slice(1);
    if (!url.hostname.endsWith(slicedHostname)) {
      return false;
    }
    const subdomainWithDot = url.hostname.slice(0, -(slicedHostname.length - 1));
    return subdomainWithDot.endsWith(".") && !subdomainWithDot.slice(0, -1).includes(".");
  }
  return false;
}
function matchPathname(url, pathname, allowWildcard = false) {
  if (!pathname) {
    return true;
  } else if (!allowWildcard || !pathname.endsWith("*")) {
    return pathname === url.pathname;
  } else if (pathname.endsWith("/**")) {
    const slicedPathname = pathname.slice(0, -2);
    return slicedPathname !== url.pathname && url.pathname.startsWith(slicedPathname);
  } else if (pathname.endsWith("/*")) {
    const slicedPathname = pathname.slice(0, -1);
    if (!url.pathname.startsWith(slicedPathname)) {
      return false;
    }
    const additionalPathChunks = url.pathname.slice(slicedPathname.length).split("/").filter(Boolean);
    return additionalPathChunks.length === 1;
  }
  return false;
}
function isRemoteAllowed(src, {
  domains,
  remotePatterns
}) {
  if (!URL.canParse(src)) {
    return false;
  }
  const url = new URL(src);
  if (!["http:", "https:", "data:"].includes(url.protocol)) {
    return false;
  }
  return domains.some((domain) => matchHostname(url, domain)) || remotePatterns.some((remotePattern) => matchPattern(url, remotePattern));
}

const decoder = new TextDecoder();
const toUTF8String = (input, start = 0, end = input.length) => decoder.decode(input.slice(start, end));
const toHexString = (input, start = 0, end = input.length) => input.slice(start, end).reduce((memo, i) => memo + `0${i.toString(16)}`.slice(-2), "");
const getView = (input, offset) => new DataView(input.buffer, input.byteOffset + offset);
const readInt16LE = (input, offset = 0) => getView(input, offset).getInt16(0, true);
const readUInt16BE = (input, offset = 0) => getView(input, offset).getUint16(0, false);
const readUInt16LE = (input, offset = 0) => getView(input, offset).getUint16(0, true);
const readUInt24LE = (input, offset = 0) => {
  const view = getView(input, offset);
  return view.getUint16(0, true) + (view.getUint8(2) << 16);
};
const readInt32LE = (input, offset = 0) => getView(input, offset).getInt32(0, true);
const readUInt32BE = (input, offset = 0) => getView(input, offset).getUint32(0, false);
const readUInt32LE = (input, offset = 0) => getView(input, offset).getUint32(0, true);
const readUInt64 = (input, offset, isBigEndian) => getView(input, offset).getBigUint64(0, !isBigEndian);
const methods = {
  readUInt16BE,
  readUInt16LE,
  readUInt32BE,
  readUInt32LE
};
function readUInt(input, bits, offset = 0, isBigEndian = false) {
  const endian = isBigEndian ? "BE" : "LE";
  const methodName = `readUInt${bits}${endian}`;
  return methods[methodName](input, offset);
}
function readBox(input, offset) {
  if (input.length - offset < 4) return;
  const boxSize = readUInt32BE(input, offset);
  if (input.length - offset < boxSize) return;
  return {
    name: toUTF8String(input, 4 + offset, 8 + offset),
    offset,
    size: boxSize
  };
}
function findBox(input, boxName, currentOffset) {
  while (currentOffset < input.length) {
    const box = readBox(input, currentOffset);
    if (!box) break;
    if (box.name === boxName) return box;
    currentOffset += box.size > 0 ? box.size : 8;
  }
}

const BMP = {
  validate: (input) => toUTF8String(input, 0, 2) === "BM",
  calculate: (input) => ({
    height: Math.abs(readInt32LE(input, 22)),
    width: readUInt32LE(input, 18)
  })
};

const TYPE_ICON = 1;
const SIZE_HEADER$1 = 2 + 2 + 2;
const SIZE_IMAGE_ENTRY = 1 + 1 + 1 + 1 + 2 + 2 + 4 + 4;
function getSizeFromOffset(input, offset) {
  const value = input[offset];
  return value === 0 ? 256 : value;
}
function getImageSize$1(input, imageIndex) {
  const offset = SIZE_HEADER$1 + imageIndex * SIZE_IMAGE_ENTRY;
  return {
    height: getSizeFromOffset(input, offset + 1),
    width: getSizeFromOffset(input, offset)
  };
}
const ICO = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_ICON;
  },
  calculate(input) {
    const nbImages = readUInt16LE(input, 4);
    const imageSize = getImageSize$1(input, 0);
    if (nbImages === 1) return imageSize;
    const images = [];
    for (let imageIndex = 0; imageIndex < nbImages; imageIndex += 1) {
      images.push(getImageSize$1(input, imageIndex));
    }
    return {
      width: imageSize.width,
      height: imageSize.height,
      images
    };
  }
};

const TYPE_CURSOR = 2;
const CUR = {
  validate(input) {
    const reserved = readUInt16LE(input, 0);
    const imageCount = readUInt16LE(input, 4);
    if (reserved !== 0 || imageCount === 0) return false;
    const imageType = readUInt16LE(input, 2);
    return imageType === TYPE_CURSOR;
  },
  calculate: (input) => ICO.calculate(input)
};

const DDS = {
  validate: (input) => readUInt32LE(input, 0) === 542327876,
  calculate: (input) => ({
    height: readUInt32LE(input, 12),
    width: readUInt32LE(input, 16)
  })
};

const gifRegexp = /^GIF8[79]a/;
const GIF = {
  validate: (input) => gifRegexp.test(toUTF8String(input, 0, 6)),
  calculate: (input) => ({
    height: readUInt16LE(input, 8),
    width: readUInt16LE(input, 6)
  })
};

const brandMap = {
  avif: "avif",
  avis: "avif",
  // avif-sequence
  mif1: "heif",
  msf1: "heif",
  // heif-sequence
  heic: "heic",
  heix: "heic",
  hevc: "heic",
  // heic-sequence
  hevx: "heic"
  // heic-sequence
};
function detectType(input, start, end) {
  let hasAvif = false;
  let hasHeic = false;
  let hasHeif = false;
  for (let i = start; i <= end; i += 4) {
    const brand = toUTF8String(input, i, i + 4);
    if (brand === "avif" || brand === "avis") hasAvif = true;
    else if (brand === "heic" || brand === "heix" || brand === "hevc" || brand === "hevx") hasHeic = true;
    else if (brand === "mif1" || brand === "msf1") hasHeif = true;
  }
  if (hasAvif) return "avif";
  if (hasHeic) return "heic";
  if (hasHeif) return "heif";
}
const HEIF = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "ftyp") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand in brandMap;
  },
  calculate(input) {
    const metaBox = findBox(input, "meta", 0);
    const iprpBox = metaBox && findBox(input, "iprp", metaBox.offset + 12);
    const ipcoBox = iprpBox && findBox(input, "ipco", iprpBox.offset + 8);
    if (!ipcoBox) {
      throw new TypeError("Invalid HEIF, no ipco box found");
    }
    const type = detectType(input, 8, metaBox.offset);
    const images = [];
    let currentOffset = ipcoBox.offset + 8;
    while (currentOffset < ipcoBox.offset + ipcoBox.size) {
      const ispeBox = findBox(input, "ispe", currentOffset);
      if (!ispeBox) break;
      const rawWidth = readUInt32BE(input, ispeBox.offset + 12);
      const rawHeight = readUInt32BE(input, ispeBox.offset + 16);
      const clapBox = findBox(input, "clap", currentOffset);
      let width = rawWidth;
      let height = rawHeight;
      if (clapBox && clapBox.offset < ipcoBox.offset + ipcoBox.size) {
        const cropRight = readUInt32BE(input, clapBox.offset + 12);
        width = rawWidth - cropRight;
      }
      images.push({ height, width });
      currentOffset = ispeBox.offset + ispeBox.size;
    }
    if (images.length === 0) {
      throw new TypeError("Invalid HEIF, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      type,
      ...images.length > 1 ? { images } : {}
    };
  }
};

const SIZE_HEADER = 4 + 4;
const FILE_LENGTH_OFFSET = 4;
const ENTRY_LENGTH_OFFSET = 4;
const ICON_TYPE_SIZE = {
  ICON: 32,
  "ICN#": 32,
  // m => 16 x 16
  "icm#": 16,
  icm4: 16,
  icm8: 16,
  // s => 16 x 16
  "ics#": 16,
  ics4: 16,
  ics8: 16,
  is32: 16,
  s8mk: 16,
  icp4: 16,
  // l => 32 x 32
  icl4: 32,
  icl8: 32,
  il32: 32,
  l8mk: 32,
  icp5: 32,
  ic11: 32,
  // h => 48 x 48
  ich4: 48,
  ich8: 48,
  ih32: 48,
  h8mk: 48,
  // . => 64 x 64
  icp6: 64,
  ic12: 32,
  // t => 128 x 128
  it32: 128,
  t8mk: 128,
  ic07: 128,
  // . => 256 x 256
  ic08: 256,
  ic13: 256,
  // . => 512 x 512
  ic09: 512,
  ic14: 512,
  // . => 1024 x 1024
  ic10: 1024
};
function readImageHeader(input, imageOffset) {
  const imageLengthOffset = imageOffset + ENTRY_LENGTH_OFFSET;
  return [
    toUTF8String(input, imageOffset, imageLengthOffset),
    readUInt32BE(input, imageLengthOffset)
  ];
}
function getImageSize(type) {
  const size = ICON_TYPE_SIZE[type];
  return { width: size, height: size, type };
}
const ICNS = {
  validate: (input) => toUTF8String(input, 0, 4) === "icns",
  calculate(input) {
    const inputLength = input.length;
    const fileLength = readUInt32BE(input, FILE_LENGTH_OFFSET);
    let imageOffset = SIZE_HEADER;
    const images = [];
    while (imageOffset < fileLength && imageOffset < inputLength) {
      const imageHeader = readImageHeader(input, imageOffset);
      const imageSize = getImageSize(imageHeader[0]);
      images.push(imageSize);
      imageOffset += imageHeader[1];
    }
    if (images.length === 0) {
      throw new TypeError("Invalid ICNS, no sizes found");
    }
    return {
      width: images[0].width,
      height: images[0].height,
      ...images.length > 1 ? { images } : {}
    };
  }
};

const J2C = {
  // TODO: this doesn't seem right. SIZ marker doesn't have to be right after the SOC
  validate: (input) => readUInt32BE(input, 0) === 4283432785,
  calculate: (input) => ({
    height: readUInt32BE(input, 12),
    width: readUInt32BE(input, 8)
  })
};

const JP2 = {
  validate(input) {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "jP  ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jp2 ";
  },
  calculate(input) {
    const jp2hBox = findBox(input, "jp2h", 0);
    const ihdrBox = jp2hBox && findBox(input, "ihdr", jp2hBox.offset + 8);
    if (ihdrBox) {
      return {
        height: readUInt32BE(input, ihdrBox.offset + 8),
        width: readUInt32BE(input, ihdrBox.offset + 12)
      };
    }
    throw new TypeError("Unsupported JPEG 2000 format");
  }
};

const EXIF_MARKER = "45786966";
const APP1_DATA_SIZE_BYTES = 2;
const EXIF_HEADER_BYTES = 6;
const TIFF_BYTE_ALIGN_BYTES = 2;
const BIG_ENDIAN_BYTE_ALIGN = "4d4d";
const LITTLE_ENDIAN_BYTE_ALIGN = "4949";
const IDF_ENTRY_BYTES = 12;
const NUM_DIRECTORY_ENTRIES_BYTES = 2;
function isEXIF(input) {
  return toHexString(input, 2, 6) === EXIF_MARKER;
}
function extractSize(input, index) {
  return {
    height: readUInt16BE(input, index),
    width: readUInt16BE(input, index + 2)
  };
}
function extractOrientation(exifBlock, isBigEndian) {
  const idfOffset = 8;
  const offset = EXIF_HEADER_BYTES + idfOffset;
  const idfDirectoryEntries = readUInt(exifBlock, 16, offset, isBigEndian);
  for (let directoryEntryNumber = 0; directoryEntryNumber < idfDirectoryEntries; directoryEntryNumber++) {
    const start = offset + NUM_DIRECTORY_ENTRIES_BYTES + directoryEntryNumber * IDF_ENTRY_BYTES;
    const end = start + IDF_ENTRY_BYTES;
    if (start > exifBlock.length) {
      return;
    }
    const block = exifBlock.slice(start, end);
    const tagNumber = readUInt(block, 16, 0, isBigEndian);
    if (tagNumber === 274) {
      const dataFormat = readUInt(block, 16, 2, isBigEndian);
      if (dataFormat !== 3) {
        return;
      }
      const numberOfComponents = readUInt(block, 32, 4, isBigEndian);
      if (numberOfComponents !== 1) {
        return;
      }
      return readUInt(block, 16, 8, isBigEndian);
    }
  }
}
function validateExifBlock(input, index) {
  const exifBlock = input.slice(APP1_DATA_SIZE_BYTES, index);
  const byteAlign = toHexString(
    exifBlock,
    EXIF_HEADER_BYTES,
    EXIF_HEADER_BYTES + TIFF_BYTE_ALIGN_BYTES
  );
  const isBigEndian = byteAlign === BIG_ENDIAN_BYTE_ALIGN;
  const isLittleEndian = byteAlign === LITTLE_ENDIAN_BYTE_ALIGN;
  if (isBigEndian || isLittleEndian) {
    return extractOrientation(exifBlock, isBigEndian);
  }
}
function validateInput(input, index) {
  if (index > input.length) {
    throw new TypeError("Corrupt JPG, exceeded buffer limits");
  }
}
const JPG = {
  validate: (input) => toHexString(input, 0, 2) === "ffd8",
  calculate(_input) {
    let input = _input.slice(4);
    let orientation;
    let next;
    while (input.length) {
      const i = readUInt16BE(input, 0);
      validateInput(input, i);
      if (input[i] !== 255) {
        input = input.slice(1);
        continue;
      }
      if (isEXIF(input)) {
        orientation = validateExifBlock(input, i);
      }
      next = input[i + 1];
      if (next === 192 || next === 193 || next === 194) {
        const size = extractSize(input, i + 5);
        if (!orientation) {
          return size;
        }
        return {
          height: size.height,
          orientation,
          width: size.width
        };
      }
      input = input.slice(i + 2);
    }
    throw new TypeError("Invalid JPG, no size found");
  }
};

class BitReader {
  // Skip the first 16 bits (2 bytes) of signature
  byteOffset = 2;
  bitOffset = 0;
  input;
  endianness;
  constructor(input, endianness) {
    this.input = input;
    this.endianness = endianness;
  }
  /** Reads a specified number of bits, and move the offset */
  getBits(length = 1) {
    let result = 0;
    let bitsRead = 0;
    while (bitsRead < length) {
      if (this.byteOffset >= this.input.length) {
        throw new Error("Reached end of input");
      }
      const currentByte = this.input[this.byteOffset];
      const bitsLeft = 8 - this.bitOffset;
      const bitsToRead = Math.min(length - bitsRead, bitsLeft);
      if (this.endianness === "little-endian") {
        const mask = (1 << bitsToRead) - 1;
        const bits = currentByte >> this.bitOffset & mask;
        result |= bits << bitsRead;
      } else {
        const mask = (1 << bitsToRead) - 1 << 8 - this.bitOffset - bitsToRead;
        const bits = (currentByte & mask) >> 8 - this.bitOffset - bitsToRead;
        result = result << bitsToRead | bits;
      }
      bitsRead += bitsToRead;
      this.bitOffset += bitsToRead;
      if (this.bitOffset === 8) {
        this.byteOffset++;
        this.bitOffset = 0;
      }
    }
    return result;
  }
}

function calculateImageDimension(reader, isSmallImage) {
  if (isSmallImage) {
    return 8 * (1 + reader.getBits(5));
  }
  const sizeClass = reader.getBits(2);
  const extraBits = [9, 13, 18, 30][sizeClass];
  return 1 + reader.getBits(extraBits);
}
function calculateImageWidth(reader, isSmallImage, widthMode, height) {
  if (isSmallImage && widthMode === 0) {
    return 8 * (1 + reader.getBits(5));
  }
  if (widthMode === 0) {
    return calculateImageDimension(reader, false);
  }
  const aspectRatios = [1, 1.2, 4 / 3, 1.5, 16 / 9, 5 / 4, 2];
  return Math.floor(height * aspectRatios[widthMode - 1]);
}
const JXLStream = {
  validate: (input) => {
    return toHexString(input, 0, 2) === "ff0a";
  },
  calculate(input) {
    const reader = new BitReader(input, "little-endian");
    const isSmallImage = reader.getBits(1) === 1;
    const height = calculateImageDimension(reader, isSmallImage);
    const widthMode = reader.getBits(3);
    const width = calculateImageWidth(reader, isSmallImage, widthMode, height);
    return { width, height };
  }
};

function extractCodestream(input) {
  const jxlcBox = findBox(input, "jxlc", 0);
  if (jxlcBox) {
    return input.slice(jxlcBox.offset + 8, jxlcBox.offset + jxlcBox.size);
  }
  const partialStreams = extractPartialStreams(input);
  if (partialStreams.length > 0) {
    return concatenateCodestreams(partialStreams);
  }
  return void 0;
}
function extractPartialStreams(input) {
  const partialStreams = [];
  let offset = 0;
  while (offset < input.length) {
    const jxlpBox = findBox(input, "jxlp", offset);
    if (!jxlpBox) break;
    partialStreams.push(
      input.slice(jxlpBox.offset + 12, jxlpBox.offset + jxlpBox.size)
    );
    offset = jxlpBox.offset + jxlpBox.size;
  }
  return partialStreams;
}
function concatenateCodestreams(partialCodestreams) {
  const totalLength = partialCodestreams.reduce(
    (acc, curr) => acc + curr.length,
    0
  );
  const codestream = new Uint8Array(totalLength);
  let position = 0;
  for (const partial of partialCodestreams) {
    codestream.set(partial, position);
    position += partial.length;
  }
  return codestream;
}
const JXL = {
  validate: (input) => {
    const boxType = toUTF8String(input, 4, 8);
    if (boxType !== "JXL ") return false;
    const ftypBox = findBox(input, "ftyp", 0);
    if (!ftypBox) return false;
    const brand = toUTF8String(input, ftypBox.offset + 8, ftypBox.offset + 12);
    return brand === "jxl ";
  },
  calculate(input) {
    const codestream = extractCodestream(input);
    if (codestream) return JXLStream.calculate(codestream);
    throw new Error("No codestream found in JXL container");
  }
};

const KTX = {
  validate: (input) => {
    const signature = toUTF8String(input, 1, 7);
    return ["KTX 11", "KTX 20"].includes(signature);
  },
  calculate: (input) => {
    const type = input[5] === 49 ? "ktx" : "ktx2";
    const offset = type === "ktx" ? 36 : 20;
    return {
      height: readUInt32LE(input, offset + 4),
      width: readUInt32LE(input, offset),
      type
    };
  }
};

const pngSignature = "PNG\r\n\n";
const pngImageHeaderChunkName = "IHDR";
const pngFriedChunkName = "CgBI";
const PNG = {
  validate(input) {
    if (pngSignature === toUTF8String(input, 1, 8)) {
      let chunkName = toUTF8String(input, 12, 16);
      if (chunkName === pngFriedChunkName) {
        chunkName = toUTF8String(input, 28, 32);
      }
      if (chunkName !== pngImageHeaderChunkName) {
        throw new TypeError("Invalid PNG");
      }
      return true;
    }
    return false;
  },
  calculate(input) {
    if (toUTF8String(input, 12, 16) === pngFriedChunkName) {
      return {
        height: readUInt32BE(input, 36),
        width: readUInt32BE(input, 32)
      };
    }
    return {
      height: readUInt32BE(input, 20),
      width: readUInt32BE(input, 16)
    };
  }
};

const PNMTypes = {
  P1: "pbm/ascii",
  P2: "pgm/ascii",
  P3: "ppm/ascii",
  P4: "pbm",
  P5: "pgm",
  P6: "ppm",
  P7: "pam",
  PF: "pfm"
};
const handlers = {
  default: (lines) => {
    let dimensions = [];
    while (lines.length > 0) {
      const line = lines.shift();
      if (line[0] === "#") {
        continue;
      }
      dimensions = line.split(" ");
      break;
    }
    if (dimensions.length === 2) {
      return {
        height: Number.parseInt(dimensions[1], 10),
        width: Number.parseInt(dimensions[0], 10)
      };
    }
    throw new TypeError("Invalid PNM");
  },
  pam: (lines) => {
    const size = {};
    while (lines.length > 0) {
      const line = lines.shift();
      if (line.length > 16 || line.charCodeAt(0) > 128) {
        continue;
      }
      const [key, value] = line.split(" ");
      if (key && value) {
        size[key.toLowerCase()] = Number.parseInt(value, 10);
      }
      if (size.height && size.width) {
        break;
      }
    }
    if (size.height && size.width) {
      return {
        height: size.height,
        width: size.width
      };
    }
    throw new TypeError("Invalid PAM");
  }
};
const PNM = {
  validate: (input) => toUTF8String(input, 0, 2) in PNMTypes,
  calculate(input) {
    const signature = toUTF8String(input, 0, 2);
    const type = PNMTypes[signature];
    const lines = toUTF8String(input, 3).split(/[\r\n]+/);
    const handler = handlers[type] || handlers.default;
    return handler(lines);
  }
};

const PSD = {
  validate: (input) => toUTF8String(input, 0, 4) === "8BPS",
  calculate: (input) => ({
    height: readUInt32BE(input, 14),
    width: readUInt32BE(input, 18)
  })
};

const svgReg = /<svg\s([^>"']|"[^"]*"|'[^']*')*>/;
const extractorRegExps = {
  height: /\sheight=(['"])([^%]+?)\1/,
  root: svgReg,
  viewbox: /\sviewBox=(['"])(.+?)\1/i,
  width: /\swidth=(['"])([^%]+?)\1/
};
const INCH_CM = 2.54;
const units = {
  in: 96,
  cm: 96 / INCH_CM,
  em: 16,
  ex: 8,
  m: 96 / INCH_CM * 100,
  mm: 96 / INCH_CM / 10,
  pc: 96 / 72 / 12,
  pt: 96 / 72,
  px: 1
};
const unitsReg = new RegExp(
  `^([0-9.]+(?:e\\d+)?)(${Object.keys(units).join("|")})?$`
);
function parseLength(len) {
  const m = unitsReg.exec(len);
  if (!m) {
    return void 0;
  }
  return Math.round(Number(m[1]) * (units[m[2]] || 1));
}
function parseViewbox(viewbox) {
  const bounds = viewbox.split(" ");
  return {
    height: parseLength(bounds[3]),
    width: parseLength(bounds[2])
  };
}
function parseAttributes(root) {
  const width = extractorRegExps.width.exec(root);
  const height = extractorRegExps.height.exec(root);
  const viewbox = extractorRegExps.viewbox.exec(root);
  return {
    height: height && parseLength(height[2]),
    viewbox: viewbox && parseViewbox(viewbox[2]),
    width: width && parseLength(width[2])
  };
}
function calculateByDimensions(attrs) {
  return {
    height: attrs.height,
    width: attrs.width
  };
}
function calculateByViewbox(attrs, viewbox) {
  const ratio = viewbox.width / viewbox.height;
  if (attrs.width) {
    return {
      height: Math.floor(attrs.width / ratio),
      width: attrs.width
    };
  }
  if (attrs.height) {
    return {
      height: attrs.height,
      width: Math.floor(attrs.height * ratio)
    };
  }
  return {
    height: viewbox.height,
    width: viewbox.width
  };
}
const SVG = {
  // Scan only the first kilo-byte to speed up the check on larger files
  validate: (input) => svgReg.test(toUTF8String(input, 0, 1e3)),
  calculate(input) {
    const root = extractorRegExps.root.exec(toUTF8String(input));
    if (root) {
      const attrs = parseAttributes(root[0]);
      if (attrs.width && attrs.height) {
        return calculateByDimensions(attrs);
      }
      if (attrs.viewbox) {
        return calculateByViewbox(attrs, attrs.viewbox);
      }
    }
    throw new TypeError("Invalid SVG");
  }
};

const TGA = {
  validate(input) {
    return readUInt16LE(input, 0) === 0 && readUInt16LE(input, 4) === 0;
  },
  calculate(input) {
    return {
      height: readUInt16LE(input, 14),
      width: readUInt16LE(input, 12)
    };
  }
};

const CONSTANTS = {
  TAG: {
    WIDTH: 256,
    HEIGHT: 257,
    COMPRESSION: 259
  },
  TYPE: {
    SHORT: 3,
    LONG: 4,
    LONG8: 16
  },
  ENTRY_SIZE: {
    STANDARD: 12,
    BIG: 20
  },
  COUNT_SIZE: {
    STANDARD: 2,
    BIG: 8
  }
};
function readIFD(input, { isBigEndian, isBigTiff }) {
  const ifdOffset = isBigTiff ? Number(readUInt64(input, 8, isBigEndian)) : readUInt(input, 32, 4, isBigEndian);
  const entryCountSize = isBigTiff ? CONSTANTS.COUNT_SIZE.BIG : CONSTANTS.COUNT_SIZE.STANDARD;
  return input.slice(ifdOffset + entryCountSize);
}
function readTagValue(input, type, offset, isBigEndian) {
  switch (type) {
    case CONSTANTS.TYPE.SHORT:
      return readUInt(input, 16, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG:
      return readUInt(input, 32, offset, isBigEndian);
    case CONSTANTS.TYPE.LONG8: {
      const value = Number(readUInt64(input, offset, isBigEndian));
      if (value > Number.MAX_SAFE_INTEGER) {
        throw new TypeError("Value too large");
      }
      return value;
    }
    default:
      return 0;
  }
}
function nextTag(input, isBigTiff) {
  const entrySize = isBigTiff ? CONSTANTS.ENTRY_SIZE.BIG : CONSTANTS.ENTRY_SIZE.STANDARD;
  if (input.length > entrySize) {
    return input.slice(entrySize);
  }
}
function extractTags(input, { isBigEndian, isBigTiff }) {
  const tags = {};
  let temp = input;
  while (temp?.length) {
    const code = readUInt(temp, 16, 0, isBigEndian);
    const type = readUInt(temp, 16, 2, isBigEndian);
    const length = isBigTiff ? Number(readUInt64(temp, 4, isBigEndian)) : readUInt(temp, 32, 4, isBigEndian);
    if (code === 0) break;
    if (length === 1 && (type === CONSTANTS.TYPE.SHORT || type === CONSTANTS.TYPE.LONG || isBigTiff && type === CONSTANTS.TYPE.LONG8)) {
      const valueOffset = isBigTiff ? 12 : 8;
      tags[code] = readTagValue(temp, type, valueOffset, isBigEndian);
    }
    temp = nextTag(temp, isBigTiff);
  }
  return tags;
}
function determineFormat(input) {
  const signature = toUTF8String(input, 0, 2);
  const version = readUInt(input, 16, 2, signature === "MM");
  return {
    isBigEndian: signature === "MM",
    isBigTiff: version === 43
  };
}
function validateBigTIFFHeader(input, isBigEndian) {
  const byteSize = readUInt(input, 16, 4, isBigEndian);
  const reserved = readUInt(input, 16, 6, isBigEndian);
  if (byteSize !== 8 || reserved !== 0) {
    throw new TypeError("Invalid BigTIFF header");
  }
}
const signatures = /* @__PURE__ */ new Set([
  "49492a00",
  // Little Endian
  "4d4d002a",
  // Big Endian
  "49492b00",
  // BigTIFF Little Endian
  "4d4d002b"
  // BigTIFF Big Endian
]);
const TIFF = {
  validate: (input) => {
    const signature = toHexString(input, 0, 4);
    return signatures.has(signature);
  },
  calculate(input) {
    const format = determineFormat(input);
    if (format.isBigTiff) {
      validateBigTIFFHeader(input, format.isBigEndian);
    }
    const ifdBuffer = readIFD(input, format);
    const tags = extractTags(ifdBuffer, format);
    const info = {
      height: tags[CONSTANTS.TAG.HEIGHT],
      width: tags[CONSTANTS.TAG.WIDTH],
      type: format.isBigTiff ? "bigtiff" : "tiff"
    };
    if (tags[CONSTANTS.TAG.COMPRESSION]) {
      info.compression = tags[CONSTANTS.TAG.COMPRESSION];
    }
    if (!info.width || !info.height) {
      throw new TypeError("Invalid Tiff. Missing tags");
    }
    return info;
  }
};

function calculateExtended(input) {
  return {
    height: 1 + readUInt24LE(input, 7),
    width: 1 + readUInt24LE(input, 4)
  };
}
function calculateLossless(input) {
  return {
    height: 1 + ((input[4] & 15) << 10 | input[3] << 2 | (input[2] & 192) >> 6),
    width: 1 + ((input[2] & 63) << 8 | input[1])
  };
}
function calculateLossy(input) {
  return {
    height: readInt16LE(input, 8) & 16383,
    width: readInt16LE(input, 6) & 16383
  };
}
const WEBP = {
  validate(input) {
    const riffHeader = "RIFF" === toUTF8String(input, 0, 4);
    const webpHeader = "WEBP" === toUTF8String(input, 8, 12);
    const vp8Header = "VP8" === toUTF8String(input, 12, 15);
    return riffHeader && webpHeader && vp8Header;
  },
  calculate(_input) {
    const chunkHeader = toUTF8String(_input, 12, 16);
    const input = _input.slice(20, 30);
    if (chunkHeader === "VP8X") {
      const extendedHeader = input[0];
      const validStart = (extendedHeader & 192) === 0;
      const validEnd = (extendedHeader & 1) === 0;
      if (validStart && validEnd) {
        return calculateExtended(input);
      }
      throw new TypeError("Invalid WebP");
    }
    if (chunkHeader === "VP8 " && input[0] !== 47) {
      return calculateLossy(input);
    }
    const signature = toHexString(input, 3, 6);
    if (chunkHeader === "VP8L" && signature !== "9d012a") {
      return calculateLossless(input);
    }
    throw new TypeError("Invalid WebP");
  }
};

const typeHandlers = /* @__PURE__ */ new Map([
  ["bmp", BMP],
  ["cur", CUR],
  ["dds", DDS],
  ["gif", GIF],
  ["heif", HEIF],
  ["icns", ICNS],
  ["ico", ICO],
  ["j2c", J2C],
  ["jp2", JP2],
  ["jpg", JPG],
  ["jxl", JXL],
  ["jxl-stream", JXLStream],
  ["ktx", KTX],
  ["png", PNG],
  ["pnm", PNM],
  ["psd", PSD],
  ["svg", SVG],
  ["tga", TGA],
  ["tiff", TIFF],
  ["webp", WEBP]
]);
const types = Array.from(typeHandlers.keys());

path__default.posix.join;

const ASTRO_PATH_HEADER = "x-astro-path";
const ASTRO_PATH_PARAM = "x_astro_path";
const ASTRO_LOCALS_HEADER = "x-astro-locals";
const ASTRO_MIDDLEWARE_SECRET_HEADER = "x-astro-middleware-secret";

const middlewareSecret = "7c5e9815-743c-496e-9bf3-7c58c61a2883";

function computeFallbackRoute(options) {
  const {
    pathname,
    responseStatus,
    fallback,
    fallbackType,
    locales,
    defaultLocale,
    strategy,
    base
  } = options;
  if (responseStatus !== 404) {
    return { type: "none" };
  }
  if (!fallback || Object.keys(fallback).length === 0) {
    return { type: "none" };
  }
  const segments = pathname.split("/");
  const urlLocale = segments.find((segment) => {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (locale === segment) {
          return true;
        }
      } else if (locale.path === segment) {
        return true;
      }
    }
    return false;
  });
  if (!urlLocale) {
    return { type: "none" };
  }
  const fallbackKeys = Object.keys(fallback);
  if (!fallbackKeys.includes(urlLocale)) {
    return { type: "none" };
  }
  const fallbackLocale = fallback[urlLocale];
  const pathFallbackLocale = getPathByLocale(fallbackLocale, locales);
  let newPathname;
  if (pathFallbackLocale === defaultLocale && strategy === "pathname-prefix-other-locales") {
    if (pathname.includes(`${base}`)) {
      newPathname = pathname.replace(`/${urlLocale}`, ``);
    } else {
      newPathname = pathname.replace(`/${urlLocale}`, `/`);
    }
  } else {
    newPathname = pathname.replace(`/${urlLocale}`, `/${pathFallbackLocale}`);
  }
  return {
    type: fallbackType,
    pathname: newPathname
  };
}

class I18nRouter {
  #strategy;
  #defaultLocale;
  #locales;
  #base;
  #domains;
  constructor(options) {
    this.#strategy = options.strategy;
    this.#defaultLocale = options.defaultLocale;
    this.#locales = options.locales;
    this.#base = options.base === "/" ? "/" : removeTrailingForwardSlash(options.base || "");
    this.#domains = options.domains;
  }
  /**
   * Evaluate routing strategy for a pathname.
   * Returns decision object (not HTTP Response).
   */
  match(pathname, context) {
    if (this.shouldSkipProcessing(pathname, context)) {
      return { type: "continue" };
    }
    switch (this.#strategy) {
      case "manual":
        return { type: "continue" };
      case "pathname-prefix-always":
        return this.matchPrefixAlways(pathname, context);
      case "domains-prefix-always":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlways(pathname, context);
      case "pathname-prefix-other-locales":
        return this.matchPrefixOtherLocales(pathname, context);
      case "domains-prefix-other-locales":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixOtherLocales(pathname, context);
      case "pathname-prefix-always-no-redirect":
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      case "domains-prefix-always-no-redirect":
        if (this.localeHasntDomain(context.currentLocale, context.currentDomain)) {
          return { type: "continue" };
        }
        return this.matchPrefixAlwaysNoRedirect(pathname, context);
      default:
        return { type: "continue" };
    }
  }
  /**
   * Check if i18n processing should be skipped for this request
   */
  shouldSkipProcessing(pathname, context) {
    if (pathname.includes("/404") || pathname.includes("/500")) {
      return true;
    }
    if (pathname.includes("/_server-islands/")) {
      return true;
    }
    if (context.isReroute) {
      return true;
    }
    if (context.routeType && context.routeType !== "page" && context.routeType !== "fallback") {
      return true;
    }
    return false;
  }
  /**
   * Strategy: pathname-prefix-always
   * All locales must have a prefix, including the default locale.
   */
  matchPrefixAlways(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      const basePrefix = this.#base === "/" ? "" : this.#base;
      return {
        type: "redirect",
        location: `${basePrefix}/${this.#defaultLocale}`
      };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-other-locales
   * Default locale has no prefix, other locales must have a prefix.
   */
  matchPrefixOtherLocales(pathname, _context) {
    let pathnameContainsDefaultLocale = false;
    for (const segment of pathname.split("/")) {
      if (normalizeTheLocale(segment) === normalizeTheLocale(this.#defaultLocale)) {
        pathnameContainsDefaultLocale = true;
        break;
      }
    }
    if (pathnameContainsDefaultLocale) {
      const newLocation = pathname.replace(`/${this.#defaultLocale}`, "");
      return {
        type: "notFound",
        location: newLocation
      };
    }
    return { type: "continue" };
  }
  /**
   * Strategy: pathname-prefix-always-no-redirect
   * Like prefix-always but allows root to serve instead of redirecting
   */
  matchPrefixAlwaysNoRedirect(pathname, _context) {
    const isRoot = pathname === this.#base + "/" || pathname === this.#base;
    if (isRoot) {
      return { type: "continue" };
    }
    if (!pathHasLocale(pathname, this.#locales)) {
      return { type: "notFound" };
    }
    return { type: "continue" };
  }
  /**
   * Check if the current locale doesn't belong to the configured domain.
   * Used for domain-based routing strategies.
   */
  localeHasntDomain(currentLocale, currentDomain) {
    if (!this.#domains || !currentDomain) {
      return false;
    }
    if (!currentLocale) {
      return false;
    }
    const localesForDomain = this.#domains[currentDomain];
    if (!localesForDomain) {
      return true;
    }
    return !localesForDomain.includes(currentLocale);
  }
}

function createI18nMiddleware(i18n, base, trailingSlash, format) {
  if (!i18n) return (_, next) => next();
  const i18nRouter = new I18nRouter({
    strategy: i18n.strategy,
    defaultLocale: i18n.defaultLocale,
    locales: i18n.locales,
    base,
    domains: i18n.domainLookupTable ? Object.keys(i18n.domainLookupTable).reduce(
      (acc, domain) => {
        const locale = i18n.domainLookupTable[domain];
        if (!acc[domain]) {
          acc[domain] = [];
        }
        acc[domain].push(locale);
        return acc;
      },
      {}
    ) : void 0
  });
  return async (context, next) => {
    const response = await next();
    const typeHeader = response.headers.get(ROUTE_TYPE_HEADER);
    const isReroute = response.headers.get(REROUTE_DIRECTIVE_HEADER);
    if (isReroute === "no" && typeof i18n.fallback === "undefined") {
      return response;
    }
    if (typeHeader !== "page" && typeHeader !== "fallback") {
      return response;
    }
    const routerContext = {
      currentLocale: context.currentLocale,
      currentDomain: context.url.hostname,
      routeType: typeHeader,
      isReroute: isReroute === "yes"
    };
    const routeDecision = i18nRouter.match(context.url.pathname, routerContext);
    switch (routeDecision.type) {
      case "redirect": {
        let location = routeDecision.location;
        if (shouldAppendForwardSlash(trailingSlash, format)) {
          location = appendForwardSlash(location);
        }
        return context.redirect(location, routeDecision.status);
      }
      case "notFound": {
        if (context.isPrerendered) {
          const prerenderedRes = new Response(response.body, {
            status: 404,
            headers: response.headers
          });
          prerenderedRes.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          if (routeDecision.location) {
            prerenderedRes.headers.set("Location", routeDecision.location);
          }
          return prerenderedRes;
        }
        const headers = new Headers();
        if (routeDecision.location) {
          headers.set("Location", routeDecision.location);
        }
        return new Response(null, { status: 404, headers });
      }
    }
    if (i18n.fallback && i18n.fallbackType) {
      const fallbackDecision = computeFallbackRoute({
        pathname: context.url.pathname,
        responseStatus: response.status,
        currentLocale: context.currentLocale,
        fallback: i18n.fallback,
        fallbackType: i18n.fallbackType,
        locales: i18n.locales,
        defaultLocale: i18n.defaultLocale,
        strategy: i18n.strategy,
        base
      });
      switch (fallbackDecision.type) {
        case "redirect":
          return context.redirect(fallbackDecision.pathname + context.url.search);
        case "rewrite":
          return await context.rewrite(fallbackDecision.pathname + context.url.search);
      }
    }
    return response;
  };
}

function pathHasLocale(path, locales) {
  const segments = path.split("/").map(normalizeThePath);
  for (const segment of segments) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (normalizeTheLocale(segment) === normalizeTheLocale(locale)) {
          return true;
        }
      } else if (segment === locale.path) {
        return true;
      }
    }
  }
  return false;
}
function getPathByLocale(locale, locales) {
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      if (loopLocale === locale) {
        return loopLocale;
      }
    } else {
      for (const code of loopLocale.codes) {
        if (code === locale) {
          return loopLocale.path;
        }
      }
    }
  }
  throw new AstroError(i18nNoLocaleFoundInPath);
}
function normalizeTheLocale(locale) {
  return locale.replaceAll("_", "-").toLowerCase();
}
function normalizeThePath(path) {
  return path.endsWith(".html") ? path.slice(0, -5) : path;
}
function getAllCodes(locales) {
  const result = [];
  for (const loopLocale of locales) {
    if (typeof loopLocale === "string") {
      result.push(loopLocale);
    } else {
      result.push(...loopLocale.codes);
    }
  }
  return result;
}

const DELETED_EXPIRATION = /* @__PURE__ */ new Date(0);
const DELETED_VALUE = "deleted";
const responseSentSymbol = /* @__PURE__ */ Symbol.for("astro.responseSent");
const identity = (value) => value;
class AstroCookie {
  value;
  constructor(value) {
    this.value = value;
  }
  json() {
    if (this.value === void 0) {
      throw new Error(`Cannot convert undefined to an object.`);
    }
    return JSON.parse(this.value);
  }
  number() {
    return Number(this.value);
  }
  boolean() {
    if (this.value === "false") return false;
    if (this.value === "0") return false;
    return Boolean(this.value);
  }
}
class AstroCookies {
  #request;
  #requestValues;
  #outgoing;
  #consumed;
  constructor(request) {
    this.#request = request;
    this.#requestValues = null;
    this.#outgoing = null;
    this.#consumed = false;
  }
  /**
   * Astro.cookies.delete(key) is used to delete a cookie. Using this method will result
   * in a Set-Cookie header added to the response.
   * @param key The cookie to delete
   * @param options Options related to this deletion, such as the path of the cookie.
   */
  delete(key, options) {
    const {
      // @ts-expect-error
      maxAge: _ignoredMaxAge,
      // @ts-expect-error
      expires: _ignoredExpires,
      ...sanitizedOptions
    } = options || {};
    const serializeOptions = {
      expires: DELETED_EXPIRATION,
      ...sanitizedOptions
    };
    this.#ensureOutgoingMap().set(key, [
      DELETED_VALUE,
      serialize(key, DELETED_VALUE, serializeOptions),
      false
    ]);
  }
  /**
   * Astro.cookies.get(key) is used to get a cookie value. The cookie value is read from the
   * request. If you have set a cookie via Astro.cookies.set(key, value), the value will be taken
   * from that set call, overriding any values already part of the request.
   * @param key The cookie to get.
   * @returns An object containing the cookie value as well as convenience methods for converting its value.
   */
  get(key, options = void 0) {
    if (this.#outgoing?.has(key)) {
      let [serializedValue, , isSetValue] = this.#outgoing.get(key);
      if (isSetValue) {
        return new AstroCookie(serializedValue);
      } else {
        return void 0;
      }
    }
    const decode = options?.decode ?? decodeURIComponent;
    const values = this.#ensureParsed();
    if (key in values) {
      const value = values[key];
      if (value) {
        let decodedValue;
        try {
          decodedValue = decode(value);
        } catch (_error) {
          decodedValue = value;
        }
        return new AstroCookie(decodedValue);
      }
    }
  }
  /**
   * Astro.cookies.has(key) returns a boolean indicating whether this cookie is either
   * part of the initial request or set via Astro.cookies.set(key)
   * @param key The cookie to check for.
   * @param _options This parameter is no longer used.
   * @returns
   */
  has(key, _options) {
    if (this.#outgoing?.has(key)) {
      let [, , isSetValue] = this.#outgoing.get(key);
      return isSetValue;
    }
    const values = this.#ensureParsed();
    return values[key] !== void 0;
  }
  /**
   * Astro.cookies.set(key, value) is used to set a cookie's value. If provided
   * an object it will be stringified via JSON.stringify(value). Additionally you
   * can provide options customizing how this cookie will be set, such as setting httpOnly
   * in order to prevent the cookie from being read in client-side JavaScript.
   * @param key The name of the cookie to set.
   * @param value A value, either a string or other primitive or an object.
   * @param options Options for the cookie, such as the path and security settings.
   */
  set(key, value, options) {
    if (this.#consumed) {
      const warning = new Error(
        "Astro.cookies.set() was called after the cookies had already been sent to the browser.\nThis may have happened if this method was called in an imported component.\nPlease make sure that Astro.cookies.set() is only called in the frontmatter of the main page."
      );
      warning.name = "Warning";
      console.warn(warning);
    }
    let serializedValue;
    if (typeof value === "string") {
      serializedValue = value;
    } else {
      let toStringValue = value.toString();
      if (toStringValue === Object.prototype.toString.call(value)) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = toStringValue;
      }
    }
    const serializeOptions = {};
    if (options) {
      Object.assign(serializeOptions, options);
    }
    this.#ensureOutgoingMap().set(key, [
      serializedValue,
      serialize(key, serializedValue, serializeOptions),
      true
    ]);
    if (this.#request[responseSentSymbol]) {
      throw new AstroError({
        ...ResponseSentError
      });
    }
  }
  /**
   * Merges a new AstroCookies instance into the current instance. Any new cookies
   * will be added to the current instance, overwriting any existing cookies with the same name.
   */
  merge(cookies) {
    const outgoing = cookies.#outgoing;
    if (outgoing) {
      for (const [key, value] of outgoing) {
        this.#ensureOutgoingMap().set(key, value);
      }
    }
  }
  /**
   * Astro.cookies.header() returns an iterator for the cookies that have previously
   * been set by either Astro.cookies.set() or Astro.cookies.delete().
   * This method is primarily used by adapters to set the header on outgoing responses.
   * @returns
   */
  *headers() {
    if (this.#outgoing == null) return;
    for (const [, value] of this.#outgoing) {
      yield value[1];
    }
  }
  /**
   * Behaves the same as AstroCookies.prototype.headers(),
   * but allows a warning when cookies are set after the instance is consumed.
   */
  static consume(cookies) {
    cookies.#consumed = true;
    return cookies.headers();
  }
  #ensureParsed() {
    if (!this.#requestValues) {
      this.#parse();
    }
    if (!this.#requestValues) {
      this.#requestValues = /* @__PURE__ */ Object.create(null);
    }
    return this.#requestValues;
  }
  #ensureOutgoingMap() {
    if (!this.#outgoing) {
      this.#outgoing = /* @__PURE__ */ new Map();
    }
    return this.#outgoing;
  }
  #parse() {
    const raw = this.#request.headers.get("cookie");
    if (!raw) {
      return;
    }
    this.#requestValues = parse(raw, { decode: identity });
  }
}

const astroCookiesSymbol = /* @__PURE__ */ Symbol.for("astro.cookies");
function attachCookiesToResponse(response, cookies) {
  Reflect.set(response, astroCookiesSymbol, cookies);
}
function getCookiesFromResponse(response) {
  let cookies = Reflect.get(response, astroCookiesSymbol);
  if (cookies != null) {
    return cookies;
  } else {
    return void 0;
  }
}
function* getSetCookiesFromResponse(response) {
  const cookies = getCookiesFromResponse(response);
  if (!cookies) {
    return [];
  }
  for (const headerValue of AstroCookies.consume(cookies)) {
    yield headerValue;
  }
  return [];
}

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(colors.bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return colors.red(prefix.join(" "));
  }
  if (level === "warn") {
    return colors.yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return colors.dim(prefix[0]);
  }
  return colors.dim(prefix[0]) + " " + colors.blue(prefix.splice(1).join(" "));
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

const consoleLogDestination = {
  write(event) {
    let dest = console.error;
    if (levels[event.level] < levels["error"]) {
      dest = console.info;
    }
    if (event.label === "SKIP_FORMAT") {
      dest(event.message);
    } else {
      dest(getEventPrefix(event) + " " + event.message);
    }
    return true;
  }
};

const ACTION_QUERY_PARAMS = {
  actionName: "_action"};
const ACTION_RPC_ROUTE_PATTERN = "/_actions/[...path]";

const __vite_import_meta_env__$1 = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
const codeToStatusMap = {
  // Implemented from IANA HTTP Status Code Registry
  // https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  NOT_ACCEPTABLE: 406,
  PROXY_AUTHENTICATION_REQUIRED: 407,
  REQUEST_TIMEOUT: 408,
  CONFLICT: 409,
  GONE: 410,
  LENGTH_REQUIRED: 411,
  PRECONDITION_FAILED: 412,
  CONTENT_TOO_LARGE: 413,
  URI_TOO_LONG: 414,
  UNSUPPORTED_MEDIA_TYPE: 415,
  RANGE_NOT_SATISFIABLE: 416,
  EXPECTATION_FAILED: 417,
  MISDIRECTED_REQUEST: 421,
  UNPROCESSABLE_CONTENT: 422,
  LOCKED: 423,
  FAILED_DEPENDENCY: 424,
  TOO_EARLY: 425,
  UPGRADE_REQUIRED: 426,
  PRECONDITION_REQUIRED: 428,
  TOO_MANY_REQUESTS: 429,
  REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
  UNAVAILABLE_FOR_LEGAL_REASONS: 451,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
  HTTP_VERSION_NOT_SUPPORTED: 505,
  VARIANT_ALSO_NEGOTIATES: 506,
  INSUFFICIENT_STORAGE: 507,
  LOOP_DETECTED: 508,
  NETWORK_AUTHENTICATION_REQUIRED: 511
};
const statusToCodeMap = Object.fromEntries(
  Object.entries(codeToStatusMap).map(([key, value]) => [value, key])
);
class ActionError extends Error {
  type = "AstroActionError";
  code = "INTERNAL_SERVER_ERROR";
  status = 500;
  constructor(params) {
    super(params.message);
    this.code = params.code;
    this.status = ActionError.codeToStatus(params.code);
    if (params.stack) {
      this.stack = params.stack;
    }
  }
  static codeToStatus(code) {
    return codeToStatusMap[code];
  }
  static statusToCode(status) {
    return statusToCodeMap[status] ?? "INTERNAL_SERVER_ERROR";
  }
  static fromJson(body) {
    if (isInputError(body)) {
      return new ActionInputError(body.issues);
    }
    if (isActionError(body)) {
      return new ActionError(body);
    }
    return new ActionError({
      code: "INTERNAL_SERVER_ERROR"
    });
  }
}
function isActionError(error) {
  return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionError";
}
function isInputError(error) {
  return typeof error === "object" && error != null && "type" in error && error.type === "AstroActionInputError" && "issues" in error && Array.isArray(error.issues);
}
class ActionInputError extends ActionError {
  type = "AstroActionInputError";
  // We don't expose all ZodError properties.
  // Not all properties will serialize from server to client,
  // and we don't want to import the full ZodError object into the client.
  issues;
  fields;
  constructor(issues) {
    super({
      message: `Failed to validate: ${JSON.stringify(issues, null, 2)}`,
      code: "BAD_REQUEST"
    });
    this.issues = issues;
    this.fields = {};
    for (const issue of issues) {
      if (issue.path.length > 0) {
        const key = issue.path[0].toString();
        this.fields[key] ??= [];
        this.fields[key]?.push(issue.message);
      }
    }
  }
}
function deserializeActionResult(res) {
  if (res.type === "error") {
    let json;
    try {
      json = JSON.parse(res.body);
    } catch {
      return {
        data: void 0,
        error: new ActionError({
          message: res.body,
          code: "INTERNAL_SERVER_ERROR"
        })
      };
    }
    if (Object.assign(__vite_import_meta_env__$1, { OS: "Windows_NT", Path: "C:\\Users\\sabido\\electrician_website\\node_modules\\.bin;C:\\Users\\sabido\\node_modules\\.bin;C:\\Users\\node_modules\\.bin;C:\\node_modules\\.bin;C:\\Users\\sabido\\scoop\\persist\\nvs\\nodejs\\node\\22.22.1\\x64\\node_modules\\npm\\node_modules\\@npmcli\\run-script\\lib\\node-gyp-bin;C:\\WINDOWS\\system32;C:\\WINDOWS;C:\\WINDOWS\\System32\\Wbem;C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\;C:\\WINDOWS\\System32\\OpenSSH\\;C:\\Program Files\\NVIDIA Corporation\\NVIDIA App\\NvDLISR;C:\\Program Files (x86)\\NVIDIA Corporation\\PhysX\\Common;c:\\Users\\sabido\\AppData\\Local\\Programs\\cursor\\resources\\app\\codeBin;C:\\Users\\sabido\\scoop\\apps\\nvs\\current;C:\\Users\\sabido\\scoop\\apps\\git\\current\\cmd;C:\\Users\\sabido\\scoop\\shims;C:\\Users\\sabido\\AppData\\Local\\Microsoft\\WindowsApps;C:\\Users\\sabido\\AppData\\Local\\Programs\\Microsoft VS Code\\bin;C:\\Users\\sabido\\AppData\\Local\\Programs\\Kiro\\bin;C:\\Users\\sabido\\scoop\\apps\\nvs\\current\\nodejs\\default;C:\\Users\\sabido\\.bun\\bin;C:\\Users\\sabido\\AppData\\Local\\PowerToys\\DSCModules\\;C:\\Users\\sabido\\AppData\\Local\\Programs\\cursor\\resources\\app\\bin;C:\\Users\\sabido\\AppData\\Local\\Programs\\Antigravity IDE\\bin" })?.PROD) {
      return { error: ActionError.fromJson(json), data: void 0 };
    } else {
      const error = ActionError.fromJson(json);
      error.stack = actionResultErrorStack.get();
      return {
        error,
        data: void 0
      };
    }
  }
  if (res.type === "empty") {
    return { data: void 0, error: void 0 };
  }
  return {
    data: parse$1(res.body, {
      URL: (href) => new URL(href)
    }),
    error: void 0
  };
}
const actionResultErrorStack = /* @__PURE__ */ (function actionResultErrorStackFn() {
  let errorStack;
  return {
    set(stack) {
      errorStack = stack;
    },
    get() {
      return errorStack;
    }
  };
})();
function getActionQueryString(name) {
  const searchParams = new URLSearchParams({ [ACTION_QUERY_PARAMS.actionName]: name });
  return `?${searchParams.toString()}`;
}

async function readBodyWithLimit(request, limit) {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number.parseInt(contentLengthHeader, 10);
    if (Number.isFinite(contentLength) && contentLength > limit) {
      throw new BodySizeLimitError(limit);
    }
  }
  if (!request.body) return new Uint8Array();
  const reader = request.body.getReader();
  const chunks = [];
  let received = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) {
      received += value.byteLength;
      if (received > limit) {
        throw new BodySizeLimitError(limit);
      }
      chunks.push(value);
    }
  }
  const buffer = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return buffer;
}
class BodySizeLimitError extends Error {
  limit;
  constructor(limit) {
    super(`Request body exceeds the configured limit of ${limit} bytes`);
    this.name = "BodySizeLimitError";
    this.limit = limit;
  }
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": undefined, "SSR": true};
function getActionContext(context) {
  const callerInfo = getCallerInfo(context);
  const actionResultAlreadySet = Boolean(context.locals._actionPayload);
  let action = void 0;
  if (callerInfo && context.request.method === "POST" && !actionResultAlreadySet) {
    action = {
      calledFrom: callerInfo.from,
      name: callerInfo.name,
      handler: async () => {
        const pipeline = Reflect.get(context, pipelineSymbol);
        const callerInfoName = shouldAppendForwardSlash(
          pipeline.manifest.trailingSlash,
          pipeline.manifest.buildFormat
        ) ? removeTrailingForwardSlash(callerInfo.name) : callerInfo.name;
        let baseAction;
        try {
          baseAction = await pipeline.getAction(callerInfoName);
        } catch (error) {
          if (error instanceof Error && "name" in error && typeof error.name === "string" && error.name === ActionNotFoundError.name) {
            return { data: void 0, error: new ActionError({ code: "NOT_FOUND" }) };
          }
          throw error;
        }
        const bodySizeLimit = pipeline.manifest.actionBodySizeLimit;
        let input;
        try {
          input = await parseRequestBody(context.request, bodySizeLimit);
        } catch (e) {
          if (e instanceof ActionError) {
            return { data: void 0, error: e };
          }
          if (e instanceof TypeError) {
            return { data: void 0, error: new ActionError({ code: "UNSUPPORTED_MEDIA_TYPE" }) };
          }
          throw e;
        }
        const omitKeys = ["props", "getActionResult", "callAction", "redirect"];
        const actionAPIContext = Object.create(
          Object.getPrototypeOf(context),
          Object.fromEntries(
            Object.entries(Object.getOwnPropertyDescriptors(context)).filter(
              ([key]) => !omitKeys.includes(key)
            )
          )
        );
        Reflect.set(actionAPIContext, ACTION_API_CONTEXT_SYMBOL, true);
        const handler = baseAction.bind(actionAPIContext);
        return handler(input);
      }
    };
  }
  function setActionResult(actionName, actionResult) {
    context.locals._actionPayload = {
      actionResult,
      actionName
    };
  }
  return {
    action,
    setActionResult,
    serializeActionResult,
    deserializeActionResult
  };
}
function getCallerInfo(ctx) {
  if (ctx.routePattern === ACTION_RPC_ROUTE_PATTERN) {
    return { from: "rpc", name: ctx.url.pathname.replace(/^.*\/_actions\//, "") };
  }
  const queryParam = ctx.url.searchParams.get(ACTION_QUERY_PARAMS.actionName);
  if (queryParam) {
    return { from: "form", name: queryParam };
  }
  return void 0;
}
async function parseRequestBody(request, bodySizeLimit) {
  const contentType = request.headers.get("content-type");
  const contentLengthHeader = request.headers.get("content-length");
  const contentLength = contentLengthHeader ? Number.parseInt(contentLengthHeader, 10) : void 0;
  const hasContentLength = typeof contentLength === "number" && Number.isFinite(contentLength);
  if (!contentType) return void 0;
  if (hasContentLength && contentLength > bodySizeLimit) {
    throw new ActionError({
      code: "CONTENT_TOO_LARGE",
      message: `Request body exceeds ${bodySizeLimit} bytes`
    });
  }
  try {
    if (hasContentType(contentType, formContentTypes)) {
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        const formRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: toArrayBuffer(body)
        });
        return await formRequest.formData();
      }
      return await request.clone().formData();
    }
    if (hasContentType(contentType, ["application/json"])) {
      if (contentLength === 0) return void 0;
      if (!hasContentLength) {
        const body = await readBodyWithLimit(request.clone(), bodySizeLimit);
        if (body.byteLength === 0) return void 0;
        return JSON.parse(new TextDecoder().decode(body));
      }
      return await request.clone().json();
    }
  } catch (e) {
    if (e instanceof BodySizeLimitError) {
      throw new ActionError({
        code: "CONTENT_TOO_LARGE",
        message: `Request body exceeds ${bodySizeLimit} bytes`
      });
    }
    throw e;
  }
  throw new TypeError("Unsupported content type");
}
const ACTION_API_CONTEXT_SYMBOL = /* @__PURE__ */ Symbol.for("astro.actionAPIContext");
const formContentTypes = ["application/x-www-form-urlencoded", "multipart/form-data"];
function hasContentType(contentType, expected) {
  const type = contentType.split(";")[0].toLowerCase();
  return expected.some((t) => type === t);
}
function serializeActionResult(res) {
  if (res.error) {
    if (Object.assign(__vite_import_meta_env__, { OS: "Windows_NT" })?.DEV) {
      actionResultErrorStack.set(res.error.stack);
    }
    let body2;
    if (res.error instanceof ActionInputError) {
      body2 = {
        type: res.error.type,
        issues: res.error.issues,
        fields: res.error.fields
      };
    } else {
      body2 = {
        ...res.error,
        message: res.error.message
      };
    }
    return {
      type: "error",
      status: res.error.status,
      contentType: "application/json",
      body: JSON.stringify(body2)
    };
  }
  if (res.data === void 0) {
    return {
      type: "empty",
      status: 204
    };
  }
  let body;
  try {
    body = stringify$1(res.data, {
      // Add support for URL objects
      URL: (value) => value instanceof URL && value.href
    });
  } catch (e) {
    let hint = ActionsReturnedInvalidDataError.hint;
    if (res.data instanceof Response) {
      hint = REDIRECT_STATUS_CODES.includes(res.data.status) ? "If you need to redirect when the action succeeds, trigger a redirect where the action is called. See the Actions guide for server and client redirect examples: https://docs.astro.build/en/guides/actions." : "If you need to return a Response object, try using a server endpoint instead. See https://docs.astro.build/en/guides/endpoints/#server-endpoints-api-routes";
    }
    throw new AstroError({
      ...ActionsReturnedInvalidDataError,
      message: ActionsReturnedInvalidDataError.message(String(e)),
      hint
    });
  }
  return {
    type: "data",
    status: 200,
    contentType: "application/json+devalue",
    body
  };
}
function toArrayBuffer(buffer) {
  const copy = new Uint8Array(buffer.byteLength);
  copy.set(buffer);
  return copy.buffer;
}

function hasActionPayload(locals) {
  return "_actionPayload" in locals;
}
function createGetActionResult(locals) {
  return (actionFn) => {
    if (!hasActionPayload(locals) || actionFn.toString() !== getActionQueryString(locals._actionPayload.actionName)) {
      return void 0;
    }
    return deserializeActionResult(locals._actionPayload.actionResult);
  };
}
function createCallAction(context) {
  return (baseAction, input) => {
    Reflect.set(context, ACTION_API_CONTEXT_SYMBOL, true);
    const action = baseAction.bind(context);
    return action(input);
  };
}

function parseLocale(header) {
  if (header === "*") {
    return [{ locale: header, qualityValue: void 0 }];
  }
  const result = [];
  const localeValues = header.split(",").map((str) => str.trim());
  for (const localeValue of localeValues) {
    const split = localeValue.split(";").map((str) => str.trim());
    const localeName = split[0];
    const qualityValue = split[1];
    if (!split) {
      continue;
    }
    if (qualityValue && qualityValue.startsWith("q=")) {
      const qualityValueAsFloat = Number.parseFloat(qualityValue.slice("q=".length));
      if (Number.isNaN(qualityValueAsFloat) || qualityValueAsFloat > 1) {
        result.push({
          locale: localeName,
          qualityValue: void 0
        });
      } else {
        result.push({
          locale: localeName,
          qualityValue: qualityValueAsFloat
        });
      }
    } else {
      result.push({
        locale: localeName,
        qualityValue: void 0
      });
    }
  }
  return result;
}
function sortAndFilterLocales(browserLocaleList, locales) {
  const normalizedLocales = getAllCodes(locales).map(normalizeTheLocale);
  return browserLocaleList.filter((browserLocale) => {
    if (browserLocale.locale !== "*") {
      return normalizedLocales.includes(normalizeTheLocale(browserLocale.locale));
    }
    return true;
  }).sort((a, b) => {
    if (a.qualityValue && b.qualityValue) {
      return Math.sign(b.qualityValue - a.qualityValue);
    }
    return 0;
  });
}
function computePreferredLocale(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = void 0;
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    const firstResult = browserLocaleList.at(0);
    if (firstResult && firstResult.locale !== "*") {
      for (const currentLocale of locales) {
        if (typeof currentLocale === "string") {
          if (normalizeTheLocale(currentLocale) === normalizeTheLocale(firstResult.locale)) {
            result = currentLocale;
            break;
          }
        } else {
          for (const currentCode of currentLocale.codes) {
            if (normalizeTheLocale(currentCode) === normalizeTheLocale(firstResult.locale)) {
              result = currentCode;
              break;
            }
          }
        }
      }
    }
  }
  return result;
}
function computePreferredLocaleList(request, locales) {
  const acceptHeader = request.headers.get("Accept-Language");
  let result = [];
  if (acceptHeader) {
    const browserLocaleList = sortAndFilterLocales(parseLocale(acceptHeader), locales);
    if (browserLocaleList.length === 1 && browserLocaleList.at(0).locale === "*") {
      return getAllCodes(locales);
    } else if (browserLocaleList.length > 0) {
      for (const browserLocale of browserLocaleList) {
        for (const loopLocale of locales) {
          if (typeof loopLocale === "string") {
            if (normalizeTheLocale(loopLocale) === normalizeTheLocale(browserLocale.locale)) {
              result.push(loopLocale);
            }
          } else {
            for (const code of loopLocale.codes) {
              if (code === browserLocale.locale) {
                result.push(code);
              }
            }
          }
        }
      }
    }
  }
  return result;
}
function computeCurrentLocale(pathname, locales, defaultLocale) {
  for (const segment of pathname.split("/").map(normalizeThePath)) {
    for (const locale of locales) {
      if (typeof locale === "string") {
        if (!segment.includes(locale)) continue;
        if (normalizeTheLocale(locale) === normalizeTheLocale(segment)) {
          return locale;
        }
      } else {
        if (locale.path === segment) {
          return locale.codes.at(0);
        } else {
          for (const code of locale.codes) {
            if (normalizeTheLocale(code) === normalizeTheLocale(segment)) {
              return code;
            }
          }
        }
      }
    }
  }
  for (const locale of locales) {
    if (typeof locale === "string") {
      if (locale === defaultLocale) {
        return locale;
      }
    } else {
      if (locale.path === defaultLocale) {
        return locale.codes.at(0);
      }
    }
  }
}
function computeCurrentLocaleFromParams(params, locales) {
  const byNormalizedCode = /* @__PURE__ */ new Map();
  const byPath = /* @__PURE__ */ new Map();
  for (const locale of locales) {
    if (typeof locale === "string") {
      byNormalizedCode.set(normalizeTheLocale(locale), locale);
    } else {
      byPath.set(locale.path, locale.codes[0]);
      for (const code of locale.codes) {
        byNormalizedCode.set(normalizeTheLocale(code), code);
      }
    }
  }
  for (const value of Object.values(params)) {
    if (!value) continue;
    const pathMatch = byPath.get(value);
    if (pathMatch) return pathMatch;
    const codeMatch = byNormalizedCode.get(normalizeTheLocale(value));
    if (codeMatch) return codeMatch;
  }
}

async function renderEndpoint(mod, context, isPrerendered, logger) {
  const { request, url } = context;
  const method = request.method.toUpperCase();
  let handler = mod[method] ?? mod["ALL"];
  if (!handler && method === "HEAD" && mod["GET"]) {
    handler = mod["GET"];
  }
  if (isPrerendered && !["GET", "HEAD"].includes(method)) {
    logger.warn(
      "router",
      `${url.pathname} ${colors.bold(
        method
      )} requests are not available in static endpoints. Mark this page as server-rendered (\`export const prerender = false;\`) or update your config to \`output: 'server'\` to make all your pages server-rendered by default.`
    );
  }
  if (handler === void 0) {
    logger.warn(
      "router",
      `No API Route handler exists for the method "${method}" for the route "${url.pathname}".
Found handlers: ${Object.keys(mod).map((exp) => JSON.stringify(exp)).join(", ")}
` + ("all" in mod ? `One of the exported handlers is "all" (lowercase), did you mean to export 'ALL'?
` : "")
    );
    return new Response(null, { status: 404 });
  }
  if (typeof handler !== "function") {
    logger.error(
      "router",
      `The route "${url.pathname}" exports a value for the method "${method}", but it is of the type ${typeof handler} instead of a function.`
    );
    return new Response(null, { status: 500 });
  }
  let response = await handler.call(mod, context);
  if (!response || response instanceof Response === false) {
    throw new AstroError(EndpointDidNotReturnAResponse);
  }
  if (REROUTABLE_STATUS_CODES.includes(response.status)) {
    try {
      response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
    } catch (err) {
      if (err.message?.includes("immutable")) {
        response = new Response(response.body, response);
        response.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
      } else {
        throw err;
      }
    }
  }
  if (method === "HEAD") {
    return new Response(null, response);
  }
  return response;
}

const AstroJSX = "astro:jsx";
function isVNode(vnode) {
  return vnode && typeof vnode === "object" && vnode[AstroJSX];
}

function isAstroComponentFactory(obj) {
  return obj == null ? false : obj.isAstroComponentFactory === true;
}
function isAPropagatingComponent(result, factory) {
  return isPropagatingHint(getPropagationHint(result, factory));
}
function getPropagationHint(result, factory) {
  return getPropagationHint$1(result, factory);
}

const PROP_TYPE = {
  Value: 0,
  JSON: 1,
  // Actually means Array
  RegExp: 2,
  Date: 3,
  Map: 4,
  Set: 5,
  BigInt: 6,
  URL: 7,
  Uint8Array: 8,
  Uint16Array: 9,
  Uint32Array: 10,
  Infinity: 11
};
function serializeArray(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = value.map((v) => {
    return convertToSerializedForm(v, metadata, parents);
  });
  parents.delete(value);
  return serialized;
}
function serializeObject(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  if (parents.has(value)) {
    throw new Error(`Cyclic reference detected while serializing props for <${metadata.displayName} client:${metadata.hydrate}>!

Cyclic references cannot be safely serialized for client-side usage. Please remove the cyclic reference.`);
  }
  parents.add(value);
  const serialized = Object.fromEntries(
    Object.entries(value).map(([k, v]) => {
      return [k, convertToSerializedForm(v, metadata, parents)];
    })
  );
  parents.delete(value);
  return serialized;
}
function convertToSerializedForm(value, metadata = {}, parents = /* @__PURE__ */ new WeakSet()) {
  const tag = Object.prototype.toString.call(value);
  switch (tag) {
    case "[object Date]": {
      return [PROP_TYPE.Date, value.toISOString()];
    }
    case "[object RegExp]": {
      return [PROP_TYPE.RegExp, value.source];
    }
    case "[object Map]": {
      return [PROP_TYPE.Map, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object Set]": {
      return [PROP_TYPE.Set, serializeArray(Array.from(value), metadata, parents)];
    }
    case "[object BigInt]": {
      return [PROP_TYPE.BigInt, value.toString()];
    }
    case "[object URL]": {
      return [PROP_TYPE.URL, value.toString()];
    }
    case "[object Array]": {
      return [PROP_TYPE.JSON, serializeArray(value, metadata, parents)];
    }
    case "[object Uint8Array]": {
      return [PROP_TYPE.Uint8Array, Array.from(value)];
    }
    case "[object Uint16Array]": {
      return [PROP_TYPE.Uint16Array, Array.from(value)];
    }
    case "[object Uint32Array]": {
      return [PROP_TYPE.Uint32Array, Array.from(value)];
    }
    default: {
      if (value !== null && typeof value === "object") {
        return [PROP_TYPE.Value, serializeObject(value, metadata, parents)];
      }
      if (value === Number.POSITIVE_INFINITY) {
        return [PROP_TYPE.Infinity, 1];
      }
      if (value === Number.NEGATIVE_INFINITY) {
        return [PROP_TYPE.Infinity, -1];
      }
      if (value === void 0) {
        return [PROP_TYPE.Value];
      }
      return [PROP_TYPE.Value, value];
    }
  }
}
function serializeProps(props, metadata) {
  const serialized = JSON.stringify(serializeObject(props, metadata));
  return serialized;
}

const transitionDirectivesToCopyOnIsland = Object.freeze([
  "data-astro-transition-scope",
  "data-astro-transition-persist",
  "data-astro-transition-persist-props"
]);
function extractDirectives(inputProps, clientDirectives) {
  let extracted = {
    isPage: false,
    hydration: null,
    props: {},
    propsWithoutTransitionAttributes: {}
  };
  for (const [key, value] of Object.entries(inputProps)) {
    if (key.startsWith("server:")) {
      if (key === "server:root") {
        extracted.isPage = true;
      }
    }
    if (key.startsWith("client:")) {
      if (!extracted.hydration) {
        extracted.hydration = {
          directive: "",
          value: "",
          componentUrl: "",
          componentExport: { value: "" }
        };
      }
      switch (key) {
        case "client:component-path": {
          extracted.hydration.componentUrl = value;
          break;
        }
        case "client:component-export": {
          extracted.hydration.componentExport.value = value;
          break;
        }
        // This is a special prop added to prove that the client hydration method
        // was added statically.
        case "client:component-hydration": {
          break;
        }
        case "client:display-name": {
          break;
        }
        default: {
          extracted.hydration.directive = key.split(":")[1];
          extracted.hydration.value = value;
          if (!clientDirectives.has(extracted.hydration.directive)) {
            const hydrationMethods = Array.from(clientDirectives.keys()).map((d) => `client:${d}`).join(", ");
            throw new Error(
              `Error: invalid hydration directive "${key}". Supported hydration methods: ${hydrationMethods}`
            );
          }
          if (extracted.hydration.directive === "media" && typeof extracted.hydration.value !== "string") {
            throw new AstroError(MissingMediaQueryDirective);
          }
          break;
        }
      }
    } else {
      extracted.props[key] = value;
      if (!transitionDirectivesToCopyOnIsland.includes(key)) {
        extracted.propsWithoutTransitionAttributes[key] = value;
      }
    }
  }
  for (const sym of Object.getOwnPropertySymbols(inputProps)) {
    extracted.props[sym] = inputProps[sym];
    extracted.propsWithoutTransitionAttributes[sym] = inputProps[sym];
  }
  return extracted;
}
async function generateHydrateScript(scriptOptions, metadata) {
  const { renderer, result, astroId, props, attrs } = scriptOptions;
  const { hydrate, componentUrl, componentExport } = metadata;
  if (!componentExport.value) {
    throw new AstroError({
      ...NoMatchingImport,
      message: NoMatchingImport.message(metadata.displayName)
    });
  }
  const island = {
    children: "",
    props: {
      // This is for HMR, probably can avoid it in prod
      uid: astroId
    }
  };
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      island.props[key] = escapeHTML(value);
    }
  }
  island.props["component-url"] = await result.resolve(decodeURI(componentUrl));
  if (renderer.clientEntrypoint) {
    island.props["component-export"] = componentExport.value;
    island.props["renderer-url"] = await result.resolve(
      decodeURI(renderer.clientEntrypoint.toString())
    );
    island.props["props"] = escapeHTML(serializeProps(props, metadata));
  }
  island.props["ssr"] = "";
  island.props["client"] = hydrate;
  let beforeHydrationUrl = await result.resolve("astro:scripts/before-hydration.js");
  if (beforeHydrationUrl.length) {
    island.props["before-hydration-url"] = beforeHydrationUrl;
  }
  island.props["opts"] = escapeHTML(
    JSON.stringify({
      name: metadata.displayName,
      value: metadata.hydrateArgs || ""
    })
  );
  transitionDirectivesToCopyOnIsland.forEach((name) => {
    if (typeof props[name] !== "undefined") {
      island.props[name] = props[name];
    }
  });
  return island;
}

/**
 * shortdash - https://github.com/bibig/node-shorthash
 *
 * @license
 *
 * (The MIT License)
 *
 * Copyright (c) 2013 Bibig <bibig@me.com>
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
const dictionary = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY";
const binary = dictionary.length;
function bitwise(str) {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    hash = (hash << 5) - hash + ch;
    hash = hash & hash;
  }
  return hash;
}
function shorthash(text) {
  let num;
  let result = "";
  let integer = bitwise(text);
  const sign = integer < 0 ? "Z" : "";
  integer = Math.abs(integer);
  while (integer >= binary) {
    num = integer % binary;
    integer = Math.floor(integer / binary);
    result = dictionary[num] + result;
  }
  if (integer > 0) {
    result = dictionary[integer] + result;
  }
  return sign + result;
}

const DOCTYPE_EXP = /<!doctype html/i;
async function renderToString(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let str = "";
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          str += doctype;
        }
      }
      if (chunk instanceof Response) return;
      str += chunkToString(result, chunk);
    }
  };
  await templateResult.render(destination);
  return str;
}
async function renderToReadableStream(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  return new ReadableStream({
    start(controller) {
      const destination = {
        write(chunk) {
          if (isPage && !renderedFirstPageChunk) {
            renderedFirstPageChunk = true;
            if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              controller.enqueue(encoder.encode(doctype));
            }
          }
          if (chunk instanceof Response) {
            throw new AstroError({
              ...ResponseSentError
            });
          }
          const bytes = chunkToByteArray(result, chunk);
          controller.enqueue(bytes);
        }
      };
      (async () => {
        try {
          await templateResult.render(destination);
          controller.close();
        } catch (e) {
          if (AstroError.is(e) && !e.loc) {
            e.setLocation({
              file: route?.component
            });
          }
          setTimeout(() => controller.error(e), 0);
        }
      })();
    },
    cancel() {
      result.cancelled = true;
    }
  });
}
async function callComponentAsTemplateResultOrResponse(result, componentFactory, props, children, route) {
  const factoryResult = await componentFactory(result, props, children);
  if (factoryResult instanceof Response) {
    return factoryResult;
  } else if (isHeadAndContent(factoryResult)) {
    if (!isRenderTemplateResult(factoryResult.content)) {
      throw new AstroError({
        ...OnlyResponseCanBeReturned,
        message: OnlyResponseCanBeReturned.message(
          route?.route,
          typeof factoryResult
        ),
        location: {
          file: route?.component
        }
      });
    }
    return factoryResult.content;
  } else if (!isRenderTemplateResult(factoryResult)) {
    throw new AstroError({
      ...OnlyResponseCanBeReturned,
      message: OnlyResponseCanBeReturned.message(route?.route, typeof factoryResult),
      location: {
        file: route?.component
      }
    });
  }
  return factoryResult;
}
async function bufferHeadContent(result) {
  await bufferPropagatedHead(result);
}
async function renderToAsyncIterable(result, componentFactory, props, children, isPage = false, route) {
  const templateResult = await callComponentAsTemplateResultOrResponse(
    result,
    componentFactory,
    props,
    children,
    route
  );
  if (templateResult instanceof Response) return templateResult;
  let renderedFirstPageChunk = false;
  if (isPage) {
    await bufferHeadContent(result);
  }
  let error = null;
  let next = null;
  const buffer = [];
  let renderingComplete = false;
  const iterator = {
    async next() {
      if (result.cancelled) return { done: true, value: void 0 };
      if (next !== null) {
        await next.promise;
      } else if (!renderingComplete && !buffer.length) {
        next = promiseWithResolvers();
        await next.promise;
      }
      if (!renderingComplete) {
        next = promiseWithResolvers();
      }
      if (error) {
        throw error;
      }
      let length = 0;
      let stringToEncode = "";
      for (let i = 0, len = buffer.length; i < len; i++) {
        const bufferEntry = buffer[i];
        if (typeof bufferEntry === "string") {
          const nextIsString = i + 1 < len && typeof buffer[i + 1] === "string";
          stringToEncode += bufferEntry;
          if (!nextIsString) {
            const encoded = encoder.encode(stringToEncode);
            length += encoded.length;
            stringToEncode = "";
            buffer[i] = encoded;
          } else {
            buffer[i] = "";
          }
        } else {
          length += bufferEntry.length;
        }
      }
      let mergedArray = new Uint8Array(length);
      let offset = 0;
      for (let i = 0, len = buffer.length; i < len; i++) {
        const item = buffer[i];
        if (item === "") {
          continue;
        }
        mergedArray.set(item, offset);
        offset += item.length;
      }
      buffer.length = 0;
      const returnValue = {
        // The iterator is done when rendering has finished
        // and there are no more chunks to return.
        done: length === 0 && renderingComplete,
        value: mergedArray
      };
      return returnValue;
    },
    async return() {
      result.cancelled = true;
      return { done: true, value: void 0 };
    }
  };
  const destination = {
    write(chunk) {
      if (isPage && !renderedFirstPageChunk) {
        renderedFirstPageChunk = true;
        if (!result.partial && !DOCTYPE_EXP.test(String(chunk))) {
          const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
          buffer.push(encoder.encode(doctype));
        }
      }
      if (chunk instanceof Response) {
        throw new AstroError(ResponseSentError);
      }
      const bytes = chunkToByteArrayOrString(result, chunk);
      if (bytes.length > 0) {
        buffer.push(bytes);
        next?.resolve();
      } else if (buffer.length > 0) {
        next?.resolve();
      }
    }
  };
  const renderResult = toPromise(() => templateResult.render(destination));
  renderResult.catch((err) => {
    error = err;
  }).finally(() => {
    renderingComplete = true;
    next?.resolve();
  });
  return {
    [Symbol.asyncIterator]() {
      return iterator;
    }
  };
}
function toPromise(fn) {
  try {
    const result = fn();
    return isPromise(result) ? result : Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
}

function componentIsHTMLElement(Component) {
  return typeof HTMLElement !== "undefined" && HTMLElement.isPrototypeOf(Component);
}
async function renderHTMLElement$1(result, constructor, props, slots) {
  const name = getHTMLElementName(constructor);
  let attrHTML = "";
  for (const attr in props) {
    attrHTML += ` ${attr}="${toAttributeString(await props[attr])}"`;
  }
  return markHTMLString(
    `<${name}${attrHTML}>${await renderSlotToString(result, slots?.default)}</${name}>`
  );
}
function getHTMLElementName(constructor) {
  const definedName = customElements.getName(constructor);
  if (definedName) return definedName;
  const assignedName = constructor.name.replace(/^HTML|Element$/g, "").replace(/[A-Z]/g, "-$&").toLowerCase().replace(/^-/, "html-");
  return assignedName;
}

const needsHeadRenderingSymbol = /* @__PURE__ */ Symbol.for("astro.needsHeadRendering");
const rendererAliases = /* @__PURE__ */ new Map([["solid", "solid-js"]]);
const clientOnlyValues = /* @__PURE__ */ new Set(["solid-js", "react", "preact", "vue", "svelte"]);
function guessRenderers(componentUrl) {
  const extname = componentUrl?.split(".").pop();
  switch (extname) {
    case "svelte":
      return ["@astrojs/svelte"];
    case "vue":
      return ["@astrojs/vue"];
    case "jsx":
    case "tsx":
      return ["@astrojs/react", "@astrojs/preact", "@astrojs/solid-js", "@astrojs/vue (jsx)"];
    case void 0:
    default:
      return [
        "@astrojs/react",
        "@astrojs/preact",
        "@astrojs/solid-js",
        "@astrojs/vue",
        "@astrojs/svelte"
      ];
  }
}
function isFragmentComponent(Component) {
  return Component === Fragment;
}
function isHTMLComponent(Component) {
  return Component && Component["astro:html"] === true;
}
const ASTRO_SLOT_EXP = /<\/?astro-slot\b[^>]*>/g;
const ASTRO_STATIC_SLOT_EXP = /<\/?astro-static-slot\b[^>]*>/g;
function removeStaticAstroSlot(html, supportsAstroStaticSlot = true) {
  const exp = supportsAstroStaticSlot ? ASTRO_STATIC_SLOT_EXP : ASTRO_SLOT_EXP;
  return html.replace(exp, "");
}
async function renderFrameworkComponent(result, displayName, Component, _props, slots = {}) {
  if (!Component && "client:only" in _props === false) {
    throw new Error(
      `Unable to render ${displayName} because it is ${Component}!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  const { renderers, clientDirectives } = result;
  const metadata = {
    astroStaticSlot: true,
    displayName
  };
  const { hydration, isPage, props, propsWithoutTransitionAttributes } = extractDirectives(
    _props,
    clientDirectives
  );
  let html = "";
  let attrs = void 0;
  if (hydration) {
    metadata.hydrate = hydration.directive;
    metadata.hydrateArgs = hydration.value;
    metadata.componentExport = hydration.componentExport;
    metadata.componentUrl = hydration.componentUrl;
  }
  const probableRendererNames = guessRenderers(metadata.componentUrl);
  const validRenderers = renderers.filter((r) => r.name !== "astro:jsx");
  const { children, slotInstructions } = await renderSlots(result, slots);
  let renderer;
  if (metadata.hydrate !== "only") {
    let isTagged = false;
    try {
      isTagged = Component && Component[Renderer];
    } catch {
    }
    if (isTagged) {
      const rendererName = Component[Renderer];
      renderer = renderers.find(({ name }) => name === rendererName);
    }
    if (!renderer) {
      let error;
      for (const r of renderers) {
        try {
          if (await r.ssr.check.call({ result }, Component, props, children, metadata)) {
            renderer = r;
            break;
          }
        } catch (e) {
          error ??= e;
        }
      }
      if (!renderer && error) {
        throw error;
      }
    }
    if (!renderer && typeof HTMLElement === "function" && componentIsHTMLElement(Component)) {
      const output = await renderHTMLElement$1(
        result,
        Component,
        _props,
        slots
      );
      return {
        render(destination) {
          destination.write(output);
        }
      };
    }
  } else {
    if (metadata.hydrateArgs) {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        renderer = renderers.find(
          ({ name }) => name === `@astrojs/${rendererName}` || name === rendererName
        );
      }
    }
    if (!renderer && validRenderers.length === 1) {
      renderer = validRenderers[0];
    }
    if (!renderer) {
      const extname = metadata.componentUrl?.split(".").pop();
      renderer = renderers.find(({ name }) => name === `@astrojs/${extname}` || name === extname);
    }
    if (!renderer && metadata.hydrateArgs) {
      const rendererName = metadata.hydrateArgs;
      if (typeof rendererName === "string") {
        renderer = renderers.find(({ name }) => name === rendererName);
      }
    }
  }
  let componentServerRenderEndTime;
  if (!renderer) {
    if (metadata.hydrate === "only") {
      const rendererName = rendererAliases.has(metadata.hydrateArgs) ? rendererAliases.get(metadata.hydrateArgs) : metadata.hydrateArgs;
      if (clientOnlyValues.has(rendererName)) {
        const plural = validRenderers.length > 1;
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else {
        throw new AstroError({
          ...NoClientOnlyHint,
          message: NoClientOnlyHint.message(metadata.displayName),
          hint: NoClientOnlyHint.hint(
            probableRendererNames.map((r) => r.replace("@astrojs/", "")).join("|")
          )
        });
      }
    } else if (typeof Component !== "string") {
      const matchingRenderers = validRenderers.filter(
        (r) => probableRendererNames.includes(r.name)
      );
      const plural = validRenderers.length > 1;
      if (matchingRenderers.length === 0) {
        throw new AstroError({
          ...NoMatchingRenderer,
          message: NoMatchingRenderer.message(
            metadata.displayName,
            metadata?.componentUrl?.split(".").pop(),
            plural,
            validRenderers.length
          ),
          hint: NoMatchingRenderer.hint(
            formatList(probableRendererNames.map((r) => "`" + r + "`"))
          )
        });
      } else if (matchingRenderers.length === 1) {
        renderer = matchingRenderers[0];
        ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
          { result },
          Component,
          propsWithoutTransitionAttributes,
          children,
          metadata
        ));
      } else {
        throw new Error(`Unable to render ${metadata.displayName}!

This component likely uses ${formatList(probableRendererNames)},
but Astro encountered an error during server-side rendering.

Please ensure that ${metadata.displayName}:
1. Does not unconditionally access browser-specific globals like \`window\` or \`document\`.
   If this is unavoidable, use the \`client:only\` hydration directive.
2. Does not conditionally return \`null\` or \`undefined\` when rendered on the server.
3. If using multiple JSX frameworks at the same time (e.g. React + Preact), pass the correct \`include\`/\`exclude\` options to integrations.

If you're still stuck, please open an issue on GitHub or join us at https://astro.build/chat.`);
      }
    }
  } else {
    if (metadata.hydrate === "only") {
      html = await renderSlotToString(result, slots?.fallback);
    } else {
      const componentRenderStartTime = performance.now();
      ({ html, attrs } = await renderer.ssr.renderToStaticMarkup.call(
        { result },
        Component,
        propsWithoutTransitionAttributes,
        children,
        metadata
      ));
      if (process.env.NODE_ENV === "development")
        componentServerRenderEndTime = performance.now() - componentRenderStartTime;
    }
  }
  if (!html && typeof Component === "string") {
    const Tag = sanitizeElementName(Component);
    const childSlots = Object.values(children).join("");
    const renderTemplateResult = renderTemplate`<${Tag}${internalSpreadAttributes(
      props,
      true,
      Tag
    )}${markHTMLString(
      childSlots === "" && voidElementNames.test(Tag) ? `/>` : `>${childSlots}</${Tag}>`
    )}`;
    html = "";
    const destination = {
      write(chunk) {
        if (chunk instanceof Response) return;
        html += chunkToString(result, chunk);
      }
    };
    await renderTemplateResult.render(destination);
  }
  if (!hydration) {
    return {
      render(destination) {
        if (slotInstructions) {
          for (const instruction of slotInstructions) {
            destination.write(instruction);
          }
        }
        if (isPage || renderer?.name === "astro:jsx") {
          destination.write(html);
        } else if (html && html.length > 0) {
          destination.write(
            markHTMLString(removeStaticAstroSlot(html, renderer?.ssr?.supportsAstroStaticSlot))
          );
        }
      }
    };
  }
  const astroId = shorthash(
    `<!--${metadata.componentExport.value}:${metadata.componentUrl}-->
${html}
${serializeProps(
      props,
      metadata
    )}`
  );
  const island = await generateHydrateScript(
    { renderer, result, astroId, props, attrs },
    metadata
  );
  if (componentServerRenderEndTime && process.env.NODE_ENV === "development")
    island.props["server-render-time"] = componentServerRenderEndTime;
  let unrenderedSlots = [];
  if (html) {
    if (Object.keys(children).length > 0) {
      for (const key of Object.keys(children)) {
        let tagName = renderer?.ssr?.supportsAstroStaticSlot ? !!metadata.hydrate ? "astro-slot" : "astro-static-slot" : "astro-slot";
        let expectedHTML = key === "default" ? `<${tagName}>` : `<${tagName} name="${key}">`;
        if (!html.includes(expectedHTML)) {
          unrenderedSlots.push(key);
        }
      }
    }
  } else {
    unrenderedSlots = Object.keys(children);
  }
  const template = unrenderedSlots.length > 0 ? unrenderedSlots.map(
    (key) => `<template data-astro-template${key !== "default" ? `="${key}"` : ""}>${children[key]}</template>`
  ).join("") : "";
  island.children = `${html ?? ""}${template}`;
  if (island.children) {
    island.props["await-children"] = "";
    island.children += `<!--astro:end-->`;
  }
  return {
    render(destination) {
      if (slotInstructions) {
        for (const instruction of slotInstructions) {
          destination.write(instruction);
        }
      }
      destination.write(createRenderInstruction({ type: "directive", hydration }));
      if (hydration.directive !== "only" && renderer?.ssr.renderHydrationScript) {
        destination.write(
          createRenderInstruction({
            type: "renderer-hydration-script",
            rendererName: renderer.name,
            render: renderer.ssr.renderHydrationScript
          })
        );
      }
      const renderedElement = renderElement$1("astro-island", island, false);
      destination.write(markHTMLString(renderedElement));
    }
  };
}
function sanitizeElementName(tag) {
  const unsafe = /[&<>'"\s]+/;
  if (!unsafe.test(tag)) return tag;
  return tag.trim().split(unsafe)[0].trim();
}
async function renderFragmentComponent(result, slots = {}) {
  const children = await renderSlotToString(result, slots?.default);
  return {
    render(destination) {
      if (children == null) return;
      destination.write(children);
    }
  };
}
async function renderHTMLComponent(result, Component, _props, slots = {}) {
  const { slotInstructions, children } = await renderSlots(result, slots);
  const html = Component({ slots: children });
  const hydrationHtml = slotInstructions ? slotInstructions.map((instr) => chunkToString(result, instr)).join("") : "";
  return {
    render(destination) {
      destination.write(markHTMLString(hydrationHtml + html));
    }
  };
}
function renderAstroComponent(result, displayName, Component, props, slots = {}) {
  if (containsServerDirective(props)) {
    const serverIslandComponent = new ServerIslandComponent(result, props, slots, displayName);
    result._metadata.propagators.add(serverIslandComponent);
    return serverIslandComponent;
  }
  const instance = createAstroComponentInstance(result, displayName, Component, props, slots);
  return {
    render(destination) {
      return instance.render(destination);
    }
  };
}
function renderComponent(result, displayName, Component, props, slots = {}) {
  if (isPromise(Component)) {
    return Component.catch(handleCancellation).then((x) => {
      return renderComponent(result, displayName, x, props, slots);
    });
  }
  if (isFragmentComponent(Component)) {
    return renderFragmentComponent(result, slots).catch(handleCancellation);
  }
  props = normalizeProps(props);
  if (isHTMLComponent(Component)) {
    return renderHTMLComponent(result, Component, props, slots).catch(handleCancellation);
  }
  if (isAstroComponentFactory(Component)) {
    return renderAstroComponent(result, displayName, Component, props, slots);
  }
  return renderFrameworkComponent(result, displayName, Component, props, slots).catch(
    handleCancellation
  );
  function handleCancellation(e) {
    if (result.cancelled)
      return {
        render() {
        }
      };
    throw e;
  }
}
function normalizeProps(props) {
  if (props["class:list"] !== void 0) {
    const value = props["class:list"];
    delete props["class:list"];
    props["class"] = clsx(props["class"], value);
    if (props["class"] === "") {
      delete props["class"];
    }
  }
  return props;
}
async function renderComponentToString(result, displayName, Component, props, slots = {}, isPage = false, route) {
  let str = "";
  let renderedFirstPageChunk = false;
  let head = "";
  if (isPage && !result.partial && nonAstroPageNeedsHeadInjection(Component)) {
    head += chunkToString(result, maybeRenderHead());
  }
  try {
    const destination = {
      write(chunk) {
        if (isPage && !result.partial && !renderedFirstPageChunk) {
          renderedFirstPageChunk = true;
          if (!/<!doctype html/i.test(String(chunk))) {
            const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
            str += doctype + head;
          }
        }
        if (chunk instanceof Response) return;
        str += chunkToString(result, chunk);
      }
    };
    const renderInstance = await renderComponent(result, displayName, Component, props, slots);
    if (containsServerDirective(props)) {
      await bufferHeadContent(result);
    }
    await renderInstance.render(destination);
  } catch (e) {
    if (AstroError.is(e) && !e.loc) {
      e.setLocation({
        file: route?.component
      });
    }
    throw e;
  }
  return str;
}
function nonAstroPageNeedsHeadInjection(pageComponent) {
  return !!pageComponent?.[needsHeadRenderingSymbol];
}

const ClientOnlyPlaceholder$1 = "astro-client-only";
const hasTriedRenderComponentSymbol = /* @__PURE__ */ Symbol("hasTriedRenderComponent");
async function renderJSX(result, vnode) {
  switch (true) {
    case vnode instanceof HTMLString:
      if (vnode.toString().trim() === "") {
        return "";
      }
      return vnode;
    case typeof vnode === "string":
      return markHTMLString(escapeHTML(vnode));
    case typeof vnode === "function":
      return vnode;
    case (!vnode && vnode !== 0):
      return "";
    case Array.isArray(vnode): {
      const renderedItems = await Promise.all(vnode.map((v) => renderJSX(result, v)));
      let instructions = null;
      let content = "";
      for (const item of renderedItems) {
        if (item instanceof SlotString) {
          content += item;
          instructions = mergeSlotInstructions(instructions, item);
        } else {
          content += item;
        }
      }
      if (instructions) {
        return markHTMLString(new SlotString(content, instructions));
      }
      return markHTMLString(content);
    }
  }
  return renderJSXVNode(result, vnode);
}
async function renderJSXVNode(result, vnode) {
  if (isVNode(vnode)) {
    switch (true) {
      case !vnode.type: {
        throw new Error(`Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`);
      }
      case vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment"):
        return renderJSX(result, vnode.props.children);
      case isAstroComponentFactory(vnode.type): {
        let props = {};
        let slots = {};
        for (const [key, value] of Object.entries(vnode.props ?? {})) {
          if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
            slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
          } else {
            props[key] = value;
          }
        }
        const str = await renderComponentToString(
          result,
          vnode.type.name,
          vnode.type,
          props,
          slots
        );
        const html = markHTMLString(str);
        return html;
      }
      case (!vnode.type && vnode.type !== 0):
        return "";
      case (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder$1):
        return markHTMLString(await renderElement(result, vnode.type, vnode.props ?? {}));
    }
    if (vnode.type) {
      let extractSlots2 = function(child) {
        if (Array.isArray(child)) {
          return child.map((c) => extractSlots2(c));
        }
        if (!isVNode(child)) {
          _slots.default.push(child);
          return;
        }
        if ("slot" in child.props) {
          _slots[child.props.slot] = [..._slots[child.props.slot] ?? [], child];
          delete child.props.slot;
          return;
        }
        _slots.default.push(child);
      };
      if (typeof vnode.type === "function" && vnode.props["server:root"]) {
        const output2 = await vnode.type(vnode.props ?? {});
        return await renderJSX(result, output2);
      }
      if (typeof vnode.type === "function") {
        if (vnode.props[hasTriedRenderComponentSymbol]) {
          delete vnode.props[hasTriedRenderComponentSymbol];
          const output2 = await vnode.type(vnode.props ?? {});
          if (output2?.[AstroJSX] || !output2) {
            return await renderJSXVNode(result, output2);
          } else {
            return;
          }
        } else {
          vnode.props[hasTriedRenderComponentSymbol] = true;
        }
      }
      const { children = null, ...props } = vnode.props ?? {};
      const _slots = {
        default: []
      };
      extractSlots2(children);
      for (const [key, value] of Object.entries(props)) {
        if (value?.["$$slot"]) {
          _slots[key] = value;
          delete props[key];
        }
      }
      const slotPromises = [];
      const slots = {};
      for (const [key, value] of Object.entries(_slots)) {
        slotPromises.push(
          renderJSX(result, value).then((output2) => {
            if (output2.toString().trim().length === 0) return;
            slots[key] = () => output2;
          })
        );
      }
      await Promise.all(slotPromises);
      let output;
      if (vnode.type === ClientOnlyPlaceholder$1 && vnode.props["client:only"]) {
        output = await renderComponentToString(
          result,
          vnode.props["client:display-name"] ?? "",
          null,
          props,
          slots
        );
      } else {
        output = await renderComponentToString(
          result,
          typeof vnode.type === "function" ? vnode.type.name : vnode.type,
          vnode.type,
          props,
          slots
        );
      }
      return markHTMLString(output);
    }
  }
  return markHTMLString(`${vnode}`);
}
async function renderElement(result, tag, { children, ...props }) {
  return markHTMLString(
    `<${tag}${spreadAttributes(props)}${markHTMLString(
      (children == null || children === "") && voidElementNames.test(tag) ? `/>` : `>${children == null ? "" : await renderJSX(result, prerenderElementChildren$1(tag, children))}</${tag}>`
    )}`
  );
}
function prerenderElementChildren$1(tag, children) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return markHTMLString(children);
  } else {
    return children;
  }
}

const ClientOnlyPlaceholder = "astro-client-only";
function renderJSXToQueue(vnode, result, queue, pool, stack, parent, metadata) {
  if (vnode instanceof HTMLString) {
    const html = vnode.toString();
    if (html.trim() === "") return;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "string") {
    const node = pool.acquire("text", vnode);
    node.content = vnode;
    queue.nodes.push(node);
    return;
  }
  if (typeof vnode === "number" || typeof vnode === "boolean") {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  if (vnode == null || vnode === false) {
    return;
  }
  if (Array.isArray(vnode)) {
    for (let i = vnode.length - 1; i >= 0; i = i - 1) {
      stack.push({ node: vnode[i], parent, metadata });
    }
    return;
  }
  if (!isVNode(vnode)) {
    const str = String(vnode);
    const node = pool.acquire("text", str);
    node.content = str;
    queue.nodes.push(node);
    return;
  }
  handleVNode(vnode, result, queue, pool, stack, parent, metadata);
}
function handleVNode(vnode, result, queue, pool, stack, parent, metadata) {
  if (!vnode.type) {
    throw new Error(
      `Unable to render ${result.pathname} because it contains an undefined Component!
Did you forget to import the component or is it possible there is a typo?`
    );
  }
  if (vnode.type === /* @__PURE__ */ Symbol.for("astro:fragment")) {
    stack.push({ node: vnode.props?.children, parent, metadata });
    return;
  }
  if (isAstroComponentFactory(vnode.type)) {
    const factory = vnode.type;
    let props = {};
    let slots = {};
    for (const [key, value] of Object.entries(vnode.props ?? {})) {
      if (key === "children" || value && typeof value === "object" && value["$$slot"]) {
        slots[key === "children" ? "default" : key] = () => renderJSX(result, value);
      } else {
        props[key] = value;
      }
    }
    const displayName = metadata?.displayName || factory.name || "Anonymous";
    const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
    const queueNode = pool.acquire("component");
    queueNode.instance = instance;
    queue.nodes.push(queueNode);
    return;
  }
  if (typeof vnode.type === "string" && vnode.type !== ClientOnlyPlaceholder) {
    renderHTMLElement(vnode, result, queue, pool, stack, parent, metadata);
    return;
  }
  if (typeof vnode.type === "function") {
    if (vnode.props?.["server:root"]) {
      const output3 = vnode.type(vnode.props ?? {});
      stack.push({ node: output3, parent, metadata });
      return;
    }
    const output2 = vnode.type(vnode.props ?? {});
    stack.push({ node: output2, parent, metadata });
    return;
  }
  const output = renderJSX(result, vnode);
  stack.push({ node: output, parent, metadata });
}
function renderHTMLElement(vnode, _result, queue, pool, stack, parent, metadata) {
  const tag = vnode.type;
  const { children, ...props } = vnode.props ?? {};
  const attrs = spreadAttributes(props);
  const isVoidElement = (children == null || children === "") && voidElementNames.test(tag);
  if (isVoidElement) {
    const html = `<${tag}${attrs}/>`;
    const node = pool.acquire("html-string", html);
    node.html = html;
    queue.nodes.push(node);
    return;
  }
  const openTag = `<${tag}${attrs}>`;
  const openTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(openTag) : markHTMLString(openTag);
  stack.push({ node: openTagHtml, parent, metadata });
  if (children != null && children !== "") {
    const processedChildren = prerenderElementChildren(tag, children, queue.htmlStringCache);
    stack.push({ node: processedChildren, parent, metadata });
  }
  const closeTag = `</${tag}>`;
  const closeTagHtml = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(closeTag) : markHTMLString(closeTag);
  stack.push({ node: closeTagHtml, parent, metadata });
}
function prerenderElementChildren(tag, children, htmlStringCache) {
  if (typeof children === "string" && (tag === "style" || tag === "script")) {
    return htmlStringCache ? htmlStringCache.getOrCreate(children) : markHTMLString(children);
  }
  return children;
}

async function buildRenderQueue(root, result, pool) {
  const queue = {
    nodes: [],
    result,
    pool,
    htmlStringCache: result._experimentalQueuedRendering?.htmlStringCache
  };
  const stack = [{ node: root, parent: null }];
  while (stack.length > 0) {
    const item = stack.pop();
    if (!item) {
      continue;
    }
    let { node, parent } = item;
    if (isPromise(node)) {
      try {
        const resolved = await node;
        stack.push({ node: resolved, parent, metadata: item.metadata });
      } catch (error) {
        throw error;
      }
      continue;
    }
    if (node == null || node === false) {
      continue;
    }
    if (typeof node === "string") {
      const queueNode = pool.acquire("text", node);
      queueNode.content = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "number" || typeof node === "boolean") {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (node instanceof SlotString) {
      const html = node.toString();
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isVNode(node)) {
      renderJSXToQueue(node, result, queue, pool, stack, parent, item.metadata);
      continue;
    }
    if (Array.isArray(node)) {
      for (const n of node) {
        stack.push({ node: n, parent, metadata: item.metadata });
      }
      continue;
    }
    if (isRenderInstruction(node)) {
      const queueNode = pool.acquire("instruction");
      queueNode.instruction = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderTemplateResult(node)) {
      const htmlParts = node["htmlParts"];
      const expressions = node["expressions"];
      if (htmlParts[0]) {
        const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[0]) : markHTMLString(htmlParts[0]);
        stack.push({
          node: htmlString,
          parent,
          metadata: item.metadata
        });
      }
      for (let i = 0; i < expressions.length; i = i + 1) {
        stack.push({ node: expressions[i], parent, metadata: item.metadata });
        if (htmlParts[i + 1]) {
          const htmlString = queue.htmlStringCache ? queue.htmlStringCache.getOrCreate(htmlParts[i + 1]) : markHTMLString(htmlParts[i + 1]);
          stack.push({
            node: htmlString,
            parent,
            metadata: item.metadata
          });
        }
      }
      continue;
    }
    if (isAstroComponentInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (isAstroComponentFactory(node)) {
      const factory = node;
      const props = item.metadata?.props || {};
      const slots = item.metadata?.slots || {};
      const displayName = item.metadata?.displayName || factory.name || "Anonymous";
      const instance = createAstroComponentInstance(result, displayName, factory, props, slots);
      const queueNode = pool.acquire("component");
      queueNode.instance = instance;
      if (isAPropagatingComponent(result, factory)) {
        try {
          const returnValue = await instance.init(result);
          if (isHeadAndContent(returnValue) && returnValue.head) {
            result._metadata.extraHead.push(returnValue.head);
          }
        } catch (error) {
          throw error;
        }
      }
      queue.nodes.push(queueNode);
      continue;
    }
    if (isRenderInstance(node)) {
      const queueNode = pool.acquire("component");
      queueNode.instance = node;
      queue.nodes.push(queueNode);
      continue;
    }
    if (typeof node === "object" && Symbol.iterator in node) {
      const items = Array.from(node);
      for (const iterItem of items) {
        stack.push({ node: iterItem, parent, metadata: item.metadata });
      }
      continue;
    }
    if (typeof node === "object" && Symbol.asyncIterator in node) {
      try {
        const items = [];
        for await (const asyncItem of node) {
          items.push(asyncItem);
        }
        for (const iterItem of items) {
          stack.push({ node: iterItem, parent, metadata: item.metadata });
        }
      } catch (error) {
        throw error;
      }
      continue;
    }
    if (node instanceof Response) {
      const queueNode = pool.acquire("html-string", "");
      queueNode.html = "";
      queue.nodes.push(queueNode);
      continue;
    }
    if (isHTMLString(node)) {
      const html = String(node);
      const queueNode = pool.acquire("html-string", html);
      queueNode.html = html;
      queue.nodes.push(queueNode);
    } else {
      const str = String(node);
      const queueNode = pool.acquire("text", str);
      queueNode.content = str;
      queue.nodes.push(queueNode);
    }
  }
  queue.nodes.reverse();
  return queue;
}

async function renderQueue(queue, destination) {
  const result = queue.result;
  const pool = queue.pool;
  const cache = queue.htmlStringCache;
  let batchBuffer = "";
  let i = 0;
  while (i < queue.nodes.length) {
    const node = queue.nodes[i];
    try {
      if (canBatch(node)) {
        const batchStart = i;
        while (i < queue.nodes.length && canBatch(queue.nodes[i])) {
          batchBuffer += renderNodeToString(queue.nodes[i]);
          i = i + 1;
        }
        if (batchBuffer) {
          const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
          destination.write(htmlString);
          batchBuffer = "";
        }
        if (pool) {
          for (let j = batchStart; j < i; j++) {
            pool.release(queue.nodes[j]);
          }
        }
      } else {
        await renderNode(node, destination, result);
        if (pool) {
          pool.release(node);
        }
        i = i + 1;
      }
    } catch (error) {
      throw error;
    }
  }
  if (batchBuffer) {
    const htmlString = cache ? cache.getOrCreate(batchBuffer) : markHTMLString(batchBuffer);
    destination.write(htmlString);
  }
}
function canBatch(node) {
  return node.type === "text" || node.type === "html-string";
}
function renderNodeToString(node) {
  switch (node.type) {
    case "text":
      return node.content ? escapeHTML(node.content) : "";
    case "html-string":
      return node.html || "";
    case "component":
    case "instruction": {
      return "";
    }
  }
}
async function renderNode(node, destination, result) {
  const cache = result._experimentalQueuedRendering?.htmlStringCache;
  switch (node.type) {
    case "text": {
      if (node.content) {
        const escaped = escapeHTML(node.content);
        const htmlString = cache ? cache.getOrCreate(escaped) : markHTMLString(escaped);
        destination.write(htmlString);
      }
      break;
    }
    case "html-string": {
      if (node.html) {
        const htmlString = cache ? cache.getOrCreate(node.html) : markHTMLString(node.html);
        destination.write(htmlString);
      }
      break;
    }
    case "instruction": {
      if (node.instruction) {
        destination.write(node.instruction);
      }
      break;
    }
    case "component": {
      if (node.instance) {
        let componentHtml = "";
        const componentDestination = {
          write(chunk) {
            if (chunk instanceof Response) return;
            componentHtml += chunkToString(result, chunk);
          }
        };
        await node.instance.render(componentDestination);
        if (componentHtml) {
          destination.write(componentHtml);
        }
      }
      break;
    }
  }
}

async function renderPage(result, componentFactory, props, children, streaming, route) {
  if (!isAstroComponentFactory(componentFactory)) {
    result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
    const pageProps = { ...props ?? {}, "server:root": true };
    let str;
    if (result._experimentalQueuedRendering && result._experimentalQueuedRendering.enabled) {
      let vnode = await componentFactory(pageProps);
      if (componentFactory["astro:html"] && typeof vnode === "string") {
        vnode = markHTMLString(vnode);
      }
      const queue = await buildRenderQueue(
        vnode,
        result,
        result._experimentalQueuedRendering.pool
      );
      let html = "";
      let renderedFirst = false;
      const destination = {
        write(chunk) {
          if (chunk instanceof Response) return;
          if (!renderedFirst && !result.partial) {
            renderedFirst = true;
            const chunkStr = String(chunk);
            if (!/<!doctype html/i.test(chunkStr)) {
              const doctype = result.compressHTML ? "<!DOCTYPE html>" : "<!DOCTYPE html>\n";
              html += doctype;
            }
          }
          html += chunkToString(result, chunk);
        }
      };
      await renderQueue(queue, destination);
      str = html;
    } else {
      str = await renderComponentToString(
        result,
        componentFactory.name,
        componentFactory,
        pageProps,
        {},
        true,
        route
      );
    }
    const bytes = encoder.encode(str);
    const headers2 = new Headers([
      ["Content-Type", "text/html"],
      ["Content-Length", bytes.byteLength.toString()]
    ]);
    if (result.shouldInjectCspMetaTags && (result.cspDestination === "header" || result.cspDestination === "adapter")) {
      headers2.set("content-security-policy", renderCspContent(result));
    }
    return new Response(bytes, {
      headers: headers2,
      status: result.response.status
    });
  }
  result._metadata.headInTree = result.componentMetadata.get(componentFactory.moduleId)?.containsHead ?? false;
  let body;
  if (streaming) {
    if (isNode && !isDeno) {
      const nodeBody = await renderToAsyncIterable(
        result,
        componentFactory,
        props,
        children,
        true,
        route
      );
      body = nodeBody;
    } else {
      body = await renderToReadableStream(result, componentFactory, props, children, true, route);
    }
  } else {
    body = await renderToString(result, componentFactory, props, children, true, route);
  }
  if (body instanceof Response) return body;
  const init = result.response;
  const headers = new Headers(init.headers);
  if (result.shouldInjectCspMetaTags && result.cspDestination === "header" || result.cspDestination === "adapter") {
    headers.set("content-security-policy", renderCspContent(result));
  }
  if (!streaming && typeof body === "string") {
    body = encoder.encode(body);
    headers.set("Content-Length", body.byteLength.toString());
  }
  let status = init.status;
  let statusText = init.statusText;
  if (route?.route === "/404") {
    status = 404;
    if (statusText === "OK") {
      statusText = "Not Found";
    }
  } else if (route?.route === "/500") {
    status = 500;
    if (statusText === "OK") {
      statusText = "Internal Server Error";
    }
  }
  if (status) {
    return new Response(body, { ...init, headers, status, statusText });
  } else {
    return new Response(body, { ...init, headers });
  }
}

function deduplicateDirectiveValues(existingDirective, newDirective) {
  const [directiveName, ...existingValues] = existingDirective.split(/\s+/).filter(Boolean);
  const [newDirectiveName, ...newValues] = newDirective.split(/\s+/).filter(Boolean);
  if (directiveName !== newDirectiveName) {
    return void 0;
  }
  const finalDirectives = Array.from(/* @__PURE__ */ new Set([...existingValues, ...newValues]));
  return `${directiveName} ${finalDirectives.join(" ")}`;
}
function pushDirective(directives, newDirective) {
  let deduplicated = false;
  if (directives.length === 0) {
    return [newDirective];
  }
  const finalDirectives = [];
  for (const directive of directives) {
    if (deduplicated) {
      finalDirectives.push(directive);
      continue;
    }
    const result = deduplicateDirectiveValues(directive, newDirective);
    if (result) {
      finalDirectives.push(result);
      deduplicated = true;
    } else {
      finalDirectives.push(directive);
      finalDirectives.push(newDirective);
    }
  }
  return finalDirectives;
}

async function callMiddleware(onRequest, apiContext, responseFunction) {
  let nextCalled = false;
  let responseFunctionPromise = void 0;
  const next = async (payload) => {
    nextCalled = true;
    responseFunctionPromise = responseFunction(apiContext, payload);
    return responseFunctionPromise;
  };
  const middlewarePromise = onRequest(apiContext, next);
  return await Promise.resolve(middlewarePromise).then(async (value) => {
    if (nextCalled) {
      if (typeof value !== "undefined") {
        if (value instanceof Response === false) {
          throw new AstroError(MiddlewareNotAResponse);
        }
        return value;
      } else {
        if (responseFunctionPromise) {
          return responseFunctionPromise;
        } else {
          throw new AstroError(MiddlewareNotAResponse);
        }
      }
    } else if (typeof value === "undefined") {
      throw new AstroError(MiddlewareNoDataOrNextCalled);
    } else if (value instanceof Response === false) {
      throw new AstroError(MiddlewareNotAResponse);
    } else {
      return value;
    }
  });
}

const EMPTY_OPTIONS = Object.freeze({ tags: [] });
class NoopAstroCache {
  enabled = false;
  set() {
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
  }
}
let hasWarned = false;
class DisabledAstroCache {
  enabled = false;
  #logger;
  constructor(logger) {
    this.#logger = logger;
  }
  #warn() {
    if (!hasWarned) {
      hasWarned = true;
      this.#logger?.warn(
        "cache",
        "`cache.set()` was called but caching is not enabled. Configure a cache provider in your Astro config under `experimental.cache` to enable caching."
      );
    }
  }
  set() {
    this.#warn();
  }
  get tags() {
    return [];
  }
  get options() {
    return EMPTY_OPTIONS;
  }
  async invalidate() {
    throw new AstroError(CacheNotEnabled);
  }
}

const NOOP_ACTIONS_MOD = {
  server: {}
};

const FORM_CONTENT_TYPES = [
  "application/x-www-form-urlencoded",
  "multipart/form-data",
  "text/plain"
];
const SAFE_METHODS = ["GET", "HEAD", "OPTIONS"];
function createOriginCheckMiddleware() {
  return defineMiddleware((context, next) => {
    const { request, url, isPrerendered } = context;
    if (isPrerendered) {
      return next();
    }
    if (SAFE_METHODS.includes(request.method)) {
      return next();
    }
    const isSameOrigin = request.headers.get("origin") === url.origin;
    const hasContentType = request.headers.has("content-type");
    if (hasContentType) {
      const formLikeHeader = hasFormLikeHeader(request.headers.get("content-type"));
      if (formLikeHeader && !isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    } else {
      if (!isSameOrigin) {
        return new Response(`Cross-site ${request.method} form submissions are forbidden`, {
          status: 403
        });
      }
    }
    return next();
  });
}
function hasFormLikeHeader(contentType) {
  if (contentType) {
    for (const FORM_CONTENT_TYPE of FORM_CONTENT_TYPES) {
      if (contentType.toLowerCase().includes(FORM_CONTENT_TYPE)) {
        return true;
      }
    }
  }
  return false;
}

const NOOP_MIDDLEWARE_FN = async (_ctx, next) => {
  const response = await next();
  response.headers.set(NOOP_MIDDLEWARE_HEADER, "true");
  return response;
};

const RedirectComponentInstance = {
  default() {
    return new Response(null, {
      status: 301
    });
  }
};
const RedirectSinglePageBuiltModule = {
  page: () => Promise.resolve(RedirectComponentInstance),
  onRequest: (_, next) => next()
};

function getPattern(segments, base, addTrailingSlash) {
  const pathname = segments.map((segment) => {
    if (segment.length === 1 && segment[0].spread) {
      return "(?:\\/(.*?))?";
    } else {
      return "\\/" + segment.map((part) => {
        if (part.spread) {
          return "(.*?)";
        } else if (part.dynamic) {
          return "([^/]+?)";
        } else {
          return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        }
      }).join("");
    }
  }).join("");
  const trailing = addTrailingSlash && segments.length ? getTrailingSlashPattern(addTrailingSlash) : "$";
  let initial = "\\/";
  if (addTrailingSlash === "never" && base !== "/") {
    initial = "";
  }
  return new RegExp(`^${pathname || initial}${trailing}`);
}
function getTrailingSlashPattern(addTrailingSlash) {
  if (addTrailingSlash === "always") {
    return "\\/$";
  }
  if (addTrailingSlash === "never") {
    return "$";
  }
  return "\\/?$";
}

const SERVER_ISLAND_ROUTE = "/_server-islands/[name]";
const SERVER_ISLAND_COMPONENT = "_server-islands.astro";
function badRequest(reason) {
  return new Response(null, {
    status: 400,
    statusText: "Bad request: " + reason
  });
}
const DEFAULT_BODY_SIZE_LIMIT = 1024 * 1024;
async function getRequestData(request, bodySizeLimit = DEFAULT_BODY_SIZE_LIMIT) {
  switch (request.method) {
    case "GET": {
      const url = new URL(request.url);
      const params = url.searchParams;
      if (!params.has("s") || !params.has("e") || !params.has("p")) {
        return badRequest("Missing required query parameters.");
      }
      const encryptedSlots = params.get("s");
      return {
        encryptedComponentExport: params.get("e"),
        encryptedProps: params.get("p"),
        encryptedSlots
      };
    }
    case "POST": {
      try {
        const body = await readBodyWithLimit(request, bodySizeLimit);
        const raw = new TextDecoder().decode(body);
        const data = JSON.parse(raw);
        if (Object.hasOwn(data, "slots") && typeof data.slots === "object") {
          return badRequest("Plaintext slots are not allowed. Slots must be encrypted.");
        }
        if (Object.hasOwn(data, "componentExport") && typeof data.componentExport === "string") {
          return badRequest(
            "Plaintext componentExport is not allowed. componentExport must be encrypted."
          );
        }
        return data;
      } catch (e) {
        if (e instanceof BodySizeLimitError) {
          return new Response(null, {
            status: 413,
            statusText: e.message
          });
        }
        if (e instanceof SyntaxError) {
          return badRequest("Request format is invalid.");
        }
        throw e;
      }
    }
    default: {
      return new Response(null, { status: 405 });
    }
  }
}
function createEndpoint(manifest) {
  const page = async (result) => {
    const params = result.params;
    if (!params.name) {
      return new Response(null, {
        status: 400,
        statusText: "Bad request"
      });
    }
    const componentId = params.name;
    const data = await getRequestData(result.request, manifest.serverIslandBodySizeLimit);
    if (data instanceof Response) {
      return data;
    }
    const serverIslandMappings = await manifest.serverIslandMappings?.();
    const serverIslandMap = await serverIslandMappings?.serverIslandMap;
    let imp = serverIslandMap?.get(componentId);
    if (!imp) {
      return new Response(null, {
        status: 404,
        statusText: "Not found"
      });
    }
    const key = await manifest.key;
    let componentExport;
    try {
      componentExport = await decryptString(key, data.encryptedComponentExport);
    } catch (_e) {
      return badRequest("Encrypted componentExport value is invalid.");
    }
    const encryptedProps = data.encryptedProps;
    let props = {};
    if (encryptedProps !== "") {
      try {
        const propString = await decryptString(key, encryptedProps);
        props = JSON.parse(propString);
      } catch (_e) {
        return badRequest("Encrypted props value is invalid.");
      }
    }
    let decryptedSlots = {};
    const encryptedSlots = data.encryptedSlots;
    if (encryptedSlots !== "") {
      try {
        const slotsString = await decryptString(key, encryptedSlots);
        decryptedSlots = JSON.parse(slotsString);
      } catch (_e) {
        return badRequest("Encrypted slots value is invalid.");
      }
    }
    const componentModule = await imp();
    let Component = componentModule[componentExport];
    const slots = {};
    for (const prop in decryptedSlots) {
      slots[prop] = createSlotValueFromString(decryptedSlots[prop]);
    }
    result.response.headers.set("X-Robots-Tag", "noindex");
    if (isAstroComponentFactory(Component)) {
      const ServerIsland = Component;
      Component = function(...args) {
        return ServerIsland.apply(this, args);
      };
      Object.assign(Component, ServerIsland);
      Component.propagation = "self";
    }
    return renderTemplate`${renderComponent(result, "Component", Component, props, slots)}`;
  };
  page.isAstroComponentFactory = true;
  const instance = {
    default: page,
    partial: true
  };
  return instance;
}

function createDefaultRoutes(manifest) {
  const root = new URL(manifest.rootDir);
  return [
    {
      instance: default404Instance,
      matchesComponent: (filePath) => filePath.href === new URL(DEFAULT_404_COMPONENT, root).href,
      route: DEFAULT_404_ROUTE.route,
      component: DEFAULT_404_COMPONENT
    },
    {
      instance: createEndpoint(manifest),
      matchesComponent: (filePath) => filePath.href === new URL(SERVER_ISLAND_COMPONENT, root).href,
      route: SERVER_ISLAND_ROUTE,
      component: SERVER_ISLAND_COMPONENT
    }
  ];
}

function deserializeManifest(serializedManifest, routesList) {
  const routes = [];
  if (serializedManifest.routes) {
    for (const serializedRoute of serializedManifest.routes) {
      routes.push({
        ...serializedRoute,
        routeData: deserializeRouteData(serializedRoute.routeData)
      });
      const route = serializedRoute;
      route.routeData = deserializeRouteData(serializedRoute.routeData);
    }
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    rootDir: new URL(serializedManifest.rootDir),
    srcDir: new URL(serializedManifest.srcDir),
    publicDir: new URL(serializedManifest.publicDir),
    outDir: new URL(serializedManifest.outDir),
    cacheDir: new URL(serializedManifest.cacheDir),
    buildClientDir: new URL(serializedManifest.buildClientDir),
    buildServerDir: new URL(serializedManifest.buildServerDir),
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    key
  };
}
function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin,
    distURL: rawRouteData.distURL
  };
}
function deserializeRouteInfo(rawRouteInfo) {
  return {
    styles: rawRouteInfo.styles,
    file: rawRouteInfo.file,
    links: rawRouteInfo.links,
    scripts: rawRouteInfo.scripts,
    routeData: deserializeRouteData(rawRouteInfo.routeData)
  };
}

class NodePool {
  textPool = [];
  htmlStringPool = [];
  componentPool = [];
  instructionPool = [];
  maxSize;
  enableStats;
  stats = {
    acquireFromPool: 0,
    acquireNew: 0,
    released: 0,
    releasedDropped: 0
  };
  /**
   * Creates a new object pool for queue nodes.
   *
   * @param maxSize - Maximum number of nodes to keep in the pool (default: 1000).
   *   The cap is shared across all typed sub-pools.
   * @param enableStats - Enable statistics tracking (default: false for performance)
   */
  constructor(maxSize = 1e3, enableStats = false) {
    this.maxSize = maxSize;
    this.enableStats = enableStats;
  }
  /**
   * Acquires a queue node from the pool or creates a new one if the pool is empty.
   * Pops from the type-specific sub-pool to reuse an existing object when available.
   *
   * @param type - The type of queue node to acquire
   * @param content - Optional content to set on the node (for text or html-string types)
   * @returns A queue node ready to be populated with data
   */
  acquire(type, content) {
    const pooledNode = this.popFromTypedPool(type);
    if (pooledNode) {
      if (this.enableStats) {
        this.stats.acquireFromPool = this.stats.acquireFromPool + 1;
      }
      this.resetNodeContent(pooledNode, type, content);
      return pooledNode;
    }
    if (this.enableStats) {
      this.stats.acquireNew = this.stats.acquireNew + 1;
    }
    return this.createNode(type, content);
  }
  /**
   * Creates a new node of the specified type with the given content.
   * Helper method to reduce branching in acquire().
   */
  createNode(type, content = "") {
    switch (type) {
      case "text":
        return { type: "text", content };
      case "html-string":
        return { type: "html-string", html: content };
      case "component":
        return { type: "component", instance: void 0 };
      case "instruction":
        return { type: "instruction", instruction: void 0 };
    }
  }
  /**
   * Pops a node from the type-specific sub-pool.
   * Returns undefined if the sub-pool for the requested type is empty.
   */
  popFromTypedPool(type) {
    switch (type) {
      case "text":
        return this.textPool.pop();
      case "html-string":
        return this.htmlStringPool.pop();
      case "component":
        return this.componentPool.pop();
      case "instruction":
        return this.instructionPool.pop();
    }
  }
  /**
   * Resets the content/value field on a reused pooled node.
   * The type discriminant is already correct since we pop from the matching sub-pool.
   */
  resetNodeContent(node, type, content) {
    switch (type) {
      case "text":
        node.content = content ?? "";
        break;
      case "html-string":
        node.html = content ?? "";
        break;
      case "component":
        node.instance = void 0;
        break;
      case "instruction":
        node.instruction = void 0;
        break;
    }
  }
  /**
   * Returns the total number of nodes across all typed sub-pools.
   */
  totalPoolSize() {
    return this.textPool.length + this.htmlStringPool.length + this.componentPool.length + this.instructionPool.length;
  }
  /**
   * Releases a queue node back to the pool for reuse.
   * If the pool is at max capacity, the node is discarded (will be GC'd).
   *
   * @param node - The node to release back to the pool
   */
  release(node) {
    if (this.totalPoolSize() >= this.maxSize) {
      if (this.enableStats) {
        this.stats.releasedDropped = this.stats.releasedDropped + 1;
      }
      return;
    }
    switch (node.type) {
      case "text":
        node.content = "";
        this.textPool.push(node);
        break;
      case "html-string":
        node.html = "";
        this.htmlStringPool.push(node);
        break;
      case "component":
        node.instance = void 0;
        this.componentPool.push(node);
        break;
      case "instruction":
        node.instruction = void 0;
        this.instructionPool.push(node);
        break;
    }
    if (this.enableStats) {
      this.stats.released = this.stats.released + 1;
    }
  }
  /**
   * Releases all nodes in an array back to the pool.
   * This is a convenience method for releasing multiple nodes at once.
   *
   * @param nodes - Array of nodes to release
   */
  releaseAll(nodes) {
    for (const node of nodes) {
      this.release(node);
    }
  }
  /**
   * Clears all typed sub-pools, discarding all cached nodes.
   * This can be useful if you want to free memory after a large render.
   */
  clear() {
    this.textPool.length = 0;
    this.htmlStringPool.length = 0;
    this.componentPool.length = 0;
    this.instructionPool.length = 0;
  }
  /**
   * Gets the current total number of nodes across all typed sub-pools.
   * Useful for monitoring pool usage and tuning maxSize.
   *
   * @returns Number of nodes currently available in the pool
   */
  size() {
    return this.totalPoolSize();
  }
  /**
   * Gets pool statistics for debugging.
   *
   * @returns Pool usage statistics including computed metrics
   */
  getStats() {
    return {
      ...this.stats,
      poolSize: this.totalPoolSize(),
      maxSize: this.maxSize,
      hitRate: this.stats.acquireFromPool + this.stats.acquireNew > 0 ? this.stats.acquireFromPool / (this.stats.acquireFromPool + this.stats.acquireNew) * 100 : 0
    };
  }
  /**
   * Resets pool statistics.
   */
  resetStats() {
    this.stats = {
      acquireFromPool: 0,
      acquireNew: 0,
      released: 0,
      releasedDropped: 0
    };
  }
}

class HTMLStringCache {
  cache = /* @__PURE__ */ new Map();
  maxSize;
  constructor(maxSize = 1e3) {
    this.maxSize = maxSize;
    this.warm(COMMON_HTML_PATTERNS);
  }
  /**
   * Get or create an HTMLString for the given content.
   * If cached, the existing object is returned and moved to end (most recently used).
   * If not cached, a new HTMLString is created, cached, and returned.
   *
   * @param content - The HTML string content
   * @returns HTMLString object (cached or newly created)
   */
  getOrCreate(content) {
    const cached = this.cache.get(content);
    if (cached) {
      this.cache.delete(content);
      this.cache.set(content, cached);
      return cached;
    }
    const htmlString = new HTMLString(content);
    this.cache.set(content, htmlString);
    if (this.cache.size > this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== void 0) {
        this.cache.delete(firstKey);
      }
    }
    return htmlString;
  }
  /**
   * Get current cache size
   */
  size() {
    return this.cache.size;
  }
  /**
   * Pre-warms the cache with common HTML patterns.
   * This ensures first-render cache hits for frequently used tags.
   *
   * @param patterns - Array of HTML strings to pre-cache
   */
  warm(patterns) {
    for (const pattern of patterns) {
      if (!this.cache.has(pattern)) {
        this.cache.set(pattern, new HTMLString(pattern));
      }
    }
  }
  /**
   * Clear the entire cache
   */
  clear() {
    this.cache.clear();
  }
}
const COMMON_HTML_PATTERNS = [
  // Structural elements
  "<div>",
  "</div>",
  "<span>",
  "</span>",
  "<p>",
  "</p>",
  "<section>",
  "</section>",
  "<article>",
  "</article>",
  "<header>",
  "</header>",
  "<footer>",
  "</footer>",
  "<nav>",
  "</nav>",
  "<main>",
  "</main>",
  "<aside>",
  "</aside>",
  // List elements
  "<ul>",
  "</ul>",
  "<ol>",
  "</ol>",
  "<li>",
  "</li>",
  // Void/self-closing elements
  "<br>",
  "<hr>",
  "<br/>",
  "<hr/>",
  // Heading elements
  "<h1>",
  "</h1>",
  "<h2>",
  "</h2>",
  "<h3>",
  "</h3>",
  "<h4>",
  "</h4>",
  // Inline elements
  "<a>",
  "</a>",
  "<strong>",
  "</strong>",
  "<em>",
  "</em>",
  "<code>",
  "</code>",
  // Common whitespace
  " ",
  "\n"
];

class Pipeline {
  internalMiddleware;
  resolvedMiddleware = void 0;
  resolvedActions = void 0;
  resolvedSessionDriver = void 0;
  resolvedCacheProvider = void 0;
  compiledCacheRoutes = void 0;
  nodePool;
  htmlStringCache;
  logger;
  manifest;
  /**
   * "development" or "production" only
   */
  runtimeMode;
  renderers;
  resolve;
  streaming;
  /**
   * Used to provide better error messages for `Astro.clientAddress`
   */
  adapterName;
  clientDirectives;
  inlinedScripts;
  compressHTML;
  i18n;
  middleware;
  routeCache;
  /**
   * Used for `Astro.site`.
   */
  site;
  /**
   * Array of built-in, internal, routes.
   * Used to find the route module
   */
  defaultRoutes;
  actions;
  sessionDriver;
  cacheProvider;
  cacheConfig;
  serverIslands;
  constructor(logger, manifest, runtimeMode, renderers, resolve, streaming, adapterName = manifest.adapterName, clientDirectives = manifest.clientDirectives, inlinedScripts = manifest.inlinedScripts, compressHTML = manifest.compressHTML, i18n = manifest.i18n, middleware = manifest.middleware, routeCache = new RouteCache(logger, runtimeMode), site = manifest.site ? new URL(manifest.site) : void 0, defaultRoutes = createDefaultRoutes(manifest), actions = manifest.actions, sessionDriver = manifest.sessionDriver, cacheProvider = manifest.cacheProvider, cacheConfig = manifest.cacheConfig, serverIslands = manifest.serverIslandMappings) {
    this.logger = logger;
    this.manifest = manifest;
    this.runtimeMode = runtimeMode;
    this.renderers = renderers;
    this.resolve = resolve;
    this.streaming = streaming;
    this.adapterName = adapterName;
    this.clientDirectives = clientDirectives;
    this.inlinedScripts = inlinedScripts;
    this.compressHTML = compressHTML;
    this.i18n = i18n;
    this.middleware = middleware;
    this.routeCache = routeCache;
    this.site = site;
    this.defaultRoutes = defaultRoutes;
    this.actions = actions;
    this.sessionDriver = sessionDriver;
    this.cacheProvider = cacheProvider;
    this.cacheConfig = cacheConfig;
    this.serverIslands = serverIslands;
    this.internalMiddleware = [];
    if (i18n?.strategy !== "manual") {
      this.internalMiddleware.push(
        createI18nMiddleware(i18n, manifest.base, manifest.trailingSlash, manifest.buildFormat)
      );
    }
    if (manifest.experimentalQueuedRendering.enabled) {
      this.nodePool = this.createNodePool(
        manifest.experimentalQueuedRendering.poolSize ?? 1e3,
        false
      );
      if (manifest.experimentalQueuedRendering.contentCache) {
        this.htmlStringCache = this.createStringCache();
      }
    }
  }
  /**
   * Resolves the middleware from the manifest, and returns the `onRequest` function. If `onRequest` isn't there,
   * it returns a no-op function
   */
  async getMiddleware() {
    if (this.resolvedMiddleware) {
      return this.resolvedMiddleware;
    }
    if (this.middleware) {
      const middlewareInstance = await this.middleware();
      const onRequest = middlewareInstance.onRequest ?? NOOP_MIDDLEWARE_FN;
      const internalMiddlewares = [onRequest];
      if (this.manifest.checkOrigin) {
        internalMiddlewares.unshift(createOriginCheckMiddleware());
      }
      this.resolvedMiddleware = sequence(...internalMiddlewares);
      return this.resolvedMiddleware;
    } else {
      this.resolvedMiddleware = NOOP_MIDDLEWARE_FN;
      return this.resolvedMiddleware;
    }
  }
  /**
   * Clears the cached middleware so it is re-resolved on the next request.
   * Called via HMR when middleware files change during development.
   */
  clearMiddleware() {
    this.resolvedMiddleware = void 0;
  }
  async getActions() {
    if (this.resolvedActions) {
      return this.resolvedActions;
    } else if (this.actions) {
      return this.actions();
    }
    return NOOP_ACTIONS_MOD;
  }
  async getSessionDriver() {
    if (this.resolvedSessionDriver !== void 0) {
      return this.resolvedSessionDriver;
    }
    if (this.sessionDriver) {
      const driverModule = await this.sessionDriver();
      this.resolvedSessionDriver = driverModule?.default || null;
      return this.resolvedSessionDriver;
    }
    this.resolvedSessionDriver = null;
    return null;
  }
  async getCacheProvider() {
    if (this.resolvedCacheProvider !== void 0) {
      return this.resolvedCacheProvider;
    }
    if (this.cacheProvider) {
      const mod = await this.cacheProvider();
      const factory = mod?.default || null;
      this.resolvedCacheProvider = factory ? factory(this.cacheConfig?.options) : null;
      return this.resolvedCacheProvider;
    }
    this.resolvedCacheProvider = null;
    return null;
  }
  async getServerIslands() {
    if (this.serverIslands) {
      return this.serverIslands();
    }
    return {
      serverIslandMap: /* @__PURE__ */ new Map(),
      serverIslandNameMap: /* @__PURE__ */ new Map()
    };
  }
  async getAction(path) {
    const pathKeys = path.split(".").map((key) => decodeURIComponent(key));
    let { server } = await this.getActions();
    if (!server || !(typeof server === "object")) {
      throw new TypeError(
        `Expected \`server\` export in actions file to be an object. Received ${typeof server}.`
      );
    }
    for (const key of pathKeys) {
      if (!Object.hasOwn(server, key)) {
        throw new AstroError({
          ...ActionNotFoundError,
          message: ActionNotFoundError.message(pathKeys.join("."))
        });
      }
      server = server[key];
    }
    if (typeof server !== "function") {
      throw new TypeError(
        `Expected handler for action ${pathKeys.join(".")} to be a function. Received ${typeof server}.`
      );
    }
    return server;
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    if (route.type === "redirect") {
      return RedirectSinglePageBuiltModule;
    } else {
      if (this.manifest.pageMap) {
        const importComponentInstance = this.manifest.pageMap.get(route.component);
        if (!importComponentInstance) {
          throw new Error(
            `Unexpectedly unable to find a component instance for route ${route.route}`
          );
        }
        return await importComponentInstance();
      } else if (this.manifest.pageModule) {
        return this.manifest.pageModule;
      }
      throw new Error(
        "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
      );
    }
  }
  createNodePool(poolSize, stats) {
    return new NodePool(poolSize, stats);
  }
  createStringCache() {
    return new HTMLStringCache(1e3);
  }
}

function getFunctionExpression(slot) {
  if (!slot) return;
  const expressions = slot?.expressions?.filter((e) => isRenderInstruction(e) === false);
  if (expressions?.length !== 1) return;
  return expressions[0];
}
class Slots {
  #result;
  #slots;
  #logger;
  constructor(result, slots, logger) {
    this.#result = result;
    this.#slots = slots;
    this.#logger = logger;
    if (slots) {
      for (const key of Object.keys(slots)) {
        if (this[key] !== void 0) {
          throw new AstroError({
            ...ReservedSlotName,
            message: ReservedSlotName.message(key)
          });
        }
        Object.defineProperty(this, key, {
          get() {
            return true;
          },
          enumerable: true
        });
      }
    }
  }
  has(name) {
    if (!this.#slots) return false;
    return Boolean(this.#slots[name]);
  }
  async render(name, args = []) {
    if (!this.#slots || !this.has(name)) return;
    const result = this.#result;
    if (!Array.isArray(args)) {
      this.#logger.warn(
        null,
        `Expected second parameter to be an array, received a ${typeof args}. If you're trying to pass an array as a single argument and getting unexpected results, make sure you're passing your array as an item of an array. Ex: Astro.slots.render('default', [["Hello", "World"]])`
      );
    } else if (args.length > 0) {
      const slotValue = this.#slots[name];
      const component = typeof slotValue === "function" ? await slotValue(result) : await slotValue;
      const expression = getFunctionExpression(component);
      if (expression) {
        const slot = async () => typeof expression === "function" ? expression(...args) : expression;
        return await renderSlotToString(result, slot).then((res) => {
          return res;
        });
      }
      if (typeof component === "function") {
        return await renderJSX(result, component(...args)).then(
          (res) => res != null ? String(res) : res
        );
      }
    }
    const content = await renderSlotToString(result, this.#slots[name]);
    const outHTML = chunkToString(result, content);
    return outHTML;
  }
}

function isExternalURL(url) {
  return url.startsWith("http://") || url.startsWith("https://") || url.startsWith("//");
}
function redirectIsExternal(redirect) {
  if (typeof redirect === "string") {
    return isExternalURL(redirect);
  } else {
    return isExternalURL(redirect.destination);
  }
}
function computeRedirectStatus(method, redirect, redirectRoute) {
  return redirectRoute && typeof redirect === "object" ? redirect.status : method === "GET" ? 301 : 308;
}
function resolveRedirectTarget(params, redirect, redirectRoute, trailingSlash) {
  if (typeof redirectRoute !== "undefined") {
    const generate = getRouteGenerator(redirectRoute.segments, trailingSlash);
    return generate(params);
  } else if (typeof redirect === "string") {
    if (redirectIsExternal(redirect)) {
      return redirect;
    } else {
      let target = redirect;
      for (const param of Object.keys(params)) {
        const paramValue = params[param];
        target = target.replace(`[${param}]`, paramValue).replace(`[...${param}]`, paramValue);
      }
      return target;
    }
  } else if (typeof redirect === "undefined") {
    return "/";
  }
  return redirect.destination;
}
async function renderRedirect(renderContext) {
  const {
    request: { method },
    routeData
  } = renderContext;
  const { redirect, redirectRoute } = routeData;
  const status = computeRedirectStatus(method, redirect, redirectRoute);
  const headers = {
    location: encodeURI(
      resolveRedirectTarget(
        renderContext.params,
        redirect,
        redirectRoute,
        renderContext.pipeline.manifest.trailingSlash
      )
    )
  };
  if (redirect && redirectIsExternal(redirect)) {
    if (typeof redirect === "string") {
      return Response.redirect(redirect, status);
    } else {
      return Response.redirect(redirect.destination, status);
    }
  }
  return new Response(null, { status, headers });
}

function matchRoute(pathname, manifest) {
  if (isRoute404(pathname)) {
    const errorRoute = manifest.routes.find((route) => isRoute404(route.route));
    if (errorRoute) return errorRoute;
  }
  if (isRoute500(pathname)) {
    const errorRoute = manifest.routes.find((route) => isRoute500(route.route));
    if (errorRoute) return errorRoute;
  }
  return manifest.routes.find((route) => {
    return route.pattern.test(pathname) || route.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
  });
}
function isRoute404or500(route) {
  return isRoute404(route.route) || isRoute500(route.route);
}
function isRouteServerIsland(route) {
  return route.component === SERVER_ISLAND_COMPONENT;
}
function isRouteExternalRedirect(route) {
  return !!(route.type === "redirect" && route.redirect && redirectIsExternal(route.redirect));
}

function defaultSetHeaders(options) {
  const headers = new Headers();
  const directives = [];
  if (options.maxAge !== void 0) {
    directives.push(`max-age=${options.maxAge}`);
  }
  if (options.swr !== void 0) {
    directives.push(`stale-while-revalidate=${options.swr}`);
  }
  if (directives.length > 0) {
    headers.set("CDN-Cache-Control", directives.join(", "));
  }
  if (options.tags && options.tags.length > 0) {
    headers.set("Cache-Tag", options.tags.join(", "));
  }
  if (options.lastModified) {
    headers.set("Last-Modified", options.lastModified.toUTCString());
  }
  if (options.etag) {
    headers.set("ETag", options.etag);
  }
  return headers;
}
function isLiveDataEntry(value) {
  return value != null && typeof value === "object" && "id" in value && "data" in value && "cacheHint" in value;
}

const APPLY_HEADERS = /* @__PURE__ */ Symbol.for("astro:cache:apply");
const IS_ACTIVE = /* @__PURE__ */ Symbol.for("astro:cache:active");
class AstroCache {
  #options = {};
  #tags = /* @__PURE__ */ new Set();
  #disabled = false;
  #provider;
  enabled = true;
  constructor(provider) {
    this.#provider = provider;
  }
  set(input) {
    if (input === false) {
      this.#disabled = true;
      this.#tags.clear();
      this.#options = {};
      return;
    }
    this.#disabled = false;
    let options;
    if (isLiveDataEntry(input)) {
      if (!input.cacheHint) return;
      options = input.cacheHint;
    } else {
      options = input;
    }
    if ("maxAge" in options && options.maxAge !== void 0) this.#options.maxAge = options.maxAge;
    if ("swr" in options && options.swr !== void 0)
      this.#options.swr = options.swr;
    if ("etag" in options && options.etag !== void 0)
      this.#options.etag = options.etag;
    if (options.lastModified !== void 0) {
      if (!this.#options.lastModified || options.lastModified > this.#options.lastModified) {
        this.#options.lastModified = options.lastModified;
      }
    }
    if (options.tags) {
      for (const tag of options.tags) this.#tags.add(tag);
    }
  }
  get tags() {
    return [...this.#tags];
  }
  /**
   * Get the current cache options (read-only snapshot).
   * Includes all accumulated options: maxAge, swr, tags, etag, lastModified.
   */
  get options() {
    return {
      ...this.#options,
      tags: this.tags
    };
  }
  async invalidate(input) {
    if (!this.#provider) {
      throw new AstroError(CacheNotEnabled);
    }
    let options;
    if (isLiveDataEntry(input)) {
      options = { tags: input.cacheHint?.tags ?? [] };
    } else {
      options = input;
    }
    return this.#provider.invalidate(options);
  }
  /** @internal */
  [APPLY_HEADERS](response) {
    if (this.#disabled) return;
    const finalOptions = { ...this.#options, tags: this.tags };
    if (finalOptions.maxAge === void 0 && !finalOptions.tags?.length) return;
    const headers = this.#provider?.setHeaders?.(finalOptions) ?? defaultSetHeaders(finalOptions);
    for (const [key, value] of headers) {
      response.headers.set(key, value);
    }
  }
  /** @internal */
  get [IS_ACTIVE]() {
    return !this.#disabled && (this.#options.maxAge !== void 0 || this.#tags.size > 0);
  }
}
function applyCacheHeaders(cache, response) {
  if (APPLY_HEADERS in cache) {
    cache[APPLY_HEADERS](response);
  }
}

const ROUTE_DYNAMIC_SPLIT = /\[(.+?\(.+?\)|.+?)\]/;
const ROUTE_SPREAD = /^\.{3}.+$/;
function getParts(part, file) {
  const result = [];
  part.split(ROUTE_DYNAMIC_SPLIT).map((str, i) => {
    if (!str) return;
    const dynamic = i % 2 === 1;
    const [, content] = dynamic ? /([^(]+)$/.exec(str) || [null, null] : [null, str];
    if (!content || dynamic && !/^(?:\.\.\.)?[\w$]+$/.test(content)) {
      throw new Error(`Invalid route ${file} \u2014 parameter name must match /^[a-zA-Z0-9_$]+$/`);
    }
    result.push({
      content,
      dynamic,
      spread: dynamic && ROUTE_SPREAD.test(content)
    });
  });
  return result;
}

function routeComparator(a, b) {
  const commonLength = Math.min(a.segments.length, b.segments.length);
  for (let index = 0; index < commonLength; index++) {
    const aSegment = a.segments[index];
    const bSegment = b.segments[index];
    const aIsStatic = aSegment.every((part) => !part.dynamic && !part.spread);
    const bIsStatic = bSegment.every((part) => !part.dynamic && !part.spread);
    if (aIsStatic && bIsStatic) {
      const aContent = aSegment.map((part) => part.content).join("");
      const bContent = bSegment.map((part) => part.content).join("");
      if (aContent !== bContent) {
        return aContent.localeCompare(bContent);
      }
    }
    if (aIsStatic !== bIsStatic) {
      return aIsStatic ? -1 : 1;
    }
    const aAllDynamic = aSegment.every((part) => part.dynamic);
    const bAllDynamic = bSegment.every((part) => part.dynamic);
    if (aAllDynamic !== bAllDynamic) {
      return aAllDynamic ? 1 : -1;
    }
    const aHasSpread = aSegment.some((part) => part.spread);
    const bHasSpread = bSegment.some((part) => part.spread);
    if (aHasSpread !== bHasSpread) {
      return aHasSpread ? 1 : -1;
    }
  }
  const aLength = a.segments.length;
  const bLength = b.segments.length;
  if (aLength !== bLength) {
    const aEndsInRest = a.segments.at(-1)?.some((part) => part.spread);
    const bEndsInRest = b.segments.at(-1)?.some((part) => part.spread);
    if (aEndsInRest !== bEndsInRest && Math.abs(aLength - bLength) === 1) {
      if (aLength > bLength && aEndsInRest) {
        return 1;
      }
      if (bLength > aLength && bEndsInRest) {
        return -1;
      }
    }
    return aLength > bLength ? -1 : 1;
  }
  if (a.type === "endpoint" !== (b.type === "endpoint")) {
    return a.type === "endpoint" ? -1 : 1;
  }
  return a.route.localeCompare(b.route);
}

function compileCacheRoutes(routes, base, trailingSlash) {
  const compiled = Object.entries(routes).map(([path, options]) => {
    const segments = removeLeadingForwardSlash(path).split("/").filter(Boolean).map((s) => getParts(s, path));
    const pattern = getPattern(segments, base, trailingSlash);
    return { pattern, options, segments, route: path };
  });
  compiled.sort(
    (a, b) => routeComparator(
      { segments: a.segments, route: a.route, type: "page" },
      { segments: b.segments, route: b.route, type: "page" }
    )
  );
  return compiled;
}
function matchCacheRoute(pathname, compiledRoutes) {
  for (const route of compiledRoutes) {
    if (route.pattern.test(pathname)) return route.options;
  }
  return null;
}

const PERSIST_SYMBOL = /* @__PURE__ */ Symbol();
const DEFAULT_COOKIE_NAME = "astro-session";
const VALID_COOKIE_REGEX = /^[\w-]+$/;
const unflatten = (parsed, _) => {
  return unflatten$1(parsed, {
    URL: (href) => new URL(href)
  });
};
const stringify = (data, _) => {
  return stringify$1(data, {
    // Support URL objects
    URL: (val) => val instanceof URL && val.href
  });
};
class AstroSession {
  // The cookies object.
  #cookies;
  // The session configuration.
  #config;
  // The cookie config
  #cookieConfig;
  // The cookie name
  #cookieName;
  // The unstorage object for the session driver.
  #storage;
  #data;
  // The session ID. A v4 UUID.
  #sessionID;
  // Sessions to destroy. Needed because we won't have the old session ID after it's destroyed locally.
  #toDestroy = /* @__PURE__ */ new Set();
  // Session keys to delete. Used for partial data sets to avoid overwriting the deleted value.
  #toDelete = /* @__PURE__ */ new Set();
  // Whether the session is dirty and needs to be saved.
  #dirty = false;
  // Whether the session cookie has been set.
  #cookieSet = false;
  // Whether the session ID was sourced from a client cookie rather than freshly generated.
  #sessionIDFromCookie = false;
  // The local data is "partial" if it has not been loaded from storage yet and only
  // contains values that have been set or deleted in-memory locally.
  // We do this to avoid the need to block on loading data when it is only being set.
  // When we load the data from storage, we need to merge it with the local partial data,
  // preserving in-memory changes and deletions.
  #partial = true;
  // The driver factory function provided by the pipeline
  #driverFactory;
  static #sharedStorage = /* @__PURE__ */ new Map();
  constructor({
    cookies,
    config,
    runtimeMode,
    driverFactory,
    mockStorage
  }) {
    if (!config) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "No driver was defined in the session configuration and the adapter did not provide a default driver."
        )
      });
    }
    this.#cookies = cookies;
    this.#driverFactory = driverFactory;
    const { cookie: cookieConfig = DEFAULT_COOKIE_NAME, ...configRest } = config;
    let cookieConfigObject;
    if (typeof cookieConfig === "object") {
      const { name = DEFAULT_COOKIE_NAME, ...rest } = cookieConfig;
      this.#cookieName = name;
      cookieConfigObject = rest;
    } else {
      this.#cookieName = cookieConfig || DEFAULT_COOKIE_NAME;
    }
    this.#cookieConfig = {
      sameSite: "lax",
      secure: runtimeMode === "production",
      path: "/",
      ...cookieConfigObject,
      httpOnly: true
    };
    this.#config = configRest;
    if (mockStorage) {
      this.#storage = mockStorage;
    }
  }
  /**
   * Gets a session value. Returns `undefined` if the session or value does not exist.
   */
  async get(key) {
    return (await this.#ensureData()).get(key)?.data;
  }
  /**
   * Checks if a session value exists.
   */
  async has(key) {
    return (await this.#ensureData()).has(key);
  }
  /**
   * Gets all session values.
   */
  async keys() {
    return (await this.#ensureData()).keys();
  }
  /**
   * Gets all session values.
   */
  async values() {
    return [...(await this.#ensureData()).values()].map((entry) => entry.data);
  }
  /**
   * Gets all session entries.
   */
  async entries() {
    return [...(await this.#ensureData()).entries()].map(([key, entry]) => [key, entry.data]);
  }
  /**
   * Deletes a session value.
   */
  delete(key) {
    this.#data?.delete(key);
    if (this.#partial) {
      this.#toDelete.add(key);
    }
    this.#dirty = true;
  }
  /**
   * Sets a session value. The session is created if it does not exist.
   */
  set(key, value, { ttl } = {}) {
    if (!key) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "The session key was not provided."
      });
    }
    let cloned;
    try {
      cloned = unflatten(JSON.parse(stringify(value)));
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageSaveError,
          message: `The session data for ${key} could not be serialized.`,
          hint: "See the devalue library for all supported types: https://github.com/rich-harris/devalue"
        },
        { cause: err }
      );
    }
    if (!this.#cookieSet) {
      this.#setCookie();
      this.#cookieSet = true;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    const lifetime = ttl ?? this.#config.ttl;
    const expires = typeof lifetime === "number" ? Date.now() + lifetime * 1e3 : lifetime;
    this.#data.set(key, {
      data: cloned,
      expires
    });
    this.#dirty = true;
  }
  /**
   * Destroys the session, clearing the cookie and storage if it exists.
   */
  destroy() {
    const sessionId = this.#sessionID ?? this.#cookies.get(this.#cookieName)?.value;
    if (sessionId) {
      this.#toDestroy.add(sessionId);
    }
    this.#cookies.delete(this.#cookieName, this.#cookieConfig);
    this.#sessionID = void 0;
    this.#data = void 0;
    this.#dirty = true;
  }
  /**
   * Regenerates the session, creating a new session ID. The existing session data is preserved.
   */
  async regenerate() {
    let data = /* @__PURE__ */ new Map();
    try {
      data = await this.#ensureData();
    } catch (err) {
      console.error("Failed to load session data during regeneration:", err);
    }
    const oldSessionId = this.#sessionID;
    this.#sessionID = crypto.randomUUID();
    this.#sessionIDFromCookie = false;
    this.#data = data;
    this.#dirty = true;
    await this.#setCookie();
    if (oldSessionId && this.#storage) {
      this.#storage.removeItem(oldSessionId).catch((err) => {
        console.error("Failed to remove old session data:", err);
      });
    }
  }
  // Persists the session data to storage.
  // This is called automatically at the end of the request.
  // Uses a symbol to prevent users from calling it directly.
  async [PERSIST_SYMBOL]() {
    if (!this.#dirty && !this.#toDestroy.size) {
      return;
    }
    const storage = await this.#ensureStorage();
    if (this.#dirty && this.#data) {
      const data = await this.#ensureData();
      this.#toDelete.forEach((key2) => data.delete(key2));
      const key = this.#ensureSessionID();
      let serialized;
      try {
        serialized = stringify(data);
      } catch (err) {
        throw new AstroError(
          {
            ...SessionStorageSaveError,
            message: SessionStorageSaveError.message(
              "The session data could not be serialized.",
              this.#config.driver
            )
          },
          { cause: err }
        );
      }
      await storage.setItem(key, serialized);
      this.#dirty = false;
    }
    if (this.#toDestroy.size > 0) {
      const cleanupPromises = [...this.#toDestroy].map(
        (sessionId) => storage.removeItem(sessionId).catch((err) => {
          console.error(`Failed to clean up session ${sessionId}:`, err);
        })
      );
      await Promise.all(cleanupPromises);
      this.#toDestroy.clear();
    }
  }
  get sessionID() {
    return this.#sessionID;
  }
  /**
   * Loads a session from storage with the given ID, and replaces the current session.
   * Any changes made to the current session will be lost.
   * This is not normally needed, as the session is automatically loaded using the cookie.
   * However it can be used to restore a session where the ID has been recorded somewhere
   * else (e.g. in a database).
   */
  async load(sessionID) {
    this.#sessionID = sessionID;
    this.#data = void 0;
    await this.#setCookie();
    await this.#ensureData();
  }
  /**
   * Sets the session cookie.
   */
  async #setCookie() {
    if (!VALID_COOKIE_REGEX.test(this.#cookieName)) {
      throw new AstroError({
        ...SessionStorageSaveError,
        message: "Invalid cookie name. Cookie names can only contain letters, numbers, and dashes."
      });
    }
    const value = this.#ensureSessionID();
    this.#cookies.set(this.#cookieName, value, this.#cookieConfig);
  }
  /**
   * Attempts to load the session data from storage, or creates a new data object if none exists.
   * If there is existing partial data, it will be merged into the new data object.
   */
  async #ensureData() {
    const storage = await this.#ensureStorage();
    if (this.#data && !this.#partial) {
      return this.#data;
    }
    this.#data ??= /* @__PURE__ */ new Map();
    const raw = await storage.get(this.#ensureSessionID());
    if (!raw) {
      if (this.#sessionIDFromCookie) {
        this.#sessionID = crypto.randomUUID();
        this.#sessionIDFromCookie = false;
        if (this.#cookieSet) {
          await this.#setCookie();
        }
      }
      return this.#data;
    }
    try {
      const storedMap = unflatten(raw);
      if (!(storedMap instanceof Map)) {
        await this.destroy();
        throw new AstroError({
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data was an invalid type.",
            this.#config.driver
          )
        });
      }
      const now = Date.now();
      for (const [key, value] of storedMap) {
        const expired = typeof value.expires === "number" && value.expires < now;
        if (!this.#data.has(key) && !this.#toDelete.has(key) && !expired) {
          this.#data.set(key, value);
        }
      }
      this.#partial = false;
      return this.#data;
    } catch (err) {
      await this.destroy();
      if (err instanceof AstroError) {
        throw err;
      }
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message(
            "The session data could not be parsed.",
            this.#config.driver
          )
        },
        { cause: err }
      );
    }
  }
  /**
   * Returns the session ID, generating a new one if it does not exist.
   */
  #ensureSessionID() {
    if (!this.#sessionID) {
      const cookieValue = this.#cookies.get(this.#cookieName)?.value;
      if (cookieValue) {
        this.#sessionID = cookieValue;
        this.#sessionIDFromCookie = true;
      } else {
        this.#sessionID = crypto.randomUUID();
      }
    }
    return this.#sessionID;
  }
  /**
   * Ensures the storage is initialized.
   * This is called automatically when a storage operation is needed.
   */
  async #ensureStorage() {
    if (this.#storage) {
      return this.#storage;
    }
    if (AstroSession.#sharedStorage.has(this.#config.driver)) {
      this.#storage = AstroSession.#sharedStorage.get(this.#config.driver);
      return this.#storage;
    }
    if (!this.#driverFactory) {
      throw new AstroError({
        ...SessionStorageInitError,
        message: SessionStorageInitError.message(
          "Astro could not load the driver correctly. Does it exist?",
          this.#config.driver
        )
      });
    }
    const driver = this.#driverFactory;
    try {
      this.#storage = createStorage({
        driver: {
          ...driver(this.#config.options),
          // Unused methods
          hasItem() {
            return false;
          },
          getKeys() {
            return [];
          }
        }
      });
      AstroSession.#sharedStorage.set(this.#config.driver, this.#storage);
      return this.#storage;
    } catch (err) {
      throw new AstroError(
        {
          ...SessionStorageInitError,
          message: SessionStorageInitError.message("Unknown error", this.#config.driver)
        },
        { cause: err }
      );
    }
  }
}

function validateAndDecodePathname(pathname) {
  let decoded;
  try {
    decoded = decodeURI(pathname);
  } catch (_e) {
    throw new Error("Invalid URL encoding");
  }
  const hasDecoding = decoded !== pathname;
  const decodedStillHasEncoding = /%[0-9a-fA-F]{2}/.test(decoded);
  if (hasDecoding && decodedStillHasEncoding) {
    throw new Error("Multi-level URL encoding is not allowed");
  }
  return decoded;
}

class RenderContext {
  pipeline;
  locals;
  middleware;
  actions;
  serverIslands;
  // It must be a DECODED pathname
  pathname;
  request;
  routeData;
  status;
  clientAddress;
  cookies;
  params;
  url;
  props;
  partial;
  shouldInjectCspMetaTags;
  session;
  cache;
  skipMiddleware;
  constructor(pipeline, locals, middleware, actions, serverIslands, pathname, request, routeData, status, clientAddress, cookies = new AstroCookies(request), params = getParams(routeData, pathname), url = RenderContext.#createNormalizedUrl(request.url), props = {}, partial = void 0, shouldInjectCspMetaTags = pipeline.manifest.shouldInjectCspMetaTags, session = void 0, cache, skipMiddleware = false) {
    this.pipeline = pipeline;
    this.locals = locals;
    this.middleware = middleware;
    this.actions = actions;
    this.serverIslands = serverIslands;
    this.pathname = pathname;
    this.request = request;
    this.routeData = routeData;
    this.status = status;
    this.clientAddress = clientAddress;
    this.cookies = cookies;
    this.params = params;
    this.url = url;
    this.props = props;
    this.partial = partial;
    this.shouldInjectCspMetaTags = shouldInjectCspMetaTags;
    this.session = session;
    this.cache = cache;
    this.skipMiddleware = skipMiddleware;
  }
  static #createNormalizedUrl(requestUrl) {
    const url = new URL(requestUrl);
    try {
      url.pathname = validateAndDecodePathname(url.pathname);
    } catch {
      try {
        url.pathname = decodeURI(url.pathname);
      } catch {
      }
    }
    url.pathname = collapseDuplicateSlashes(url.pathname);
    return url;
  }
  /**
   * A flag that tells the render content if the rewriting was triggered
   */
  isRewriting = false;
  /**
   * A safety net in case of loops
   */
  counter = 0;
  result = void 0;
  static async create({
    locals = {},
    pathname,
    pipeline,
    request,
    routeData,
    clientAddress,
    status = 200,
    props,
    partial = void 0,
    shouldInjectCspMetaTags,
    skipMiddleware = false
  }) {
    const pipelineMiddleware = await pipeline.getMiddleware();
    const pipelineActions = await pipeline.getActions();
    const pipelineSessionDriver = await pipeline.getSessionDriver();
    const serverIslands = await pipeline.getServerIslands();
    setOriginPathname(
      request,
      pathname,
      pipeline.manifest.trailingSlash,
      pipeline.manifest.buildFormat
    );
    const cookies = new AstroCookies(request);
    const session = pipeline.manifest.sessionConfig && pipelineSessionDriver ? new AstroSession({
      cookies,
      config: pipeline.manifest.sessionConfig,
      runtimeMode: pipeline.runtimeMode,
      driverFactory: pipelineSessionDriver,
      mockStorage: null
    }) : void 0;
    let cache;
    if (!pipeline.cacheConfig) {
      cache = new DisabledAstroCache(pipeline.logger);
    } else if (pipeline.runtimeMode === "development") {
      cache = new NoopAstroCache();
    } else {
      const cacheProvider = await pipeline.getCacheProvider();
      cache = new AstroCache(cacheProvider);
      if (pipeline.cacheConfig?.routes) {
        if (!pipeline.compiledCacheRoutes) {
          pipeline.compiledCacheRoutes = compileCacheRoutes(
            pipeline.cacheConfig.routes,
            pipeline.manifest.base,
            pipeline.manifest.trailingSlash
          );
        }
        const matched = matchCacheRoute(pathname, pipeline.compiledCacheRoutes);
        if (matched) {
          cache.set(matched);
        }
      }
    }
    return new RenderContext(
      pipeline,
      locals,
      sequence(...pipeline.internalMiddleware, pipelineMiddleware),
      pipelineActions,
      serverIslands,
      pathname,
      request,
      routeData,
      status,
      clientAddress,
      cookies,
      void 0,
      void 0,
      props,
      partial,
      shouldInjectCspMetaTags ?? pipeline.manifest.shouldInjectCspMetaTags,
      session,
      cache,
      skipMiddleware
    );
  }
  /**
   * The main function of the RenderContext.
   *
   * Use this function to render any route known to Astro.
   * It attempts to render a route. A route can be a:
   *
   * - page
   * - redirect
   * - endpoint
   * - fallback
   */
  async render(componentInstance, slots = {}) {
    const { middleware, pipeline } = this;
    const { logger, streaming, manifest } = pipeline;
    const props = Object.keys(this.props).length > 0 ? this.props : await getProps({
      mod: componentInstance,
      routeData: this.routeData,
      routeCache: this.pipeline.routeCache,
      pathname: this.pathname,
      logger,
      serverLike: manifest.serverLike,
      base: manifest.base,
      trailingSlash: manifest.trailingSlash
    });
    const actionApiContext = this.createActionAPIContext();
    const apiContext = this.createAPIContext(props, actionApiContext);
    this.counter++;
    if (this.counter === 4) {
      return new Response("Loop Detected", {
        // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/508
        status: 508,
        statusText: "Astro detected a loop where you tried to call the rewriting logic more than four times."
      });
    }
    const lastNext = async (ctx, payload) => {
      if (payload) {
        const oldPathname = this.pathname;
        pipeline.logger.debug("router", "Called rewriting to:", payload);
        const {
          routeData,
          componentInstance: newComponent,
          pathname,
          newUrl
        } = await pipeline.tryRewrite(payload, this.request);
        if (this.pipeline.manifest.serverLike === true && this.routeData.prerender === false && routeData.prerender === true) {
          throw new AstroError({
            ...ForbiddenRewrite,
            message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
            hint: ForbiddenRewrite.hint(routeData.component)
          });
        }
        this.routeData = routeData;
        componentInstance = newComponent;
        if (payload instanceof Request) {
          this.request = payload;
        } else {
          this.request = copyRequest(
            newUrl,
            this.request,
            // need to send the flag of the previous routeData
            routeData.prerender,
            this.pipeline.logger,
            this.routeData.route
          );
        }
        this.isRewriting = true;
        this.url = RenderContext.#createNormalizedUrl(this.request.url);
        this.params = getParams(routeData, pathname);
        this.pathname = pathname;
        this.status = 200;
        setOriginPathname(
          this.request,
          oldPathname,
          this.pipeline.manifest.trailingSlash,
          this.pipeline.manifest.buildFormat
        );
      }
      let response2;
      if (!ctx.isPrerendered && !this.skipMiddleware) {
        const { action, setActionResult, serializeActionResult } = getActionContext(ctx);
        if (action?.calledFrom === "form") {
          const actionResult = await action.handler();
          setActionResult(action.name, serializeActionResult(actionResult));
        }
      }
      switch (this.routeData.type) {
        case "endpoint": {
          response2 = await renderEndpoint(
            componentInstance,
            ctx,
            this.routeData.prerender,
            logger
          );
          break;
        }
        case "redirect":
          return renderRedirect(this);
        case "page": {
          this.result = await this.createResult(componentInstance, actionApiContext);
          try {
            response2 = await renderPage(
              this.result,
              componentInstance?.default,
              props,
              slots,
              streaming,
              this.routeData
            );
          } catch (e) {
            this.result.cancelled = true;
            throw e;
          }
          response2.headers.set(ROUTE_TYPE_HEADER, "page");
          if (this.routeData.route === "/404" || this.routeData.route === "/500") {
            response2.headers.set(REROUTE_DIRECTIVE_HEADER, "no");
          }
          if (this.isRewriting) {
            response2.headers.set(REWRITE_DIRECTIVE_HEADER_KEY, REWRITE_DIRECTIVE_HEADER_VALUE);
          }
          break;
        }
        case "fallback": {
          return new Response(null, { status: 500, headers: { [ROUTE_TYPE_HEADER]: "fallback" } });
        }
      }
      const responseCookies = getCookiesFromResponse(response2);
      if (responseCookies) {
        this.cookies.merge(responseCookies);
      }
      return response2;
    };
    if (isRouteExternalRedirect(this.routeData)) {
      return renderRedirect(this);
    }
    const response = this.skipMiddleware ? await lastNext(apiContext) : await callMiddleware(middleware, apiContext, lastNext);
    if (response.headers.get(ROUTE_TYPE_HEADER)) {
      response.headers.delete(ROUTE_TYPE_HEADER);
    }
    attachCookiesToResponse(response, this.cookies);
    return response;
  }
  createAPIContext(props, context) {
    const redirect = (path, status = 302) => new Response(null, { status, headers: { Location: path } });
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    Reflect.set(context, pipelineSymbol, this.pipeline);
    return Object.assign(context, {
      props,
      redirect,
      rewrite,
      getActionResult: createGetActionResult(context.locals),
      callAction: createCallAction(context)
    });
  }
  async #executeRewrite(reroutePayload) {
    this.pipeline.logger.debug("router", "Calling rewrite: ", reroutePayload);
    const oldPathname = this.pathname;
    const { routeData, componentInstance, newUrl, pathname } = await this.pipeline.tryRewrite(
      reroutePayload,
      this.request
    );
    const isI18nFallback = routeData.fallbackRoutes && routeData.fallbackRoutes.length > 0;
    if (this.pipeline.manifest.serverLike && !this.routeData.prerender && routeData.prerender && !isI18nFallback) {
      throw new AstroError({
        ...ForbiddenRewrite,
        message: ForbiddenRewrite.message(this.pathname, pathname, routeData.component),
        hint: ForbiddenRewrite.hint(routeData.component)
      });
    }
    this.routeData = routeData;
    if (reroutePayload instanceof Request) {
      this.request = reroutePayload;
    } else {
      this.request = copyRequest(
        newUrl,
        this.request,
        // need to send the flag of the previous routeData
        routeData.prerender,
        this.pipeline.logger,
        this.routeData.route
      );
    }
    this.url = RenderContext.#createNormalizedUrl(this.request.url);
    const newCookies = new AstroCookies(this.request);
    if (this.cookies) {
      newCookies.merge(this.cookies);
    }
    this.cookies = newCookies;
    this.params = getParams(routeData, pathname);
    this.pathname = pathname;
    this.isRewriting = true;
    this.status = 200;
    setOriginPathname(
      this.request,
      oldPathname,
      this.pipeline.manifest.trailingSlash,
      this.pipeline.manifest.buildFormat
    );
    return await this.render(componentInstance);
  }
  createActionAPIContext() {
    const renderContext = this;
    const { params, pipeline, url } = this;
    return {
      // Don't allow reassignment of cookies because it doesn't work
      get cookies() {
        return renderContext.cookies;
      },
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      get clientAddress() {
        return renderContext.getClientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      generator: ASTRO_GENERATOR,
      get locals() {
        return renderContext.locals;
      },
      set locals(_) {
        throw new AstroError(LocalsReassigned);
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      request: this.request,
      site: pipeline.site,
      url,
      get originPathname() {
        return getOriginPathname(renderContext.request);
      },
      get session() {
        if (this.isPrerendered) {
          pipeline.logger.warn(
            "session",
            `context.session was used when rendering the route ${colors.green(this.routePattern)}, but it is not available on prerendered routes. If you need access to sessions, make sure that the route is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your routes server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        if (!renderContext.session) {
          pipeline.logger.warn(
            "session",
            `context.session was used when rendering the route ${colors.green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        return renderContext.session;
      },
      get cache() {
        return renderContext.cache;
      },
      get csp() {
        if (!pipeline.manifest.csp) {
          if (pipeline.runtimeMode === "production") {
            pipeline.logger.warn(
              "csp",
              `context.csp was used when rendering the route ${colors.green(this.routePattern)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/experimental-flags/csp/`
            );
          }
          return void 0;
        }
        return {
          insertDirective(payload) {
            if (renderContext?.result?.directives) {
              renderContext.result.directives = pushDirective(
                renderContext.result.directives,
                payload
              );
            } else {
              renderContext?.result?.directives.push(payload);
            }
          },
          insertScriptResource(resource) {
            renderContext.result?.scriptResources.push(resource);
          },
          insertStyleResource(resource) {
            renderContext.result?.styleResources.push(resource);
          },
          insertStyleHash(hash) {
            renderContext.result?.styleHashes.push(hash);
          },
          insertScriptHash(hash) {
            renderContext.result?.scriptHashes.push(hash);
          }
        };
      }
    };
  }
  async createResult(mod, ctx) {
    const { cookies, pathname, pipeline, routeData, status } = this;
    const { clientDirectives, inlinedScripts, compressHTML, manifest, renderers, resolve } = pipeline;
    const { links, scripts, styles } = await pipeline.headElements(routeData);
    const extraStyleHashes = [];
    const extraScriptHashes = [];
    const shouldInjectCspMetaTags = this.shouldInjectCspMetaTags;
    const cspAlgorithm = manifest.csp?.algorithm ?? "SHA-256";
    if (shouldInjectCspMetaTags) {
      for (const style of styles) {
        extraStyleHashes.push(await generateCspDigest(style.children, cspAlgorithm));
      }
      for (const script of scripts) {
        extraScriptHashes.push(await generateCspDigest(script.children, cspAlgorithm));
      }
    }
    const componentMetadata = await pipeline.componentMetadata(routeData) ?? manifest.componentMetadata;
    const headers = new Headers({ "Content-Type": "text/html" });
    const partial = typeof this.partial === "boolean" ? this.partial : Boolean(mod.partial);
    const actionResult = hasActionPayload(this.locals) ? deserializeActionResult(this.locals._actionPayload.actionResult) : void 0;
    const response = {
      status: actionResult?.error ? actionResult?.error.status : status,
      statusText: actionResult?.error ? actionResult?.error.type : "OK",
      get headers() {
        return headers;
      },
      // Disallow `Astro.response.headers = new Headers`
      set headers(_) {
        throw new AstroError(AstroResponseHeadersReassigned);
      }
    };
    const result = {
      base: manifest.base,
      userAssetsBase: manifest.userAssetsBase,
      cancelled: false,
      clientDirectives,
      inlinedScripts,
      componentMetadata,
      compressHTML,
      cookies,
      /** This function returns the `Astro` faux-global */
      createAstro: (props, slots) => this.createAstro(result, props, slots, ctx),
      links,
      params: this.params,
      partial,
      pathname,
      renderers,
      resolve,
      response,
      request: this.request,
      scripts,
      styles,
      actionResult,
      serverIslandNameMap: this.serverIslands.serverIslandNameMap ?? /* @__PURE__ */ new Map(),
      key: manifest.key,
      trailingSlash: manifest.trailingSlash,
      _experimentalQueuedRendering: {
        pool: pipeline.nodePool,
        htmlStringCache: pipeline.htmlStringCache,
        enabled: manifest.experimentalQueuedRendering?.enabled,
        poolSize: manifest.experimentalQueuedRendering?.poolSize,
        contentCache: manifest.experimentalQueuedRendering?.contentCache
      },
      _metadata: {
        hasHydrationScript: false,
        rendererSpecificHydrationScripts: /* @__PURE__ */ new Set(),
        hasRenderedHead: false,
        renderedScripts: /* @__PURE__ */ new Set(),
        hasDirectives: /* @__PURE__ */ new Set(),
        hasRenderedServerIslandRuntime: false,
        headInTree: false,
        extraHead: [],
        extraStyleHashes,
        extraScriptHashes,
        propagators: /* @__PURE__ */ new Set()
      },
      cspDestination: manifest.csp?.cspDestination ?? (routeData.prerender ? "meta" : "header"),
      shouldInjectCspMetaTags,
      cspAlgorithm,
      // The following arrays must be cloned; otherwise, they become mutable across routes.
      scriptHashes: manifest.csp?.scriptHashes ? [...manifest.csp.scriptHashes] : [],
      scriptResources: manifest.csp?.scriptResources ? [...manifest.csp.scriptResources] : [],
      styleHashes: manifest.csp?.styleHashes ? [...manifest.csp.styleHashes] : [],
      styleResources: manifest.csp?.styleResources ? [...manifest.csp.styleResources] : [],
      directives: manifest.csp?.directives ? [...manifest.csp.directives] : [],
      isStrictDynamic: manifest.csp?.isStrictDynamic ?? false,
      internalFetchHeaders: manifest.internalFetchHeaders
    };
    return result;
  }
  #astroPagePartial;
  /**
   * The Astro global is sourced in 3 different phases:
   * - **Static**: `.generator` and `.glob` is printed by the compiler, instantiated once per process per astro file
   * - **Page-level**: `.request`, `.cookies`, `.locals` etc. These remain the same for the duration of the request.
   * - **Component-level**: `.props`, `.slots`, and `.self` are unique to each _use_ of each component.
   *
   * The page level partial is used as the prototype of the user-visible `Astro` global object, which is instantiated once per use of a component.
   */
  createAstro(result, props, slotValues, apiContext) {
    let astroPagePartial;
    if (this.isRewriting) {
      astroPagePartial = this.#astroPagePartial = this.createAstroPagePartial(result, apiContext);
    } else {
      astroPagePartial = this.#astroPagePartial ??= this.createAstroPagePartial(result, apiContext);
    }
    const astroComponentPartial = { props, self: null };
    const Astro = Object.assign(
      Object.create(astroPagePartial),
      astroComponentPartial
    );
    let _slots;
    Object.defineProperty(Astro, "slots", {
      get: () => {
        if (!_slots) {
          _slots = new Slots(
            result,
            slotValues,
            this.pipeline.logger
          );
        }
        return _slots;
      }
    });
    return Astro;
  }
  createAstroPagePartial(result, apiContext) {
    const renderContext = this;
    const { cookies, locals, params, pipeline, url } = this;
    const { response } = result;
    const redirect = (path, status = 302) => {
      if (this.request[responseSentSymbol$1]) {
        throw new AstroError({
          ...ResponseSentError
        });
      }
      return new Response(null, { status, headers: { Location: path } });
    };
    const rewrite = async (reroutePayload) => {
      return await this.#executeRewrite(reroutePayload);
    };
    const callAction = createCallAction(apiContext);
    return {
      generator: ASTRO_GENERATOR,
      routePattern: this.routeData.route,
      isPrerendered: this.routeData.prerender,
      cookies,
      get session() {
        if (this.isPrerendered) {
          pipeline.logger.warn(
            "session",
            `Astro.session was used when rendering the route ${colors.green(this.routePattern)}, but it is not available on prerendered pages. If you need access to sessions, make sure that the page is server-rendered using \`export const prerender = false;\` or by setting \`output\` to \`"server"\` in your Astro config to make all your pages server-rendered by default. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        if (!renderContext.session) {
          pipeline.logger.warn(
            "session",
            `Astro.session was used when rendering the route ${colors.green(this.routePattern)}, but no storage configuration was provided. Either configure the storage manually or use an adapter that provides session storage. For more information, see https://docs.astro.build/en/guides/sessions/`
          );
          return void 0;
        }
        return renderContext.session;
      },
      get cache() {
        return renderContext.cache;
      },
      get clientAddress() {
        return renderContext.getClientAddress();
      },
      get currentLocale() {
        return renderContext.computeCurrentLocale();
      },
      params,
      get preferredLocale() {
        return renderContext.computePreferredLocale();
      },
      get preferredLocaleList() {
        return renderContext.computePreferredLocaleList();
      },
      locals,
      redirect,
      rewrite,
      request: this.request,
      response,
      site: pipeline.site,
      getActionResult: createGetActionResult(locals),
      get callAction() {
        return callAction;
      },
      url,
      get originPathname() {
        return getOriginPathname(renderContext.request);
      },
      get csp() {
        if (!pipeline.manifest.csp) {
          if (pipeline.runtimeMode === "production") {
            pipeline.logger.warn(
              "csp",
              `Astro.csp was used when rendering the route ${colors.green(this.routePattern)}, but CSP was not configured. For more information, see https://docs.astro.build/en/reference/experimental-flags/csp/`
            );
          }
          return void 0;
        }
        return {
          insertDirective(payload) {
            if (renderContext?.result?.directives) {
              renderContext.result.directives = pushDirective(
                renderContext.result.directives,
                payload
              );
            } else {
              renderContext?.result?.directives.push(payload);
            }
          },
          insertScriptResource(resource) {
            renderContext.result?.scriptResources.push(resource);
          },
          insertStyleResource(resource) {
            renderContext.result?.styleResources.push(resource);
          },
          insertStyleHash(hash) {
            renderContext.result?.styleHashes.push(hash);
          },
          insertScriptHash(hash) {
            renderContext.result?.scriptHashes.push(hash);
          }
        };
      }
    };
  }
  getClientAddress() {
    const { pipeline, routeData, clientAddress } = this;
    if (routeData.prerender) {
      throw new AstroError({
        ...PrerenderClientAddressNotAvailable,
        message: PrerenderClientAddressNotAvailable.message(routeData.component)
      });
    }
    if (clientAddress) {
      return clientAddress;
    }
    if (pipeline.adapterName) {
      throw new AstroError({
        ...ClientAddressNotAvailable,
        message: ClientAddressNotAvailable.message(pipeline.adapterName)
      });
    }
    throw new AstroError(StaticClientAddressNotAvailable);
  }
  /**
   * API Context may be created multiple times per request, i18n data needs to be computed only once.
   * So, it is computed and saved here on creation of the first APIContext and reused for later ones.
   */
  #currentLocale;
  computeCurrentLocale() {
    const {
      url,
      pipeline: { i18n },
      routeData
    } = this;
    if (!i18n) return;
    const { defaultLocale, locales, strategy } = i18n;
    const fallbackTo = strategy === "pathname-prefix-other-locales" || strategy === "domains-prefix-other-locales" ? defaultLocale : void 0;
    if (this.#currentLocale) {
      return this.#currentLocale;
    }
    let computedLocale;
    if (isRouteServerIsland(routeData)) {
      let referer = this.request.headers.get("referer");
      if (referer) {
        if (URL.canParse(referer)) {
          referer = new URL(referer).pathname;
        }
        computedLocale = computeCurrentLocale(referer, locales, defaultLocale);
      }
    } else {
      let pathname = routeData.pathname;
      if (!routeData.pattern.test(url.pathname)) {
        for (const fallbackRoute of routeData.fallbackRoutes) {
          if (fallbackRoute.pattern.test(url.pathname)) {
            pathname = fallbackRoute.pathname;
            break;
          }
        }
      }
      pathname = pathname && !isRoute404or500(routeData) ? pathname : url.pathname;
      computedLocale = computeCurrentLocale(pathname, locales, defaultLocale);
      if (routeData.params.length > 0) {
        const localeFromParams = computeCurrentLocaleFromParams(this.params, locales);
        if (localeFromParams) {
          computedLocale = localeFromParams;
        }
      }
    }
    this.#currentLocale = computedLocale ?? fallbackTo;
    return this.#currentLocale;
  }
  #preferredLocale;
  computePreferredLocale() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocale ??= computePreferredLocale(request, i18n.locales);
  }
  #preferredLocaleList;
  computePreferredLocaleList() {
    const {
      pipeline: { i18n },
      request
    } = this;
    if (!i18n) return;
    return this.#preferredLocaleList ??= computePreferredLocaleList(request, i18n.locales);
  }
}

function redirectTemplate({
  status,
  absoluteLocation,
  relativeLocation,
  from
}) {
  const delay = status === 302 ? 2 : 0;
  return `<!doctype html>
<title>Redirecting to: ${relativeLocation}</title>
<meta http-equiv="refresh" content="${delay};url=${relativeLocation}">
<meta name="robots" content="noindex">
<link rel="canonical" href="${absoluteLocation}">
<body>
	<a href="${relativeLocation}">Redirecting ${from ? `from <code>${from}</code> ` : ""}to <code>${relativeLocation}</code></a>
</body>`;
}

function ensure404Route(manifest) {
  if (!manifest.routes.some((route) => route.route === "/404")) {
    manifest.routes.push(DEFAULT_404_ROUTE);
  }
  return manifest;
}

class Router {
  #routes;
  #base;
  #baseWithoutTrailingSlash;
  #buildFormat;
  #trailingSlash;
  constructor(routes, options) {
    this.#routes = [...routes].sort(routeComparator);
    this.#base = normalizeBase(options.base);
    this.#baseWithoutTrailingSlash = removeTrailingForwardSlash(this.#base);
    this.#buildFormat = options.buildFormat;
    this.#trailingSlash = options.trailingSlash;
  }
  /**
   * Match an input pathname against the route list.
   * If allowWithoutBase is true, a non-base-prefixed path is still considered.
   */
  match(inputPathname, { allowWithoutBase = false } = {}) {
    const normalized = getRedirectForPathname(inputPathname);
    if (normalized.redirect) {
      return { type: "redirect", location: normalized.redirect, status: 301 };
    }
    if (this.#base !== "/") {
      const baseWithSlash = `${this.#baseWithoutTrailingSlash}/`;
      if (this.#trailingSlash === "always" && (normalized.pathname === this.#baseWithoutTrailingSlash || normalized.pathname === this.#base)) {
        return { type: "redirect", location: baseWithSlash, status: 301 };
      }
      if (this.#trailingSlash === "never" && normalized.pathname === baseWithSlash) {
        return { type: "redirect", location: this.#baseWithoutTrailingSlash, status: 301 };
      }
    }
    const baseResult = stripBase(
      normalized.pathname,
      this.#base,
      this.#baseWithoutTrailingSlash,
      this.#trailingSlash
    );
    if (!baseResult) {
      if (!allowWithoutBase) {
        return { type: "none", reason: "outside-base" };
      }
    }
    let pathname = baseResult ?? normalized.pathname;
    if (this.#buildFormat === "file") {
      pathname = normalizeFileFormatPathname(pathname);
    }
    const route = this.#routes.find((candidate) => {
      if (candidate.pattern.test(pathname)) return true;
      return candidate.fallbackRoutes.some((fallbackRoute) => fallbackRoute.pattern.test(pathname));
    });
    if (!route) {
      return { type: "none", reason: "no-match" };
    }
    const params = getParams(route, pathname);
    return { type: "match", route, params, pathname };
  }
}
function normalizeBase(base) {
  if (!base) return "/";
  if (base === "/") return base;
  return prependForwardSlash(base);
}
function getRedirectForPathname(pathname) {
  let value = prependForwardSlash(pathname);
  if (value.startsWith("//")) {
    const collapsed = `/${value.replace(/^\/+/, "")}`;
    return { pathname: value, redirect: collapsed };
  }
  return { pathname: value };
}
function stripBase(pathname, base, baseWithoutTrailingSlash, trailingSlash) {
  if (base === "/") return pathname;
  const baseWithSlash = `${baseWithoutTrailingSlash}/`;
  if (pathname === baseWithoutTrailingSlash || pathname === base) {
    return trailingSlash === "always" ? null : "/";
  }
  if (pathname === baseWithSlash) {
    return trailingSlash === "never" ? null : "/";
  }
  if (pathname.startsWith(baseWithSlash)) {
    return pathname.slice(baseWithoutTrailingSlash.length);
  }
  return null;
}
function normalizeFileFormatPathname(pathname) {
  if (pathname.endsWith("/index.html")) {
    const trimmed = pathname.slice(0, -"/index.html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  if (pathname.endsWith(".html")) {
    const trimmed = pathname.slice(0, -".html".length);
    return trimmed === "" ? "/" : trimmed;
  }
  return pathname;
}

class BaseApp {
  manifest;
  manifestData;
  pipeline;
  adapterLogger;
  baseWithoutTrailingSlash;
  logger;
  #router;
  constructor(manifest, streaming = true, ...args) {
    this.manifest = manifest;
    this.manifestData = { routes: manifest.routes.map((route) => route.routeData) };
    this.baseWithoutTrailingSlash = removeTrailingForwardSlash(manifest.base);
    this.pipeline = this.createPipeline(streaming, manifest, ...args);
    this.logger = new Logger({
      dest: consoleLogDestination,
      level: manifest.logLevel
    });
    this.adapterLogger = new AstroIntegrationLogger(this.logger.options, manifest.adapterName);
    ensure404Route(this.manifestData);
    this.#router = this.createRouter(this.manifestData);
  }
  async createRenderContext(payload) {
    return RenderContext.create(payload);
  }
  getAdapterLogger() {
    return this.adapterLogger;
  }
  getAllowedDomains() {
    return this.manifest.allowedDomains;
  }
  matchesAllowedDomains(forwardedHost, protocol) {
    return BaseApp.validateForwardedHost(forwardedHost, this.manifest.allowedDomains, protocol);
  }
  static validateForwardedHost(forwardedHost, allowedDomains, protocol) {
    if (!allowedDomains || allowedDomains.length === 0) {
      return false;
    }
    try {
      const testUrl = new URL(`${protocol || "https"}://${forwardedHost}`);
      return allowedDomains.some((pattern) => {
        return matchPattern(testUrl, pattern);
      });
    } catch {
      return false;
    }
  }
  set setManifestData(newManifestData) {
    this.manifestData = newManifestData;
    this.#router = this.createRouter(this.manifestData);
  }
  removeBase(pathname) {
    pathname = collapseDuplicateLeadingSlashes(pathname);
    if (pathname.startsWith(this.manifest.base)) {
      return pathname.slice(this.baseWithoutTrailingSlash.length + 1);
    }
    return pathname;
  }
  /**
   * It removes the base from the request URL, prepends it with a forward slash and attempts to decoded it.
   *
   * If the decoding fails, it logs the error and return the pathname as is.
   * @param request
   */
  getPathnameFromRequest(request) {
    const url = new URL(request.url);
    const pathname = prependForwardSlash(this.removeBase(url.pathname));
    try {
      return decodeURI(pathname);
    } catch (e) {
      this.getAdapterLogger().error(e.toString());
      return pathname;
    }
  }
  /**
   * Given a `Request`, it returns the `RouteData` that matches its `pathname`. By default, prerendered
   * routes aren't returned, even if they are matched.
   *
   * When `allowPrerenderedRoutes` is `true`, the function returns matched prerendered routes too.
   * @param request
   * @param allowPrerenderedRoutes
   */
  match(request, allowPrerenderedRoutes = false) {
    const url = new URL(request.url);
    if (this.manifest.assets.has(url.pathname)) return void 0;
    let pathname = this.computePathnameFromDomain(request);
    if (!pathname) {
      pathname = prependForwardSlash(this.removeBase(url.pathname));
    }
    const match = this.#router.match(decodeURI(pathname), { allowWithoutBase: true });
    if (match.type !== "match") return void 0;
    const routeData = match.route;
    if (allowPrerenderedRoutes) {
      return routeData;
    } else if (routeData.prerender) {
      return void 0;
    }
    return routeData;
  }
  createRouter(manifestData) {
    return new Router(manifestData.routes, {
      base: this.manifest.base,
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat
    });
  }
  /**
   * A matching route function to use in the development server.
   * Contrary to the `.match` function, this function resolves props and params, returning the correct
   * route based on the priority, segments. It also returns the correct, resolved pathname.
   * @param pathname
   */
  devMatch(pathname) {
    return void 0;
  }
  computePathnameFromDomain(request) {
    let pathname = void 0;
    const url = new URL(request.url);
    if (this.manifest.i18n && (this.manifest.i18n.strategy === "domains-prefix-always" || this.manifest.i18n.strategy === "domains-prefix-other-locales" || this.manifest.i18n.strategy === "domains-prefix-always-no-redirect")) {
      let host = request.headers.get("X-Forwarded-Host");
      let protocol = request.headers.get("X-Forwarded-Proto");
      if (protocol) {
        protocol = protocol + ":";
      } else {
        protocol = url.protocol;
      }
      if (!host) {
        host = request.headers.get("Host");
      }
      if (host && protocol) {
        host = host.split(":")[0];
        try {
          let locale;
          const hostAsUrl = new URL(`${protocol}//${host}`);
          for (const [domainKey, localeValue] of Object.entries(
            this.manifest.i18n.domainLookupTable
          )) {
            const domainKeyAsUrl = new URL(domainKey);
            if (hostAsUrl.host === domainKeyAsUrl.host && hostAsUrl.protocol === domainKeyAsUrl.protocol) {
              locale = localeValue;
              break;
            }
          }
          if (locale) {
            pathname = prependForwardSlash(
              joinPaths(normalizeTheLocale(locale), this.removeBase(url.pathname))
            );
            if (url.pathname.endsWith("/")) {
              pathname = appendForwardSlash(pathname);
            }
          }
        } catch (e) {
          this.logger.error(
            "router",
            `Astro tried to parse ${protocol}//${host} as an URL, but it threw a parsing error. Check the X-Forwarded-Host and X-Forwarded-Proto headers.`
          );
          this.logger.error("router", `Error: ${e}`);
        }
      }
    }
    return pathname;
  }
  redirectTrailingSlash(pathname) {
    const { trailingSlash } = this.manifest;
    if (pathname === "/" || isInternalPath(pathname)) {
      return pathname;
    }
    const path = collapseDuplicateTrailingSlashes(pathname, trailingSlash !== "never");
    if (path !== pathname) {
      return path;
    }
    if (trailingSlash === "ignore") {
      return pathname;
    }
    if (trailingSlash === "always" && !hasFileExtension(pathname)) {
      return appendForwardSlash(pathname);
    }
    if (trailingSlash === "never") {
      return removeTrailingForwardSlash(pathname);
    }
    return pathname;
  }
  async render(request, {
    addCookieHeader = false,
    clientAddress = Reflect.get(request, clientAddressSymbol),
    locals,
    prerenderedErrorPageFetch = fetch,
    routeData
  } = {}) {
    const timeStart = performance.now();
    const url = new URL(request.url);
    const redirect = this.redirectTrailingSlash(url.pathname);
    if (redirect !== url.pathname) {
      const status = request.method === "GET" ? 301 : 308;
      const response2 = new Response(
        redirectTemplate({
          status,
          relativeLocation: url.pathname,
          absoluteLocation: redirect,
          from: request.url
        }),
        {
          status,
          headers: {
            location: redirect + url.search
          }
        }
      );
      this.#prepareResponse(response2, { addCookieHeader });
      return response2;
    }
    if (routeData) {
      this.logger.debug(
        "router",
        "The adapter " + this.manifest.adapterName + " provided a custom RouteData for ",
        request.url
      );
      this.logger.debug("router", "RouteData");
      this.logger.debug("router", routeData);
    }
    const resolvedRenderOptions = {
      addCookieHeader,
      clientAddress,
      prerenderedErrorPageFetch,
      locals,
      routeData
    };
    if (locals) {
      if (typeof locals !== "object") {
        const error = new AstroError(LocalsNotAnObject);
        this.logger.error(null, error.stack);
        return this.renderError(request, {
          ...resolvedRenderOptions,
          // If locals are invalid, we don't want to include them when
          // rendering the error page
          locals: void 0,
          status: 500,
          error
        });
      }
    }
    if (!routeData) {
      if (this.isDev()) {
        const result = await this.devMatch(this.getPathnameFromRequest(request));
        if (result) {
          routeData = result.routeData;
        }
      } else {
        routeData = this.match(request);
      }
      this.logger.debug("router", "Astro matched the following route for " + request.url);
      this.logger.debug("router", "RouteData:\n" + routeData);
    }
    if (!routeData) {
      routeData = this.manifestData.routes.find(
        (route) => route.component === "404.astro" || route.component === DEFAULT_404_COMPONENT
      );
    }
    if (!routeData) {
      this.logger.debug("router", "Astro hasn't found routes that match " + request.url);
      this.logger.debug("router", "Here's the available routes:\n", this.manifestData);
      return this.renderError(request, {
        ...resolvedRenderOptions,
        status: 404
      });
    }
    let pathname = this.getPathnameFromRequest(request);
    if (this.isDev() && !routeHasHtmlExtension(routeData)) {
      pathname = pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
    }
    const defaultStatus = this.getDefaultStatusCode(routeData, pathname);
    let response;
    let session;
    let cache;
    try {
      const componentInstance = await this.pipeline.getComponentByRoute(routeData);
      const renderContext = await this.createRenderContext({
        pipeline: this.pipeline,
        locals,
        pathname,
        request,
        routeData,
        status: defaultStatus,
        clientAddress
      });
      session = renderContext.session;
      cache = renderContext.cache;
      if (this.pipeline.cacheProvider) {
        const cacheProvider = await this.pipeline.getCacheProvider();
        if (cacheProvider?.onRequest) {
          response = await cacheProvider.onRequest(
            {
              request,
              url: new URL(request.url)
            },
            async () => {
              const res = await renderContext.render(componentInstance);
              applyCacheHeaders(cache, res);
              return res;
            }
          );
          response.headers.delete("CDN-Cache-Control");
          response.headers.delete("Cache-Tag");
        } else {
          response = await renderContext.render(componentInstance);
          applyCacheHeaders(cache, response);
        }
      } else {
        response = await renderContext.render(componentInstance);
      }
      const isRewrite = response.headers.has(REWRITE_DIRECTIVE_HEADER_KEY);
      this.logThisRequest({
        pathname,
        method: request.method,
        statusCode: response.status,
        isRewrite,
        timeStart
      });
    } catch (err) {
      this.logger.error(null, err.stack || err.message || String(err));
      return this.renderError(request, {
        ...resolvedRenderOptions,
        status: 500,
        error: err
      });
    } finally {
      await session?.[PERSIST_SYMBOL]();
    }
    if (REROUTABLE_STATUS_CODES.includes(response.status) && // If the body isn't null, that means the user sets the 404 status
    // but uses the current route to handle the 404
    response.body === null && response.headers.get(REROUTE_DIRECTIVE_HEADER) !== "no") {
      return this.renderError(request, {
        ...resolvedRenderOptions,
        response,
        status: response.status,
        // We don't have an error to report here. Passing null means we pass nothing intentionally
        // while undefined means there's no error
        error: response.status === 500 ? null : void 0
      });
    }
    this.#prepareResponse(response, { addCookieHeader });
    return response;
  }
  #prepareResponse(response, { addCookieHeader }) {
    for (const headerName of [
      REROUTE_DIRECTIVE_HEADER,
      REWRITE_DIRECTIVE_HEADER_KEY,
      NOOP_MIDDLEWARE_HEADER,
      ROUTE_TYPE_HEADER
    ]) {
      if (response.headers.has(headerName)) {
        response.headers.delete(headerName);
      }
    }
    if (addCookieHeader) {
      for (const setCookieHeaderValue of getSetCookiesFromResponse(response)) {
        response.headers.append("set-cookie", setCookieHeaderValue);
      }
    }
    Reflect.set(response, responseSentSymbol$1, true);
  }
  setCookieHeaders(response) {
    return getSetCookiesFromResponse(response);
  }
  /**
   * Reads all the cookies written by `Astro.cookie.set()` onto the passed response.
   * For example,
   * ```ts
   * for (const cookie_ of App.getSetCookieFromResponse(response)) {
   *     const cookie: string = cookie_
   * }
   * ```
   * @param response The response to read cookies from.
   * @returns An iterator that yields key-value pairs as equal-sign-separated strings.
   */
  static getSetCookieFromResponse = getSetCookiesFromResponse;
  /**
   * If it is a known error code, try sending the according page (e.g. 404.astro / 500.astro).
   * This also handles pre-rendered /404 or /500 routes
   */
  async renderError(request, {
    status,
    response: originalResponse,
    skipMiddleware = false,
    error,
    ...resolvedRenderOptions
  }) {
    const errorRoutePath = `/${status}${this.manifest.trailingSlash === "always" ? "/" : ""}`;
    const errorRouteData = matchRoute(errorRoutePath, this.manifestData);
    const url = new URL(request.url);
    if (errorRouteData) {
      if (errorRouteData.prerender) {
        const maybeDotHtml = errorRouteData.route.endsWith(`/${status}`) ? ".html" : "";
        const statusURL = new URL(`${this.baseWithoutTrailingSlash}/${status}${maybeDotHtml}`, url);
        if (statusURL.toString() !== request.url && resolvedRenderOptions.prerenderedErrorPageFetch) {
          const response2 = await resolvedRenderOptions.prerenderedErrorPageFetch(
            statusURL.toString()
          );
          const override = { status, removeContentEncodingHeaders: true };
          const newResponse = this.mergeResponses(response2, originalResponse, override);
          this.#prepareResponse(newResponse, resolvedRenderOptions);
          return newResponse;
        }
      }
      const mod = await this.pipeline.getComponentByRoute(errorRouteData);
      let session;
      try {
        const renderContext = await this.createRenderContext({
          locals: resolvedRenderOptions.locals,
          pipeline: this.pipeline,
          skipMiddleware,
          pathname: this.getPathnameFromRequest(request),
          request,
          routeData: errorRouteData,
          status,
          props: { error },
          clientAddress: resolvedRenderOptions.clientAddress
        });
        session = renderContext.session;
        const response2 = await renderContext.render(mod);
        const newResponse = this.mergeResponses(response2, originalResponse);
        this.#prepareResponse(newResponse, resolvedRenderOptions);
        return newResponse;
      } catch {
        if (skipMiddleware === false) {
          return this.renderError(request, {
            ...resolvedRenderOptions,
            status,
            response: originalResponse,
            skipMiddleware: true
          });
        }
      } finally {
        await session?.[PERSIST_SYMBOL]();
      }
    }
    const response = this.mergeResponses(new Response(null, { status }), originalResponse);
    this.#prepareResponse(response, resolvedRenderOptions);
    return response;
  }
  mergeResponses(newResponse, originalResponse, override) {
    let newResponseHeaders = newResponse.headers;
    if (override?.removeContentEncodingHeaders) {
      newResponseHeaders = new Headers(newResponseHeaders);
      newResponseHeaders.delete("Content-Encoding");
      newResponseHeaders.delete("Content-Length");
    }
    if (!originalResponse) {
      if (override !== void 0) {
        return new Response(newResponse.body, {
          status: override.status,
          statusText: newResponse.statusText,
          headers: newResponseHeaders
        });
      }
      return newResponse;
    }
    const status = override?.status ? override.status : originalResponse.status === 200 ? newResponse.status : originalResponse.status;
    try {
      originalResponse.headers.delete("Content-type");
      originalResponse.headers.delete("Content-Length");
      originalResponse.headers.delete("Transfer-Encoding");
    } catch {
    }
    const newHeaders = new Headers();
    const seen = /* @__PURE__ */ new Set();
    for (const [name, value] of originalResponse.headers) {
      newHeaders.append(name, value);
      seen.add(name.toLowerCase());
    }
    for (const [name, value] of newResponseHeaders) {
      if (!seen.has(name.toLowerCase())) {
        newHeaders.append(name, value);
      }
    }
    const mergedResponse = new Response(newResponse.body, {
      status,
      statusText: status === 200 ? newResponse.statusText : originalResponse.statusText,
      // If you're looking at here for possible bugs, it means that it's not a bug.
      // With the middleware, users can meddle with headers, and we should pass to the 404/500.
      // If users see something weird, it's because they are setting some headers they should not.
      //
      // Although, we don't want it to replace the content-type, because the error page must return `text/html`
      headers: newHeaders
    });
    const originalCookies = getCookiesFromResponse(originalResponse);
    const newCookies = getCookiesFromResponse(newResponse);
    if (originalCookies) {
      if (newCookies) {
        for (const cookieValue of AstroCookies.consume(newCookies)) {
          originalResponse.headers.append("set-cookie", cookieValue);
        }
      }
      attachCookiesToResponse(mergedResponse, originalCookies);
    } else if (newCookies) {
      attachCookiesToResponse(mergedResponse, newCookies);
    }
    return mergedResponse;
  }
  getDefaultStatusCode(routeData, pathname) {
    if (!routeData.pattern.test(pathname)) {
      for (const fallbackRoute of routeData.fallbackRoutes) {
        if (fallbackRoute.pattern.test(pathname)) {
          return 302;
        }
      }
    }
    const route = removeTrailingForwardSlash(routeData.route);
    if (route.endsWith("/404")) return 404;
    if (route.endsWith("/500")) return 500;
    return 200;
  }
  getManifest() {
    return this.pipeline.manifest;
  }
  logThisRequest({
    pathname,
    method,
    statusCode,
    isRewrite,
    timeStart
  }) {
    const timeEnd = performance.now();
    this.logRequest({
      pathname,
      method,
      statusCode,
      isRewrite,
      reqTime: timeEnd - timeStart
    });
  }
}

function getAssetsPrefix(fileExtension, assetsPrefix) {
  let prefix = "";
  if (!assetsPrefix) {
    prefix = "";
  } else if (typeof assetsPrefix === "string") {
    prefix = assetsPrefix;
  } else {
    const dotLessFileExtension = fileExtension.slice(1);
    prefix = assetsPrefix[dotLessFileExtension] || assetsPrefix.fallback;
  }
  return prefix;
}

const URL_PARSE_BASE = "https://astro.build";
function splitAssetPath(path) {
  const parsed = new URL(path, URL_PARSE_BASE);
  const isAbsolute = URL.canParse(path);
  const pathname = !isAbsolute && !path.startsWith("/") ? parsed.pathname.slice(1) : parsed.pathname;
  return {
    pathname,
    suffix: `${parsed.search}${parsed.hash}`
  };
}
function createAssetLink(href, base, assetsPrefix, queryParams) {
  const { pathname, suffix } = splitAssetPath(href);
  let url = "";
  if (assetsPrefix) {
    const pf = getAssetsPrefix(fileExtension(pathname), assetsPrefix);
    url = joinPaths(pf, slash(pathname)) + suffix;
  } else if (base) {
    url = prependForwardSlash(joinPaths(base, slash(pathname))) + suffix;
  } else {
    url = href;
  }
  return url;
}
function createStylesheetElement(stylesheet, base, assetsPrefix, queryParams) {
  if (stylesheet.type === "inline") {
    return {
      props: {},
      children: stylesheet.content
    };
  } else {
    return {
      props: {
        rel: "stylesheet",
        href: createAssetLink(stylesheet.src, base, assetsPrefix)
      },
      children: ""
    };
  }
}
function createStylesheetElementSet(stylesheets, base, assetsPrefix, queryParams) {
  return new Set(
    stylesheets.map((s) => createStylesheetElement(s, base, assetsPrefix))
  );
}
function createModuleScriptElement(script, base, assetsPrefix, queryParams) {
  if (script.type === "external") {
    return createModuleScriptElementWithSrc(script.value, base, assetsPrefix);
  } else {
    return {
      props: {
        type: "module"
      },
      children: script.value
    };
  }
}
function createModuleScriptElementWithSrc(src, base, assetsPrefix, queryParams) {
  return {
    props: {
      type: "module",
      src: createAssetLink(src, base, assetsPrefix)
    },
    children: ""
  };
}

function createConsoleLogger(level) {
  return new Logger({
    dest: consoleLogDestination,
    level: level ?? "info"
  });
}

class AppPipeline extends Pipeline {
  getName() {
    return "AppPipeline";
  }
  static create({ manifest, streaming }) {
    const resolve = async function resolve2(specifier) {
      if (!(specifier in manifest.entryModules)) {
        throw new Error(`Unable to resolve [${specifier}]`);
      }
      const bundlePath = manifest.entryModules[specifier];
      if (bundlePath.startsWith("data:") || bundlePath.length === 0) {
        return bundlePath;
      } else {
        return createAssetLink(bundlePath, manifest.base, manifest.assetsPrefix);
      }
    };
    const logger = createConsoleLogger(manifest.logLevel);
    const pipeline = new AppPipeline(
      logger,
      manifest,
      "production",
      manifest.renderers,
      resolve,
      streaming,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0,
      void 0
    );
    return pipeline;
  }
  async headElements(routeData) {
    const { assetsPrefix, base } = this.manifest;
    const routeInfo = this.manifest.routes.find(
      (route) => route.routeData.route === routeData.route
    );
    const links = /* @__PURE__ */ new Set();
    const scripts = /* @__PURE__ */ new Set();
    const styles = createStylesheetElementSet(routeInfo?.styles ?? [], base, assetsPrefix);
    for (const script of routeInfo?.scripts ?? []) {
      if ("stage" in script) {
        if (script.stage === "head-inline") {
          scripts.add({
            props: {},
            children: script.children
          });
        }
      } else {
        scripts.add(createModuleScriptElement(script, base, assetsPrefix));
      }
    }
    return { links, styles, scripts };
  }
  componentMetadata() {
  }
  async getComponentByRoute(routeData) {
    const module = await this.getModuleForRoute(routeData);
    return module.page();
  }
  async getModuleForRoute(route) {
    for (const defaultRoute of this.defaultRoutes) {
      if (route.component === defaultRoute.component) {
        return {
          page: () => Promise.resolve(defaultRoute.instance)
        };
      }
    }
    let routeToProcess = route;
    if (routeIsRedirect(route)) {
      if (route.redirectRoute) {
        routeToProcess = route.redirectRoute;
      } else {
        return RedirectSinglePageBuiltModule;
      }
    } else if (routeIsFallback(route)) {
      routeToProcess = getFallbackRoute(route, this.manifest.routes);
    }
    if (this.manifest.pageMap) {
      const importComponentInstance = this.manifest.pageMap.get(routeToProcess.component);
      if (!importComponentInstance) {
        throw new Error(
          `Unexpectedly unable to find a component instance for route ${route.route}`
        );
      }
      return await importComponentInstance();
    } else if (this.manifest.pageModule) {
      return this.manifest.pageModule;
    }
    throw new Error(
      "Astro couldn't find the correct page to render, probably because it wasn't correctly mapped for SSR usage. This is an internal error, please file an issue."
    );
  }
  async tryRewrite(payload, request) {
    const { newUrl, pathname, routeData } = findRouteToRewrite({
      payload,
      request,
      routes: this.manifest?.routes.map((r) => r.routeData),
      trailingSlash: this.manifest.trailingSlash,
      buildFormat: this.manifest.buildFormat,
      base: this.manifest.base,
      outDir: this.manifest?.serverLike ? this.manifest.buildClientDir : this.manifest.outDir
    });
    const componentInstance = await this.getComponentByRoute(routeData);
    return { newUrl, pathname, componentInstance, routeData };
  }
}

class App extends BaseApp {
  createPipeline(streaming) {
    return AppPipeline.create({
      manifest: this.manifest,
      streaming
    });
  }
  isDev() {
    return false;
  }
  // Should we log something for our users?
  logRequest(_options) {
  }
}

const renderers = [];

const serializedData = [{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/_image","component":"node_modules/astro/dist/assets/endpoint/generic.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/.well-known/auth","pattern":"^\\/_emdash\\/\\.well-known\\/auth\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":".well-known","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/well-known/auth.mjs","pathname":"/_emdash/.well-known/auth","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","isIndex":false,"route":"/_emdash/admin/[...path]","pattern":"^\\/_emdash\\/admin(?:\\/(.*?))?\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"node_modules/emdash/src/astro/routes/admin.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/allowed-domains/[domain]","pattern":"^\\/_emdash\\/api\\/admin\\/allowed-domains\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"allowed-domains","dynamic":false,"spread":false}],[{"content":"domain","dynamic":true,"spread":false}]],"params":["domain"],"component":"node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/_domain_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/allowed-domains","pattern":"^\\/_emdash\\/api\\/admin\\/allowed-domains\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"allowed-domains","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/index.mjs","pathname":"/_emdash/api/admin/allowed-domains","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/api-tokens/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/api-tokens\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"api-tokens","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/api-tokens/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/api-tokens","pattern":"^\\/_emdash\\/api\\/admin\\/api-tokens\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"api-tokens","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/api-tokens/index.mjs","pathname":"/_emdash/api/admin/api-tokens","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/bylines/[id]/translations","pattern":"^\\/_emdash\\/api\\/admin\\/bylines\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"bylines","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/bylines/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/bylines\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"bylines","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/bylines","pattern":"^\\/_emdash\\/api\\/admin\\/bylines\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"bylines","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/bylines/index.mjs","pathname":"/_emdash/api/admin/bylines","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/bulk","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/bulk\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"bulk","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/bulk.mjs","pathname":"/_emdash/api/admin/comments/bulk","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/counts","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/counts\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"counts","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/counts.mjs","pathname":"/_emdash/api/admin/comments/counts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/[id]/status","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/([^/]+?)\\/status\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"status","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/_id_/status.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/index.mjs","pathname":"/_emdash/api/admin/comments","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/hooks/exclusive/[hookname]","pattern":"^\\/_emdash\\/api\\/admin\\/hooks\\/exclusive\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"hooks","dynamic":false,"spread":false}],[{"content":"exclusive","dynamic":false,"spread":false}],[{"content":"hookName","dynamic":true,"spread":false}]],"params":["hookName"],"component":"node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/hooks/exclusive","pattern":"^\\/_emdash\\/api\\/admin\\/hooks\\/exclusive\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"hooks","dynamic":false,"spread":false}],[{"content":"exclusive","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/index.mjs","pathname":"/_emdash/api/admin/hooks/exclusive","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/oauth-clients/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/oauth-clients\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"oauth-clients","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/oauth-clients","pattern":"^\\/_emdash\\/api\\/admin\\/oauth-clients\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"oauth-clients","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/index.mjs","pathname":"/_emdash/api/admin/oauth-clients","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace/[id]/icon","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/icon\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"icon","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace/[id]/install","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/install\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"install","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/index.mjs","pathname":"/_emdash/api/admin/plugins/marketplace","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/registry/install","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/registry\\/install\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"registry","dynamic":false,"spread":false}],[{"content":"install","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/registry/install.mjs","pathname":"/_emdash/api/admin/plugins/registry/install","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/updates","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/updates\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"updates","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/updates.mjs","pathname":"/_emdash/api/admin/plugins/updates","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/disable","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/disable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"disable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/disable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/enable","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/enable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"enable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/enable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/uninstall","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/uninstall\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"uninstall","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/update","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/update\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"update","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/update.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/index.mjs","pathname":"/_emdash/api/admin/plugins","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/themes/marketplace/[id]/thumbnail","pattern":"^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/([^/]+?)\\/thumbnail\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"thumbnail","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/themes/marketplace/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/themes/marketplace","pattern":"^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/index.mjs","pathname":"/_emdash/api/admin/themes/marketplace","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]/disable","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/disable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"disable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/disable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]/enable","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/enable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"enable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/enable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]/send-recovery","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/send-recovery\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"send-recovery","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/send-recovery.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/index.mjs","pathname":"/_emdash/api/admin/users","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/dev-bypass","pattern":"^\\/_emdash\\/api\\/auth\\/dev-bypass\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"dev-bypass","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/dev-bypass.mjs","pathname":"/_emdash/api/auth/dev-bypass","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite/accept","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/accept\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}],[{"content":"accept","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/accept.mjs","pathname":"/_emdash/api/auth/invite/accept","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite/complete","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/complete\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}],[{"content":"complete","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/complete.mjs","pathname":"/_emdash/api/auth/invite/complete","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite/register-options","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/register-options\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}],[{"content":"register-options","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/register-options.mjs","pathname":"/_emdash/api/auth/invite/register-options","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/index.mjs","pathname":"/_emdash/api/auth/invite","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/logout","pattern":"^\\/_emdash\\/api\\/auth\\/logout\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/logout.mjs","pathname":"/_emdash/api/auth/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/magic-link/send","pattern":"^\\/_emdash\\/api\\/auth\\/magic-link\\/send\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"magic-link","dynamic":false,"spread":false}],[{"content":"send","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/magic-link/send.mjs","pathname":"/_emdash/api/auth/magic-link/send","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/magic-link/verify","pattern":"^\\/_emdash\\/api\\/auth\\/magic-link\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"magic-link","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/magic-link/verify.mjs","pathname":"/_emdash/api/auth/magic-link/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/me","pattern":"^\\/_emdash\\/api\\/auth\\/me\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"me","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/me.mjs","pathname":"/_emdash/api/auth/me","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/mode","pattern":"^\\/_emdash\\/api\\/auth\\/mode\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"mode","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/mode.mjs","pathname":"/_emdash/api/auth/mode","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/oauth/[provider]/callback","pattern":"^\\/_emdash\\/api\\/auth\\/oauth\\/([^/]+?)\\/callback\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"provider","dynamic":true,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":["provider"],"component":"node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_/callback.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/oauth/[provider]","pattern":"^\\/_emdash\\/api\\/auth\\/oauth\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"provider","dynamic":true,"spread":false}]],"params":["provider"],"component":"node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/options","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/options\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"options","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/options.mjs","pathname":"/_emdash/api/auth/passkey/options","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/register/options","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/register\\/options\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}],[{"content":"options","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/register/options.mjs","pathname":"/_emdash/api/auth/passkey/register/options","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/register/verify","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/register\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/register/verify.mjs","pathname":"/_emdash/api/auth/passkey/register/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/verify","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/verify.mjs","pathname":"/_emdash/api/auth/passkey/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/[id]","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/index.mjs","pathname":"/_emdash/api/auth/passkey","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/signup/complete","pattern":"^\\/_emdash\\/api\\/auth\\/signup\\/complete\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}],[{"content":"complete","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/signup/complete.mjs","pathname":"/_emdash/api/auth/signup/complete","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/signup/request","pattern":"^\\/_emdash\\/api\\/auth\\/signup\\/request\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}],[{"content":"request","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/signup/request.mjs","pathname":"/_emdash/api/auth/signup/request","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/signup/verify","pattern":"^\\/_emdash\\/api\\/auth\\/signup\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/signup/verify.mjs","pathname":"/_emdash/api/auth/signup/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/comments/[collection]/[contentid]","pattern":"^\\/_emdash\\/api\\/comments\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"contentId","dynamic":true,"spread":false}]],"params":["collection","contentId"],"component":"node_modules/emdash/dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/trash","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/trash\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"trash","dynamic":false,"spread":false}]],"params":["collection"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/trash.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/compare","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/compare\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"compare","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/compare.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/discard-draft","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/discard-draft\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"discard-draft","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/duplicate","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/duplicate\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"duplicate","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/permanent","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/permanent\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"permanent","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/permanent.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/preview-url","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/preview-url\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"preview-url","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/publish","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/publish\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"publish","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/publish.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/restore","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/restore\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"restore","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/restore.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/revisions","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/revisions\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"revisions","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/revisions.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/schedule","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/schedule\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"schedule","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/schedule.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/terms/[taxonomy]","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/terms\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}],[{"content":"taxonomy","dynamic":true,"spread":false}]],"params":["collection","id","taxonomy"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/translations","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/unpublish","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/unpublish\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"unpublish","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}]],"params":["collection"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/dashboard","pattern":"^\\/_emdash\\/api\\/dashboard\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/dashboard.mjs","pathname":"/_emdash/api/dashboard","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/dev/emails","pattern":"^\\/_emdash\\/api\\/dev\\/emails\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"dev","dynamic":false,"spread":false}],[{"content":"emails","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/dev/emails.mjs","pathname":"/_emdash/api/dev/emails","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/probe","pattern":"^\\/_emdash\\/api\\/import\\/probe\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"probe","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/probe.mjs","pathname":"/_emdash/api/import/probe","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/analyze","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/analyze\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"analyze","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/analyze.mjs","pathname":"/_emdash/api/import/wordpress/analyze","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/execute","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/execute\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"execute","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/execute.mjs","pathname":"/_emdash/api/import/wordpress/execute","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/media","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/media\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/media.mjs","pathname":"/_emdash/api/import/wordpress/media","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/prepare","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/prepare\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"prepare","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/prepare.mjs","pathname":"/_emdash/api/import/wordpress/prepare","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/rewrite-urls","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/rewrite-urls\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"rewrite-urls","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/rewrite-urls.mjs","pathname":"/_emdash/api/import/wordpress/rewrite-urls","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress-plugin/analyze","pattern":"^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/analyze\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress-plugin","dynamic":false,"spread":false}],[{"content":"analyze","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/analyze.mjs","pathname":"/_emdash/api/import/wordpress-plugin/analyze","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress-plugin/callback","pattern":"^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/callback\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress-plugin","dynamic":false,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/callback.mjs","pathname":"/_emdash/api/import/wordpress-plugin/callback","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress-plugin/execute","pattern":"^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/execute\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress-plugin","dynamic":false,"spread":false}],[{"content":"execute","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/execute.mjs","pathname":"/_emdash/api/import/wordpress-plugin/execute","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/manifest","pattern":"^\\/_emdash\\/api\\/manifest\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"manifest","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/manifest.mjs","pathname":"/_emdash/api/manifest","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/mcp","pattern":"^\\/_emdash\\/api\\/mcp\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"mcp","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/mcp.mjs","pathname":"/_emdash/api/mcp","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/file/[...key]","pattern":"^\\/_emdash\\/api\\/media\\/file(?:\\/(.*?))?\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"file","dynamic":false,"spread":false}],[{"content":"...key","dynamic":true,"spread":true}]],"params":["...key"],"component":"node_modules/emdash/dist/astro/routes/api/media/file/_...key_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/providers/[providerid]/[itemid]","pattern":"^\\/_emdash\\/api\\/media\\/providers\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"providers","dynamic":false,"spread":false}],[{"content":"providerId","dynamic":true,"spread":false}],[{"content":"itemId","dynamic":true,"spread":false}]],"params":["providerId","itemId"],"component":"node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/providers/[providerid]","pattern":"^\\/_emdash\\/api\\/media\\/providers\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"providers","dynamic":false,"spread":false}],[{"content":"providerId","dynamic":true,"spread":false}]],"params":["providerId"],"component":"node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/providers","pattern":"^\\/_emdash\\/api\\/media\\/providers\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"providers","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/media/providers/index.mjs","pathname":"/_emdash/api/media/providers","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/upload-url","pattern":"^\\/_emdash\\/api\\/media\\/upload-url\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"upload-url","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/media/upload-url.mjs","pathname":"/_emdash/api/media/upload-url","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/[id]/confirm","pattern":"^\\/_emdash\\/api\\/media\\/([^/]+?)\\/confirm\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"confirm","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/media/_id_/confirm.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/[id]","pattern":"^\\/_emdash\\/api\\/media\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/media/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media","pattern":"^\\/_emdash\\/api\\/media\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/media.mjs","pathname":"/_emdash/api/media","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/items/[id]","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/items\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"items","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["name","id"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/items/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/items","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/items\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"items","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/items.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/reorder","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/reorder\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/reorder.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/translations","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus","pattern":"^\\/_emdash\\/api\\/menus\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/menus/index.mjs","pathname":"/_emdash/api/menus","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/device/authorize","pattern":"^\\/_emdash\\/api\\/oauth\\/device\\/authorize\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"device","dynamic":false,"spread":false}],[{"content":"authorize","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/device/authorize.mjs","pathname":"/_emdash/api/oauth/device/authorize","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/device/code","pattern":"^\\/_emdash\\/api\\/oauth\\/device\\/code\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"device","dynamic":false,"spread":false}],[{"content":"code","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/device/code.mjs","pathname":"/_emdash/api/oauth/device/code","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/device/token","pattern":"^\\/_emdash\\/api\\/oauth\\/device\\/token\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"device","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/device/token.mjs","pathname":"/_emdash/api/oauth/device/token","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/register","pattern":"^\\/_emdash\\/api\\/oauth\\/register\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/register.mjs","pathname":"/_emdash/api/oauth/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/token/refresh","pattern":"^\\/_emdash\\/api\\/oauth\\/token\\/refresh\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}],[{"content":"refresh","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/token/refresh.mjs","pathname":"/_emdash/api/oauth/token/refresh","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/token/revoke","pattern":"^\\/_emdash\\/api\\/oauth\\/token\\/revoke\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}],[{"content":"revoke","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/token/revoke.mjs","pathname":"/_emdash/api/oauth/token/revoke","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/token","pattern":"^\\/_emdash\\/api\\/oauth\\/token\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/token.mjs","pathname":"/_emdash/api/oauth/token","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/plugins/[pluginid]/[...path]","pattern":"^\\/_emdash\\/api\\/plugins\\/([^/]+?)(?:\\/(.*?))?\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"pluginId","dynamic":true,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["pluginId","...path"],"component":"node_modules/emdash/dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects/404s/summary","pattern":"^\\/_emdash\\/api\\/redirects\\/404s\\/summary\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}],[{"content":"404s","dynamic":false,"spread":false}],[{"content":"summary","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/redirects/404s/summary.mjs","pathname":"/_emdash/api/redirects/404s/summary","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects/404s","pattern":"^\\/_emdash\\/api\\/redirects\\/404s\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}],[{"content":"404s","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/redirects/404s/index.mjs","pathname":"/_emdash/api/redirects/404s","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects/[id]","pattern":"^\\/_emdash\\/api\\/redirects\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/redirects/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects","pattern":"^\\/_emdash\\/api\\/redirects\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/redirects/index.mjs","pathname":"/_emdash/api/redirects","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/revisions/[revisionid]/restore","pattern":"^\\/_emdash\\/api\\/revisions\\/([^/]+?)\\/restore\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"revisions","dynamic":false,"spread":false}],[{"content":"revisionId","dynamic":true,"spread":false}],[{"content":"restore","dynamic":false,"spread":false}]],"params":["revisionId"],"component":"node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/restore.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/revisions/[revisionid]","pattern":"^\\/_emdash\\/api\\/revisions\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"revisions","dynamic":false,"spread":false}],[{"content":"revisionId","dynamic":true,"spread":false}]],"params":["revisionId"],"component":"node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]/fields/reorder","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/reorder\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"fields","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]/fields/[fieldslug]","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"fields","dynamic":false,"spread":false}],[{"content":"fieldSlug","dynamic":true,"spread":false}]],"params":["slug","fieldSlug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]/fields","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"fields","dynamic":false,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/index.mjs","pathname":"/_emdash/api/schema/collections","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/orphans/[slug]","pattern":"^\\/_emdash\\/api\\/schema\\/orphans\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"orphans","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/orphans/_slug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/orphans","pattern":"^\\/_emdash\\/api\\/schema\\/orphans\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"orphans","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/schema/orphans/index.mjs","pathname":"/_emdash/api/schema/orphans","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema","pattern":"^\\/_emdash\\/api\\/schema\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/schema/index.mjs","pathname":"/_emdash/api/schema","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/enable","pattern":"^\\/_emdash\\/api\\/search\\/enable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"enable","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/enable.mjs","pathname":"/_emdash/api/search/enable","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/rebuild","pattern":"^\\/_emdash\\/api\\/search\\/rebuild\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"rebuild","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/rebuild.mjs","pathname":"/_emdash/api/search/rebuild","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/stats","pattern":"^\\/_emdash\\/api\\/search\\/stats\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/stats.mjs","pathname":"/_emdash/api/search/stats","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/suggest","pattern":"^\\/_emdash\\/api\\/search\\/suggest\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"suggest","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/suggest.mjs","pathname":"/_emdash/api/search/suggest","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search","pattern":"^\\/_emdash\\/api\\/search\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/index.mjs","pathname":"/_emdash/api/search","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/sections/[slug]","pattern":"^\\/_emdash\\/api\\/sections\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/sections/_slug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/sections","pattern":"^\\/_emdash\\/api\\/sections\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/sections/index.mjs","pathname":"/_emdash/api/sections","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/settings/email","pattern":"^\\/_emdash\\/api\\/settings\\/email\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}],[{"content":"email","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/settings/email.mjs","pathname":"/_emdash/api/settings/email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/settings","pattern":"^\\/_emdash\\/api\\/settings\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/settings.mjs","pathname":"/_emdash/api/settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/admin/verify","pattern":"^\\/_emdash\\/api\\/setup\\/admin\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/admin-verify.mjs","pathname":"/_emdash/api/setup/admin/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/admin","pattern":"^\\/_emdash\\/api\\/setup\\/admin\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/admin.mjs","pathname":"/_emdash/api/setup/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/dev-bypass","pattern":"^\\/_emdash\\/api\\/setup\\/dev-bypass\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"dev-bypass","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/dev-bypass.mjs","pathname":"/_emdash/api/setup/dev-bypass","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/dev-reset","pattern":"^\\/_emdash\\/api\\/setup\\/dev-reset\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"dev-reset","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/dev-reset.mjs","pathname":"/_emdash/api/setup/dev-reset","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/status","pattern":"^\\/_emdash\\/api\\/setup\\/status\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"status","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/status.mjs","pathname":"/_emdash/api/setup/status","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup","pattern":"^\\/_emdash\\/api\\/setup\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/index.mjs","pathname":"/_emdash/api/setup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/snapshot","pattern":"^\\/_emdash\\/api\\/snapshot\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"snapshot","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/snapshot.mjs","pathname":"/_emdash/api/snapshot","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies/[name]/terms/[slug]/translations","pattern":"^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["name","slug"],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies/[name]/terms/[slug]","pattern":"^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["name","slug"],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies/[name]/terms","pattern":"^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies","pattern":"^\\/_emdash\\/api\\/taxonomies\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/index.mjs","pathname":"/_emdash/api/taxonomies","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/themes/preview","pattern":"^\\/_emdash\\/api\\/themes\\/preview\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"preview","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/themes/preview.mjs","pathname":"/_emdash/api/themes/preview","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/typegen","pattern":"^\\/_emdash\\/api\\/typegen\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"typegen","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/typegen.mjs","pathname":"/_emdash/api/typegen","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]/reorder","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/reorder\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/reorder.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]/widgets/[id]","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/widgets\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"widgets","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["name","id"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]/widgets","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/widgets\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"widgets","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas","pattern":"^\\/_emdash\\/api\\/widget-areas\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/index.mjs","pathname":"/_emdash/api/widget-areas","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-components","pattern":"^\\/_emdash\\/api\\/widget-components\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-components","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/widget-components.mjs","pathname":"/_emdash/api/widget-components","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/oauth/authorize","pattern":"^\\/_emdash\\/oauth\\/authorize\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"authorize","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/authorize.mjs","pathname":"/_emdash/oauth/authorize","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/.well-known/oauth-authorization-server/_emdash","pattern":"^\\/\\.well-known\\/oauth-authorization-server\\/_emdash\\/?$","segments":[[{"content":".well-known","dynamic":false,"spread":false}],[{"content":"oauth-authorization-server","dynamic":false,"spread":false}],[{"content":"_emdash","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/well-known/oauth-authorization-server.mjs","pathname":"/.well-known/oauth-authorization-server/_emdash","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/.well-known/oauth-protected-resource","pattern":"^\\/\\.well-known\\/oauth-protected-resource\\/?$","segments":[[{"content":".well-known","dynamic":false,"spread":false}],[{"content":"oauth-protected-resource","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/well-known/oauth-protected-resource.mjs","pathname":"/.well-known/oauth-protected-resource","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/cms-example","isIndex":false,"type":"page","pattern":"^\\/cms-example\\/?$","segments":[[{"content":"cms-example","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cms-example.astro","pathname":"/cms-example","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/commercial-electrical","isIndex":false,"type":"page","pattern":"^\\/commercial-electrical\\/?$","segments":[[{"content":"commercial-electrical","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/commercial-electrical.astro","pathname":"/commercial-electrical","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/financing","isIndex":false,"type":"page","pattern":"^\\/financing\\/?$","segments":[[{"content":"financing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/financing.astro","pathname":"/financing","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/ground-up-construction","isIndex":false,"type":"page","pattern":"^\\/ground-up-construction\\/?$","segments":[[{"content":"ground-up-construction","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ground-up-construction.astro","pathname":"/ground-up-construction","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/location","isIndex":false,"type":"page","pattern":"^\\/location\\/?$","segments":[[{"content":"location","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/location.astro","pathname":"/location","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/robots.txt","pattern":"^\\/robots\\.txt$","segments":[[{"content":"robots.txt","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/robots.txt.mjs","pathname":"/robots.txt","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/santa-monica","isIndex":false,"type":"page","pattern":"^\\/santa-monica\\/?$","segments":[[{"content":"santa-monica","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/santa-monica.astro","pathname":"/santa-monica","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/sitemap.xml","pattern":"^\\/sitemap\\.xml$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/sitemap.xml.mjs","pathname":"/sitemap.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/specials","isIndex":false,"type":"page","pattern":"^\\/specials\\/?$","segments":[[{"content":"specials","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/specials.astro","pathname":"/specials","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/sitemap-[collection].xml","pattern":"^\\/sitemap-([^/]+?)\\.xml\\/?$","segments":[[{"content":"sitemap-","dynamic":false,"spread":false},{"content":"collection","dynamic":true,"spread":false},{"content":".xml","dynamic":false,"spread":false}]],"params":["collection"],"component":"node_modules/emdash/dist/astro/routes/sitemap-_collection_.xml.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}];
				serializedData.map(deserializeRouteInfo);

const _page0 = () => import('./generic_DvxAY-Vq.mjs');
const _page1 = () => import('./auth_ChwqhmOP.mjs');
const _page2 = () => import('./admin_eyil3iVR.mjs');
const _page3 = () => import('./_domain__BHOLJDH0.mjs');
const _page4 = () => import('./index_vB19Wlu7.mjs');
const _page5 = () => import('./_id__UcIWSp0C.mjs');
const _page6 = () => import('./index_CWjEQWSA.mjs');
const _page7 = () => import('./translations_2MeSgeC8.mjs');
const _page8 = () => import('./index_DOVtaGUc.mjs');
const _page9 = () => import('./index_CosHWJAW.mjs');
const _page10 = () => import('./bulk_B4Darcdn.mjs');
const _page11 = () => import('./counts_D71KuqRF.mjs');
const _page12 = () => import('./status_DB5u63Ai.mjs');
const _page13 = () => import('./_id__pj7fQRyQ.mjs');
const _page14 = () => import('./index_Cbw1SKVF.mjs');
const _page15 = () => import('./_hookName__DJUrklcs.mjs');
const _page16 = () => import('./index_BSQWbA2r.mjs');
const _page17 = () => import('./_id__RAuRB8DK.mjs');
const _page18 = () => import('./index_CRYuxgV8.mjs');
const _page19 = () => import('./icon_BjKmH5yp.mjs');
const _page20 = () => import('./install_SjyWCcCr.mjs');
const _page21 = () => import('./index_DuhHEpo5.mjs');
const _page22 = () => import('./index_OfEozYge.mjs');
const _page23 = () => import('./install_DJs6gho7.mjs');
const _page24 = () => import('./updates_DHJrtLKm.mjs');
const _page25 = () => import('./disable_C39CmBui.mjs');
const _page26 = () => import('./enable_DSbR92or.mjs');
const _page27 = () => import('./uninstall_CMoIYMNk.mjs');
const _page28 = () => import('./update_CPXOuuUC.mjs');
const _page29 = () => import('./index_BoSABWM5.mjs');
const _page30 = () => import('./index_BFOB52ow.mjs');
const _page31 = () => import('./thumbnail_YPBTk4tq.mjs');
const _page32 = () => import('./index_IGc5LS47.mjs');
const _page33 = () => import('./index_CT8iKS_P.mjs');
const _page34 = () => import('./disable_BbJUAOO8.mjs');
const _page35 = () => import('./enable_BiXDFam0.mjs');
const _page36 = () => import('./send-recovery_DDKvWvKb.mjs');
const _page37 = () => import('./index_C5r5Haxf.mjs');
const _page38 = () => import('./index_Blun0Ql-.mjs');
const _page39 = () => import('./dev-bypass_D0p_gj5H.mjs');
const _page40 = () => import('./accept_CnC3DoDa.mjs');
const _page41 = () => import('./complete_CMXjoJqr.mjs');
const _page42 = () => import('./register-options_tjGEAxU7.mjs');
const _page43 = () => import('./index_DNKPV79i.mjs');
const _page44 = () => import('./logout_Dgmuu8H0.mjs');
const _page45 = () => import('./send_BXVW8ksd.mjs');
const _page46 = () => import('./verify_DYDM-0BA.mjs');
const _page47 = () => import('./me_GIaolPbC.mjs');
const _page48 = () => import('./mode_DeTfJa4x.mjs');
const _page49 = () => import('./callback_CegRAvpp.mjs');
const _page50 = () => import('./_provider__5wRVV4cj.mjs');
const _page51 = () => import('./options_CdVfR7bI.mjs');
const _page52 = () => import('./options_B1S9LiHe.mjs');
const _page53 = () => import('./verify_DaYXBBAB.mjs');
const _page54 = () => import('./verify_B2FyQpX6.mjs');
const _page55 = () => import('./_id__D3NK-Z0m.mjs');
const _page56 = () => import('./index_pC0rJlxE.mjs');
const _page57 = () => import('./complete_hhDG9Kau.mjs');
const _page58 = () => import('./request_BEobfST1.mjs');
const _page59 = () => import('./verify_DzVVtD64.mjs');
const _page60 = () => import('./index_Br01rMmq.mjs');
const _page61 = () => import('./trash_C3eN83Wn.mjs');
const _page62 = () => import('./compare_BH4qoh7m.mjs');
const _page63 = () => import('./discard-draft_Btyu5w5Z.mjs');
const _page64 = () => import('./duplicate_CRUYidvL.mjs');
const _page65 = () => import('./permanent_Dj48UNI_.mjs');
const _page66 = () => import('./preview-url_z3RoIjnz.mjs');
const _page67 = () => import('./publish_TPh57afY.mjs');
const _page68 = () => import('./restore_DiqP6DEq.mjs');
const _page69 = () => import('./revisions_B8ACalt9.mjs');
const _page70 = () => import('./schedule_hfqQPDOJ.mjs');
const _page71 = () => import('./_taxonomy__B-QyUiv3.mjs');
const _page72 = () => import('./translations_XpZDXulD.mjs');
const _page73 = () => import('./unpublish_0Y1p8POO.mjs');
const _page74 = () => import('./_id__BXdJ2GZD.mjs');
const _page75 = () => import('./index_RT5MLTKM.mjs');
const _page76 = () => import('./dashboard_8WgxWOYg.mjs');
const _page77 = () => import('./emails_C8XgrbP6.mjs');
const _page78 = () => import('./probe_OyvRXGM-.mjs');
const _page79 = () => import('./analyze_CzpFgcqc.mjs');
const _page80 = () => import('./execute_BHbMG-lq.mjs');
const _page81 = () => import('./media_BN-HlTbb.mjs');
const _page82 = () => import('./prepare_B1r-yaaq.mjs');
const _page83 = () => import('./rewrite-urls_g53-9N7L.mjs');
const _page84 = () => import('./analyze_CYI5arkC.mjs');
const _page85 = () => import('./callback_hZBIJxVt.mjs');
const _page86 = () => import('./execute_Dix9pylP.mjs');
const _page87 = () => import('./manifest_B_x5vygz.mjs');
const _page88 = () => import('./mcp_BIFxcMUP.mjs');
const _page89 = () => import('./_.._-Zgg98on.mjs');
const _page90 = () => import('./_itemId__DSMtUarT.mjs');
const _page91 = () => import('./index_qEUiL-1R.mjs');
const _page92 = () => import('./index_DsjksQ-_.mjs');
const _page93 = () => import('./upload-url_KIHVOXla.mjs');
const _page94 = () => import('./confirm_DVovc8l0.mjs');
const _page95 = () => import('./_id__C-H1SUjv.mjs');
const _page96 = () => import('./media_DaZraXiY.mjs');
const _page97 = () => import('./_id__CUOKK-o_.mjs');
const _page98 = () => import('./items_CpTNSs1D.mjs');
const _page99 = () => import('./reorder_BgIoUEMW.mjs');
const _page100 = () => import('./translations_RnxQHXY2.mjs');
const _page101 = () => import('./_name__Bp1wwgIW.mjs');
const _page102 = () => import('./index_CTKh8lsw.mjs');
const _page103 = () => import('./authorize_CAE4PWNS.mjs');
const _page104 = () => import('./code_CkZNFwlx.mjs');
const _page105 = () => import('./token_CT73kE4f.mjs');
const _page106 = () => import('./register_DZWoetWs.mjs');
const _page107 = () => import('./refresh_6AH3lrkg.mjs');
const _page108 = () => import('./revoke_BmyNg-J1.mjs');
const _page109 = () => import('./token_BcFPPs-I.mjs');
const _page110 = () => import('./_.._B0JpxGZR.mjs');
const _page111 = () => import('./summary_Bjhdkdf-.mjs');
const _page112 = () => import('./index_xNso-ksJ.mjs');
const _page113 = () => import('./_id__B4VQOFof.mjs');
const _page114 = () => import('./index_D8uS0Xg-.mjs');
const _page115 = () => import('./restore_BH46n7fS.mjs');
const _page116 = () => import('./index_D-Z0KY2z.mjs');
const _page117 = () => import('./reorder_CDG0vdWN.mjs');
const _page118 = () => import('./_fieldSlug__CLsSGyIp.mjs');
const _page119 = () => import('./index_D-8qZHmj.mjs');
const _page120 = () => import('./index_C_7eUcSI.mjs');
const _page121 = () => import('./index_CaGC5sjK.mjs');
const _page122 = () => import('./_slug__BD6wBUHk.mjs');
const _page123 = () => import('./index_D7abi--L.mjs');
const _page124 = () => import('./index_B5Mu1lx_.mjs');
const _page125 = () => import('./enable_wZi9O2WF.mjs');
const _page126 = () => import('./rebuild_xyuph4L8.mjs');
const _page127 = () => import('./stats_D98b4ELs.mjs');
const _page128 = () => import('./suggest_CYlrCFcL.mjs');
const _page129 = () => import('./index_DHhd71Hd.mjs');
const _page130 = () => import('./_slug__CddA8Exp.mjs');
const _page131 = () => import('./index_YCNknLkK.mjs');
const _page132 = () => import('./email_1AawTqr3.mjs');
const _page133 = () => import('./settings_TOLCs4aS.mjs');
const _page134 = () => import('./admin-verify_1rKWktlv.mjs');
const _page135 = () => import('./admin_8Cc2_Lfq.mjs');
const _page136 = () => import('./dev-bypass_DAz_6lrs.mjs');
const _page137 = () => import('./dev-reset_BocJRX_d.mjs');
const _page138 = () => import('./status_RWeanZRk.mjs');
const _page139 = () => import('./index_CsbxbWzm.mjs');
const _page140 = () => import('./snapshot_BKAsAzRh.mjs');
const _page141 = () => import('./translations_BAW1NZ0_.mjs');
const _page142 = () => import('./_slug__sijIA6-k.mjs');
const _page143 = () => import('./index_I5r-6Cod.mjs');
const _page144 = () => import('./index_DB4jRKBk.mjs');
const _page145 = () => import('./preview_Dk0O_EqD.mjs');
const _page146 = () => import('./typegen_Bv_vGwAM.mjs');
const _page147 = () => import('./reorder_D28Z7qpZ.mjs');
const _page148 = () => import('./_id__ByBWokF-.mjs');
const _page149 = () => import('./widgets_C46sN9zL.mjs');
const _page150 = () => import('./_name__B2Bv4PvJ.mjs');
const _page151 = () => import('./index_C3f8C6q_.mjs');
const _page152 = () => import('./widget-components_Owqa0UKS.mjs');
const _page153 = () => import('./authorize_BhjhKv6E.mjs');
const _page154 = () => import('./oauth-authorization-server_Bf_vXnKq.mjs');
const _page155 = () => import('./oauth-protected-resource_By_ETpcF.mjs');
const _page156 = () => import('./about_DzWr4KUJ.mjs');
const _page157 = () => import('./cms-example_C2h7RA3C.mjs');
const _page158 = () => import('./commercial-electrical_CnFO-h5L.mjs');
const _page159 = () => import('./contact_D2qfk7pb.mjs');
const _page160 = () => import('./financing_B4w4Fjd0.mjs');
const _page161 = () => import('./ground-up-construction_oVPdjueX.mjs');
const _page162 = () => import('./location_BSCTCfVb.mjs');
const _page163 = () => import('./robots_DouGDxeG.mjs');
const _page164 = () => import('./santa-monica_CeFrnueH.mjs');
const _page165 = () => import('./services_euToMGS-.mjs');
const _page166 = () => import('./sitemap_CoIy3tCF.mjs');
const _page167 = () => import('./specials_GEz_HH9w.mjs');
const _page168 = () => import('./sitemap-_collection__C20eGuYR.mjs');
const _page169 = () => import('./index_a_rZdRw5.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["node_modules/emdash/dist/astro/routes/api/well-known/auth.mjs", _page1],
    ["node_modules/emdash/src/astro/routes/admin.astro", _page2],
    ["node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/_domain_.mjs", _page3],
    ["node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/index.mjs", _page4],
    ["node_modules/emdash/dist/astro/routes/api/admin/api-tokens/_id_.mjs", _page5],
    ["node_modules/emdash/dist/astro/routes/api/admin/api-tokens/index.mjs", _page6],
    ["node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/translations.mjs", _page7],
    ["node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/index.mjs", _page8],
    ["node_modules/emdash/dist/astro/routes/api/admin/bylines/index.mjs", _page9],
    ["node_modules/emdash/dist/astro/routes/api/admin/comments/bulk.mjs", _page10],
    ["node_modules/emdash/dist/astro/routes/api/admin/comments/counts.mjs", _page11],
    ["node_modules/emdash/dist/astro/routes/api/admin/comments/_id_/status.mjs", _page12],
    ["node_modules/emdash/dist/astro/routes/api/admin/comments/_id_.mjs", _page13],
    ["node_modules/emdash/dist/astro/routes/api/admin/comments/index.mjs", _page14],
    ["node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs", _page15],
    ["node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/index.mjs", _page16],
    ["node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/_id_.mjs", _page17],
    ["node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/index.mjs", _page18],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs", _page19],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs", _page20],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs", _page21],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/index.mjs", _page22],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/registry/install.mjs", _page23],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/updates.mjs", _page24],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/disable.mjs", _page25],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/enable.mjs", _page26],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs", _page27],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/update.mjs", _page28],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/index.mjs", _page29],
    ["node_modules/emdash/dist/astro/routes/api/admin/plugins/index.mjs", _page30],
    ["node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs", _page31],
    ["node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs", _page32],
    ["node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/index.mjs", _page33],
    ["node_modules/emdash/dist/astro/routes/api/admin/users/_id_/disable.mjs", _page34],
    ["node_modules/emdash/dist/astro/routes/api/admin/users/_id_/enable.mjs", _page35],
    ["node_modules/emdash/dist/astro/routes/api/admin/users/_id_/send-recovery.mjs", _page36],
    ["node_modules/emdash/dist/astro/routes/api/admin/users/_id_/index.mjs", _page37],
    ["node_modules/emdash/dist/astro/routes/api/admin/users/index.mjs", _page38],
    ["node_modules/emdash/dist/astro/routes/api/auth/dev-bypass.mjs", _page39],
    ["node_modules/emdash/dist/astro/routes/api/auth/invite/accept.mjs", _page40],
    ["node_modules/emdash/dist/astro/routes/api/auth/invite/complete.mjs", _page41],
    ["node_modules/emdash/dist/astro/routes/api/auth/invite/register-options.mjs", _page42],
    ["node_modules/emdash/dist/astro/routes/api/auth/invite/index.mjs", _page43],
    ["node_modules/emdash/dist/astro/routes/api/auth/logout.mjs", _page44],
    ["node_modules/emdash/dist/astro/routes/api/auth/magic-link/send.mjs", _page45],
    ["node_modules/emdash/dist/astro/routes/api/auth/magic-link/verify.mjs", _page46],
    ["node_modules/emdash/dist/astro/routes/api/auth/me.mjs", _page47],
    ["node_modules/emdash/dist/astro/routes/api/auth/mode.mjs", _page48],
    ["node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_/callback.mjs", _page49],
    ["node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_.mjs", _page50],
    ["node_modules/emdash/dist/astro/routes/api/auth/passkey/options.mjs", _page51],
    ["node_modules/emdash/dist/astro/routes/api/auth/passkey/register/options.mjs", _page52],
    ["node_modules/emdash/dist/astro/routes/api/auth/passkey/register/verify.mjs", _page53],
    ["node_modules/emdash/dist/astro/routes/api/auth/passkey/verify.mjs", _page54],
    ["node_modules/emdash/dist/astro/routes/api/auth/passkey/_id_.mjs", _page55],
    ["node_modules/emdash/dist/astro/routes/api/auth/passkey/index.mjs", _page56],
    ["node_modules/emdash/dist/astro/routes/api/auth/signup/complete.mjs", _page57],
    ["node_modules/emdash/dist/astro/routes/api/auth/signup/request.mjs", _page58],
    ["node_modules/emdash/dist/astro/routes/api/auth/signup/verify.mjs", _page59],
    ["node_modules/emdash/dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs", _page60],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/trash.mjs", _page61],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/compare.mjs", _page62],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs", _page63],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs", _page64],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/permanent.mjs", _page65],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs", _page66],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/publish.mjs", _page67],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/restore.mjs", _page68],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/revisions.mjs", _page69],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/schedule.mjs", _page70],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs", _page71],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/translations.mjs", _page72],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs", _page73],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_.mjs", _page74],
    ["node_modules/emdash/dist/astro/routes/api/content/_collection_/index.mjs", _page75],
    ["node_modules/emdash/dist/astro/routes/api/dashboard.mjs", _page76],
    ["node_modules/emdash/dist/astro/routes/api/dev/emails.mjs", _page77],
    ["node_modules/emdash/dist/astro/routes/api/import/probe.mjs", _page78],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress/analyze.mjs", _page79],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress/execute.mjs", _page80],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress/media.mjs", _page81],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress/prepare.mjs", _page82],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress/rewrite-urls.mjs", _page83],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/analyze.mjs", _page84],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/callback.mjs", _page85],
    ["node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/execute.mjs", _page86],
    ["node_modules/emdash/dist/astro/routes/api/manifest.mjs", _page87],
    ["node_modules/emdash/dist/astro/routes/api/mcp.mjs", _page88],
    ["node_modules/emdash/dist/astro/routes/api/media/file/_...key_.mjs", _page89],
    ["node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs", _page90],
    ["node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/index.mjs", _page91],
    ["node_modules/emdash/dist/astro/routes/api/media/providers/index.mjs", _page92],
    ["node_modules/emdash/dist/astro/routes/api/media/upload-url.mjs", _page93],
    ["node_modules/emdash/dist/astro/routes/api/media/_id_/confirm.mjs", _page94],
    ["node_modules/emdash/dist/astro/routes/api/media/_id_.mjs", _page95],
    ["node_modules/emdash/dist/astro/routes/api/media.mjs", _page96],
    ["node_modules/emdash/dist/astro/routes/api/menus/_name_/items/_id_.mjs", _page97],
    ["node_modules/emdash/dist/astro/routes/api/menus/_name_/items.mjs", _page98],
    ["node_modules/emdash/dist/astro/routes/api/menus/_name_/reorder.mjs", _page99],
    ["node_modules/emdash/dist/astro/routes/api/menus/_name_/translations.mjs", _page100],
    ["node_modules/emdash/dist/astro/routes/api/menus/_name_.mjs", _page101],
    ["node_modules/emdash/dist/astro/routes/api/menus/index.mjs", _page102],
    ["node_modules/emdash/dist/astro/routes/api/oauth/device/authorize.mjs", _page103],
    ["node_modules/emdash/dist/astro/routes/api/oauth/device/code.mjs", _page104],
    ["node_modules/emdash/dist/astro/routes/api/oauth/device/token.mjs", _page105],
    ["node_modules/emdash/dist/astro/routes/api/oauth/register.mjs", _page106],
    ["node_modules/emdash/dist/astro/routes/api/oauth/token/refresh.mjs", _page107],
    ["node_modules/emdash/dist/astro/routes/api/oauth/token/revoke.mjs", _page108],
    ["node_modules/emdash/dist/astro/routes/api/oauth/token.mjs", _page109],
    ["node_modules/emdash/dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs", _page110],
    ["node_modules/emdash/dist/astro/routes/api/redirects/404s/summary.mjs", _page111],
    ["node_modules/emdash/dist/astro/routes/api/redirects/404s/index.mjs", _page112],
    ["node_modules/emdash/dist/astro/routes/api/redirects/_id_.mjs", _page113],
    ["node_modules/emdash/dist/astro/routes/api/redirects/index.mjs", _page114],
    ["node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/restore.mjs", _page115],
    ["node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/index.mjs", _page116],
    ["node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs", _page117],
    ["node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs", _page118],
    ["node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs", _page119],
    ["node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/index.mjs", _page120],
    ["node_modules/emdash/dist/astro/routes/api/schema/collections/index.mjs", _page121],
    ["node_modules/emdash/dist/astro/routes/api/schema/orphans/_slug_.mjs", _page122],
    ["node_modules/emdash/dist/astro/routes/api/schema/orphans/index.mjs", _page123],
    ["node_modules/emdash/dist/astro/routes/api/schema/index.mjs", _page124],
    ["node_modules/emdash/dist/astro/routes/api/search/enable.mjs", _page125],
    ["node_modules/emdash/dist/astro/routes/api/search/rebuild.mjs", _page126],
    ["node_modules/emdash/dist/astro/routes/api/search/stats.mjs", _page127],
    ["node_modules/emdash/dist/astro/routes/api/search/suggest.mjs", _page128],
    ["node_modules/emdash/dist/astro/routes/api/search/index.mjs", _page129],
    ["node_modules/emdash/dist/astro/routes/api/sections/_slug_.mjs", _page130],
    ["node_modules/emdash/dist/astro/routes/api/sections/index.mjs", _page131],
    ["node_modules/emdash/dist/astro/routes/api/settings/email.mjs", _page132],
    ["node_modules/emdash/dist/astro/routes/api/settings.mjs", _page133],
    ["node_modules/emdash/dist/astro/routes/api/setup/admin-verify.mjs", _page134],
    ["node_modules/emdash/dist/astro/routes/api/setup/admin.mjs", _page135],
    ["node_modules/emdash/dist/astro/routes/api/setup/dev-bypass.mjs", _page136],
    ["node_modules/emdash/dist/astro/routes/api/setup/dev-reset.mjs", _page137],
    ["node_modules/emdash/dist/astro/routes/api/setup/status.mjs", _page138],
    ["node_modules/emdash/dist/astro/routes/api/setup/index.mjs", _page139],
    ["node_modules/emdash/dist/astro/routes/api/snapshot.mjs", _page140],
    ["node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs", _page141],
    ["node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs", _page142],
    ["node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/index.mjs", _page143],
    ["node_modules/emdash/dist/astro/routes/api/taxonomies/index.mjs", _page144],
    ["node_modules/emdash/dist/astro/routes/api/themes/preview.mjs", _page145],
    ["node_modules/emdash/dist/astro/routes/api/typegen.mjs", _page146],
    ["node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/reorder.mjs", _page147],
    ["node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs", _page148],
    ["node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets.mjs", _page149],
    ["node_modules/emdash/dist/astro/routes/api/widget-areas/_name_.mjs", _page150],
    ["node_modules/emdash/dist/astro/routes/api/widget-areas/index.mjs", _page151],
    ["node_modules/emdash/dist/astro/routes/api/widget-components.mjs", _page152],
    ["node_modules/emdash/dist/astro/routes/api/oauth/authorize.mjs", _page153],
    ["node_modules/emdash/dist/astro/routes/api/well-known/oauth-authorization-server.mjs", _page154],
    ["node_modules/emdash/dist/astro/routes/api/well-known/oauth-protected-resource.mjs", _page155],
    ["src/pages/about.astro", _page156],
    ["src/pages/cms-example.astro", _page157],
    ["src/pages/commercial-electrical.astro", _page158],
    ["src/pages/contact.astro", _page159],
    ["src/pages/financing.astro", _page160],
    ["src/pages/ground-up-construction.astro", _page161],
    ["src/pages/location.astro", _page162],
    ["node_modules/emdash/dist/astro/routes/robots.txt.mjs", _page163],
    ["src/pages/santa-monica.astro", _page164],
    ["src/pages/services.astro", _page165],
    ["node_modules/emdash/dist/astro/routes/sitemap.xml.mjs", _page166],
    ["src/pages/specials.astro", _page167],
    ["node_modules/emdash/dist/astro/routes/sitemap-_collection_.xml.mjs", _page168],
    ["src/pages/index.astro", _page169]
]);

const _manifest = deserializeManifest(({"rootDir":"file:///C:/Users/sabido/electrician_website/","cacheDir":"file:///C:/Users/sabido/electrician_website/node_modules/.astro/","outDir":"file:///C:/Users/sabido/electrician_website/dist/","srcDir":"file:///C:/Users/sabido/electrician_website/src/","publicDir":"file:///C:/Users/sabido/electrician_website/public/","buildClientDir":"file:///C:/Users/sabido/electrician_website/dist/client/","buildServerDir":"file:///C:/Users/sabido/electrician_website/dist/server/","adapterName":"@astrojs/vercel","assetsDir":"_astro","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","distURL":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/_image","component":"node_modules/astro/dist/assets/endpoint/generic.js","params":[],"pathname":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"type":"endpoint","prerender":false,"fallbackRoutes":[],"distURL":[],"isIndex":false,"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/.well-known/auth","pattern":"^\\/_emdash\\/\\.well-known\\/auth\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":".well-known","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/well-known/auth.mjs","pathname":"/_emdash/.well-known/auth","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/admin@_@astro.CgFRJmcl.css"}],"routeData":{"type":"page","isIndex":false,"route":"/_emdash/admin/[...path]","pattern":"^\\/_emdash\\/admin(?:\\/(.*?))?\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["...path"],"component":"node_modules/emdash/src/astro/routes/admin.astro","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/allowed-domains/[domain]","pattern":"^\\/_emdash\\/api\\/admin\\/allowed-domains\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"allowed-domains","dynamic":false,"spread":false}],[{"content":"domain","dynamic":true,"spread":false}]],"params":["domain"],"component":"node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/_domain_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/allowed-domains","pattern":"^\\/_emdash\\/api\\/admin\\/allowed-domains\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"allowed-domains","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/index.mjs","pathname":"/_emdash/api/admin/allowed-domains","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/api-tokens/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/api-tokens\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"api-tokens","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/api-tokens/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/api-tokens","pattern":"^\\/_emdash\\/api\\/admin\\/api-tokens\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"api-tokens","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/api-tokens/index.mjs","pathname":"/_emdash/api/admin/api-tokens","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/bylines/[id]/translations","pattern":"^\\/_emdash\\/api\\/admin\\/bylines\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"bylines","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/bylines/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/bylines\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"bylines","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/bylines","pattern":"^\\/_emdash\\/api\\/admin\\/bylines\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"bylines","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/bylines/index.mjs","pathname":"/_emdash/api/admin/bylines","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/bulk","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/bulk\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"bulk","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/bulk.mjs","pathname":"/_emdash/api/admin/comments/bulk","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/counts","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/counts\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"counts","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/counts.mjs","pathname":"/_emdash/api/admin/comments/counts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/[id]/status","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/([^/]+?)\\/status\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"status","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/_id_/status.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/comments","pattern":"^\\/_emdash\\/api\\/admin\\/comments\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/comments/index.mjs","pathname":"/_emdash/api/admin/comments","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/hooks/exclusive/[hookname]","pattern":"^\\/_emdash\\/api\\/admin\\/hooks\\/exclusive\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"hooks","dynamic":false,"spread":false}],[{"content":"exclusive","dynamic":false,"spread":false}],[{"content":"hookName","dynamic":true,"spread":false}]],"params":["hookName"],"component":"node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/_hookName_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/hooks/exclusive","pattern":"^\\/_emdash\\/api\\/admin\\/hooks\\/exclusive\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"hooks","dynamic":false,"spread":false}],[{"content":"exclusive","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/index.mjs","pathname":"/_emdash/api/admin/hooks/exclusive","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/oauth-clients/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/oauth-clients\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"oauth-clients","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/oauth-clients","pattern":"^\\/_emdash\\/api\\/admin\\/oauth-clients\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"oauth-clients","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/index.mjs","pathname":"/_emdash/api/admin/oauth-clients","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace/[id]/icon","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/icon\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"icon","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/icon.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace/[id]/install","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/install\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"install","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/marketplace","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/marketplace\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/index.mjs","pathname":"/_emdash/api/admin/plugins/marketplace","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/registry/install","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/registry\\/install\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"registry","dynamic":false,"spread":false}],[{"content":"install","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/registry/install.mjs","pathname":"/_emdash/api/admin/plugins/registry/install","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/updates","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/updates\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"updates","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/updates.mjs","pathname":"/_emdash/api/admin/plugins/updates","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/disable","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/disable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"disable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/disable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/enable","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/enable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"enable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/enable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/uninstall","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/uninstall\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"uninstall","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]/update","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/update\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"update","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/update.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/plugins","pattern":"^\\/_emdash\\/api\\/admin\\/plugins\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/plugins/index.mjs","pathname":"/_emdash/api/admin/plugins","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/themes/marketplace/[id]/thumbnail","pattern":"^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/([^/]+?)\\/thumbnail\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"thumbnail","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/themes/marketplace/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/themes/marketplace","pattern":"^\\/_emdash\\/api\\/admin\\/themes\\/marketplace\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"marketplace","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/index.mjs","pathname":"/_emdash/api/admin/themes/marketplace","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]/disable","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/disable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"disable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/disable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]/enable","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/enable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"enable","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/enable.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]/send-recovery","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/send-recovery\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"send-recovery","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/send-recovery.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users/[id]","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/_id_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/admin/users","pattern":"^\\/_emdash\\/api\\/admin\\/users\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"users","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/admin/users/index.mjs","pathname":"/_emdash/api/admin/users","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/dev-bypass","pattern":"^\\/_emdash\\/api\\/auth\\/dev-bypass\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"dev-bypass","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/dev-bypass.mjs","pathname":"/_emdash/api/auth/dev-bypass","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite/accept","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/accept\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}],[{"content":"accept","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/accept.mjs","pathname":"/_emdash/api/auth/invite/accept","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite/complete","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/complete\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}],[{"content":"complete","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/complete.mjs","pathname":"/_emdash/api/auth/invite/complete","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite/register-options","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/register-options\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}],[{"content":"register-options","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/register-options.mjs","pathname":"/_emdash/api/auth/invite/register-options","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/invite","pattern":"^\\/_emdash\\/api\\/auth\\/invite\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"invite","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/invite/index.mjs","pathname":"/_emdash/api/auth/invite","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/logout","pattern":"^\\/_emdash\\/api\\/auth\\/logout\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"logout","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/logout.mjs","pathname":"/_emdash/api/auth/logout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/magic-link/send","pattern":"^\\/_emdash\\/api\\/auth\\/magic-link\\/send\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"magic-link","dynamic":false,"spread":false}],[{"content":"send","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/magic-link/send.mjs","pathname":"/_emdash/api/auth/magic-link/send","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/magic-link/verify","pattern":"^\\/_emdash\\/api\\/auth\\/magic-link\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"magic-link","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/magic-link/verify.mjs","pathname":"/_emdash/api/auth/magic-link/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/me","pattern":"^\\/_emdash\\/api\\/auth\\/me\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"me","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/me.mjs","pathname":"/_emdash/api/auth/me","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/mode","pattern":"^\\/_emdash\\/api\\/auth\\/mode\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"mode","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/mode.mjs","pathname":"/_emdash/api/auth/mode","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/oauth/[provider]/callback","pattern":"^\\/_emdash\\/api\\/auth\\/oauth\\/([^/]+?)\\/callback\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"provider","dynamic":true,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":["provider"],"component":"node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_/callback.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/oauth/[provider]","pattern":"^\\/_emdash\\/api\\/auth\\/oauth\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"provider","dynamic":true,"spread":false}]],"params":["provider"],"component":"node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/options","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/options\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"options","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/options.mjs","pathname":"/_emdash/api/auth/passkey/options","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/register/options","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/register\\/options\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}],[{"content":"options","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/register/options.mjs","pathname":"/_emdash/api/auth/passkey/register/options","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/register/verify","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/register\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/register/verify.mjs","pathname":"/_emdash/api/auth/passkey/register/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/verify","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/verify.mjs","pathname":"/_emdash/api/auth/passkey/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey/[id]","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/passkey","pattern":"^\\/_emdash\\/api\\/auth\\/passkey\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"passkey","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/passkey/index.mjs","pathname":"/_emdash/api/auth/passkey","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/signup/complete","pattern":"^\\/_emdash\\/api\\/auth\\/signup\\/complete\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}],[{"content":"complete","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/signup/complete.mjs","pathname":"/_emdash/api/auth/signup/complete","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/signup/request","pattern":"^\\/_emdash\\/api\\/auth\\/signup\\/request\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}],[{"content":"request","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/signup/request.mjs","pathname":"/_emdash/api/auth/signup/request","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/auth/signup/verify","pattern":"^\\/_emdash\\/api\\/auth\\/signup\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"auth","dynamic":false,"spread":false}],[{"content":"signup","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/auth/signup/verify.mjs","pathname":"/_emdash/api/auth/signup/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/comments/[collection]/[contentid]","pattern":"^\\/_emdash\\/api\\/comments\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"comments","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"contentId","dynamic":true,"spread":false}]],"params":["collection","contentId"],"component":"node_modules/emdash/dist/astro/routes/api/comments/_collection_/_contentId_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/trash","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/trash\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"trash","dynamic":false,"spread":false}]],"params":["collection"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/trash.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/compare","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/compare\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"compare","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/compare.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/discard-draft","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/discard-draft\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"discard-draft","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/discard-draft.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/duplicate","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/duplicate\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"duplicate","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/duplicate.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/permanent","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/permanent\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"permanent","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/permanent.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/preview-url","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/preview-url\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"preview-url","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/preview-url.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/publish","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/publish\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"publish","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/publish.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/restore","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/restore\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"restore","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/restore.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/revisions","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/revisions\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"revisions","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/revisions.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/schedule","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/schedule\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"schedule","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/schedule.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/terms/[taxonomy]","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/terms\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}],[{"content":"taxonomy","dynamic":true,"spread":false}]],"params":["collection","id","taxonomy"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/translations","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]/unpublish","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/unpublish\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"unpublish","dynamic":false,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/unpublish.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]/[id]","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["collection","id"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/content/[collection]","pattern":"^\\/_emdash\\/api\\/content\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"content","dynamic":false,"spread":false}],[{"content":"collection","dynamic":true,"spread":false}]],"params":["collection"],"component":"node_modules/emdash/dist/astro/routes/api/content/_collection_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/dashboard","pattern":"^\\/_emdash\\/api\\/dashboard\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"dashboard","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/dashboard.mjs","pathname":"/_emdash/api/dashboard","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/dev/emails","pattern":"^\\/_emdash\\/api\\/dev\\/emails\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"dev","dynamic":false,"spread":false}],[{"content":"emails","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/dev/emails.mjs","pathname":"/_emdash/api/dev/emails","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/probe","pattern":"^\\/_emdash\\/api\\/import\\/probe\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"probe","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/probe.mjs","pathname":"/_emdash/api/import/probe","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/analyze","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/analyze\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"analyze","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/analyze.mjs","pathname":"/_emdash/api/import/wordpress/analyze","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/execute","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/execute\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"execute","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/execute.mjs","pathname":"/_emdash/api/import/wordpress/execute","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/media","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/media\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/media.mjs","pathname":"/_emdash/api/import/wordpress/media","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/prepare","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/prepare\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"prepare","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/prepare.mjs","pathname":"/_emdash/api/import/wordpress/prepare","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress/rewrite-urls","pattern":"^\\/_emdash\\/api\\/import\\/wordpress\\/rewrite-urls\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress","dynamic":false,"spread":false}],[{"content":"rewrite-urls","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress/rewrite-urls.mjs","pathname":"/_emdash/api/import/wordpress/rewrite-urls","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress-plugin/analyze","pattern":"^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/analyze\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress-plugin","dynamic":false,"spread":false}],[{"content":"analyze","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/analyze.mjs","pathname":"/_emdash/api/import/wordpress-plugin/analyze","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress-plugin/callback","pattern":"^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/callback\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress-plugin","dynamic":false,"spread":false}],[{"content":"callback","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/callback.mjs","pathname":"/_emdash/api/import/wordpress-plugin/callback","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/import/wordpress-plugin/execute","pattern":"^\\/_emdash\\/api\\/import\\/wordpress-plugin\\/execute\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"import","dynamic":false,"spread":false}],[{"content":"wordpress-plugin","dynamic":false,"spread":false}],[{"content":"execute","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/execute.mjs","pathname":"/_emdash/api/import/wordpress-plugin/execute","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/manifest","pattern":"^\\/_emdash\\/api\\/manifest\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"manifest","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/manifest.mjs","pathname":"/_emdash/api/manifest","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/mcp","pattern":"^\\/_emdash\\/api\\/mcp\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"mcp","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/mcp.mjs","pathname":"/_emdash/api/mcp","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/file/[...key]","pattern":"^\\/_emdash\\/api\\/media\\/file(?:\\/(.*?))?\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"file","dynamic":false,"spread":false}],[{"content":"...key","dynamic":true,"spread":true}]],"params":["...key"],"component":"node_modules/emdash/dist/astro/routes/api/media/file/_...key_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/providers/[providerid]/[itemid]","pattern":"^\\/_emdash\\/api\\/media\\/providers\\/([^/]+?)\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"providers","dynamic":false,"spread":false}],[{"content":"providerId","dynamic":true,"spread":false}],[{"content":"itemId","dynamic":true,"spread":false}]],"params":["providerId","itemId"],"component":"node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/_itemId_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/providers/[providerid]","pattern":"^\\/_emdash\\/api\\/media\\/providers\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"providers","dynamic":false,"spread":false}],[{"content":"providerId","dynamic":true,"spread":false}]],"params":["providerId"],"component":"node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/providers","pattern":"^\\/_emdash\\/api\\/media\\/providers\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"providers","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/media/providers/index.mjs","pathname":"/_emdash/api/media/providers","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/upload-url","pattern":"^\\/_emdash\\/api\\/media\\/upload-url\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"upload-url","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/media/upload-url.mjs","pathname":"/_emdash/api/media/upload-url","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/[id]/confirm","pattern":"^\\/_emdash\\/api\\/media\\/([^/]+?)\\/confirm\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}],[{"content":"confirm","dynamic":false,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/media/_id_/confirm.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media/[id]","pattern":"^\\/_emdash\\/api\\/media\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/media/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/media","pattern":"^\\/_emdash\\/api\\/media\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"media","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/media.mjs","pathname":"/_emdash/api/media","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/items/[id]","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/items\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"items","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["name","id"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/items/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/items","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/items\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"items","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/items.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/reorder","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/reorder\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/reorder.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]/translations","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus/[name]","pattern":"^\\/_emdash\\/api\\/menus\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/menus/_name_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/menus","pattern":"^\\/_emdash\\/api\\/menus\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"menus","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/menus/index.mjs","pathname":"/_emdash/api/menus","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/device/authorize","pattern":"^\\/_emdash\\/api\\/oauth\\/device\\/authorize\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"device","dynamic":false,"spread":false}],[{"content":"authorize","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/device/authorize.mjs","pathname":"/_emdash/api/oauth/device/authorize","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/device/code","pattern":"^\\/_emdash\\/api\\/oauth\\/device\\/code\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"device","dynamic":false,"spread":false}],[{"content":"code","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/device/code.mjs","pathname":"/_emdash/api/oauth/device/code","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/device/token","pattern":"^\\/_emdash\\/api\\/oauth\\/device\\/token\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"device","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/device/token.mjs","pathname":"/_emdash/api/oauth/device/token","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/register","pattern":"^\\/_emdash\\/api\\/oauth\\/register\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"register","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/register.mjs","pathname":"/_emdash/api/oauth/register","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/token/refresh","pattern":"^\\/_emdash\\/api\\/oauth\\/token\\/refresh\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}],[{"content":"refresh","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/token/refresh.mjs","pathname":"/_emdash/api/oauth/token/refresh","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/token/revoke","pattern":"^\\/_emdash\\/api\\/oauth\\/token\\/revoke\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}],[{"content":"revoke","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/token/revoke.mjs","pathname":"/_emdash/api/oauth/token/revoke","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/oauth/token","pattern":"^\\/_emdash\\/api\\/oauth\\/token\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"token","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/token.mjs","pathname":"/_emdash/api/oauth/token","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/plugins/[pluginid]/[...path]","pattern":"^\\/_emdash\\/api\\/plugins\\/([^/]+?)(?:\\/(.*?))?\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"plugins","dynamic":false,"spread":false}],[{"content":"pluginId","dynamic":true,"spread":false}],[{"content":"...path","dynamic":true,"spread":true}]],"params":["pluginId","...path"],"component":"node_modules/emdash/dist/astro/routes/api/plugins/_pluginId_/_...path_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects/404s/summary","pattern":"^\\/_emdash\\/api\\/redirects\\/404s\\/summary\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}],[{"content":"404s","dynamic":false,"spread":false}],[{"content":"summary","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/redirects/404s/summary.mjs","pathname":"/_emdash/api/redirects/404s/summary","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects/404s","pattern":"^\\/_emdash\\/api\\/redirects\\/404s\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}],[{"content":"404s","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/redirects/404s/index.mjs","pathname":"/_emdash/api/redirects/404s","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects/[id]","pattern":"^\\/_emdash\\/api\\/redirects\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["id"],"component":"node_modules/emdash/dist/astro/routes/api/redirects/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/redirects","pattern":"^\\/_emdash\\/api\\/redirects\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"redirects","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/redirects/index.mjs","pathname":"/_emdash/api/redirects","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/revisions/[revisionid]/restore","pattern":"^\\/_emdash\\/api\\/revisions\\/([^/]+?)\\/restore\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"revisions","dynamic":false,"spread":false}],[{"content":"revisionId","dynamic":true,"spread":false}],[{"content":"restore","dynamic":false,"spread":false}]],"params":["revisionId"],"component":"node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/restore.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/revisions/[revisionid]","pattern":"^\\/_emdash\\/api\\/revisions\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"revisions","dynamic":false,"spread":false}],[{"content":"revisionId","dynamic":true,"spread":false}]],"params":["revisionId"],"component":"node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]/fields/reorder","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/reorder\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"fields","dynamic":false,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]/fields/[fieldslug]","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"fields","dynamic":false,"spread":false}],[{"content":"fieldSlug","dynamic":true,"spread":false}]],"params":["slug","fieldSlug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]/fields","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/fields\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"fields","dynamic":false,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections/[slug]","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/collections","pattern":"^\\/_emdash\\/api\\/schema\\/collections\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"collections","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/schema/collections/index.mjs","pathname":"/_emdash/api/schema/collections","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/orphans/[slug]","pattern":"^\\/_emdash\\/api\\/schema\\/orphans\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"orphans","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/schema/orphans/_slug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema/orphans","pattern":"^\\/_emdash\\/api\\/schema\\/orphans\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}],[{"content":"orphans","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/schema/orphans/index.mjs","pathname":"/_emdash/api/schema/orphans","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/schema","pattern":"^\\/_emdash\\/api\\/schema\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"schema","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/schema/index.mjs","pathname":"/_emdash/api/schema","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/enable","pattern":"^\\/_emdash\\/api\\/search\\/enable\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"enable","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/enable.mjs","pathname":"/_emdash/api/search/enable","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/rebuild","pattern":"^\\/_emdash\\/api\\/search\\/rebuild\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"rebuild","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/rebuild.mjs","pathname":"/_emdash/api/search/rebuild","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/stats","pattern":"^\\/_emdash\\/api\\/search\\/stats\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"stats","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/stats.mjs","pathname":"/_emdash/api/search/stats","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search/suggest","pattern":"^\\/_emdash\\/api\\/search\\/suggest\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}],[{"content":"suggest","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/suggest.mjs","pathname":"/_emdash/api/search/suggest","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/search","pattern":"^\\/_emdash\\/api\\/search\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"search","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/search/index.mjs","pathname":"/_emdash/api/search","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/sections/[slug]","pattern":"^\\/_emdash\\/api\\/sections\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["slug"],"component":"node_modules/emdash/dist/astro/routes/api/sections/_slug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/sections","pattern":"^\\/_emdash\\/api\\/sections\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"sections","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/sections/index.mjs","pathname":"/_emdash/api/sections","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/settings/email","pattern":"^\\/_emdash\\/api\\/settings\\/email\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}],[{"content":"email","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/settings/email.mjs","pathname":"/_emdash/api/settings/email","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/settings","pattern":"^\\/_emdash\\/api\\/settings\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/settings.mjs","pathname":"/_emdash/api/settings","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/admin/verify","pattern":"^\\/_emdash\\/api\\/setup\\/admin\\/verify\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}],[{"content":"verify","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/admin-verify.mjs","pathname":"/_emdash/api/setup/admin/verify","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/admin","pattern":"^\\/_emdash\\/api\\/setup\\/admin\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"admin","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/admin.mjs","pathname":"/_emdash/api/setup/admin","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/dev-bypass","pattern":"^\\/_emdash\\/api\\/setup\\/dev-bypass\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"dev-bypass","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/dev-bypass.mjs","pathname":"/_emdash/api/setup/dev-bypass","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/dev-reset","pattern":"^\\/_emdash\\/api\\/setup\\/dev-reset\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"dev-reset","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/dev-reset.mjs","pathname":"/_emdash/api/setup/dev-reset","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup/status","pattern":"^\\/_emdash\\/api\\/setup\\/status\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}],[{"content":"status","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/status.mjs","pathname":"/_emdash/api/setup/status","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/setup","pattern":"^\\/_emdash\\/api\\/setup\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"setup","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/setup/index.mjs","pathname":"/_emdash/api/setup","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/snapshot","pattern":"^\\/_emdash\\/api\\/snapshot\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"snapshot","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/snapshot.mjs","pathname":"/_emdash/api/snapshot","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies/[name]/terms/[slug]/translations","pattern":"^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/([^/]+?)\\/translations\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}],[{"content":"translations","dynamic":false,"spread":false}]],"params":["name","slug"],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies/[name]/terms/[slug]","pattern":"^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}],[{"content":"slug","dynamic":true,"spread":false}]],"params":["name","slug"],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies/[name]/terms","pattern":"^\\/_emdash\\/api\\/taxonomies\\/([^/]+?)\\/terms\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"terms","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/index.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/taxonomies","pattern":"^\\/_emdash\\/api\\/taxonomies\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"taxonomies","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/taxonomies/index.mjs","pathname":"/_emdash/api/taxonomies","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/themes/preview","pattern":"^\\/_emdash\\/api\\/themes\\/preview\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"themes","dynamic":false,"spread":false}],[{"content":"preview","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/themes/preview.mjs","pathname":"/_emdash/api/themes/preview","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/typegen","pattern":"^\\/_emdash\\/api\\/typegen\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"typegen","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/typegen.mjs","pathname":"/_emdash/api/typegen","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]/reorder","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/reorder\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"reorder","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/reorder.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]/widgets/[id]","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/widgets\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"widgets","dynamic":false,"spread":false}],[{"content":"id","dynamic":true,"spread":false}]],"params":["name","id"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets/_id_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]/widgets","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/widgets\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}],[{"content":"widgets","dynamic":false,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas/[name]","pattern":"^\\/_emdash\\/api\\/widget-areas\\/([^/]+?)\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"params":["name"],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/_name_.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-areas","pattern":"^\\/_emdash\\/api\\/widget-areas\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-areas","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/widget-areas/index.mjs","pathname":"/_emdash/api/widget-areas","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/api/widget-components","pattern":"^\\/_emdash\\/api\\/widget-components\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"api","dynamic":false,"spread":false}],[{"content":"widget-components","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/widget-components.mjs","pathname":"/_emdash/api/widget-components","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_emdash/oauth/authorize","pattern":"^\\/_emdash\\/oauth\\/authorize\\/?$","segments":[[{"content":"_emdash","dynamic":false,"spread":false}],[{"content":"oauth","dynamic":false,"spread":false}],[{"content":"authorize","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/oauth/authorize.mjs","pathname":"/_emdash/oauth/authorize","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/.well-known/oauth-authorization-server/_emdash","pattern":"^\\/\\.well-known\\/oauth-authorization-server\\/_emdash\\/?$","segments":[[{"content":".well-known","dynamic":false,"spread":false}],[{"content":"oauth-authorization-server","dynamic":false,"spread":false}],[{"content":"_emdash","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/well-known/oauth-authorization-server.mjs","pathname":"/.well-known/oauth-authorization-server/_emdash","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/.well-known/oauth-protected-resource","pattern":"^\\/\\.well-known\\/oauth-protected-resource\\/?$","segments":[[{"content":".well-known","dynamic":false,"spread":false}],[{"content":"oauth-protected-resource","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/api/well-known/oauth-protected-resource.mjs","pathname":"/.well-known/oauth-protected-resource","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n@keyframes fadeIn{to{opacity:1}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}@keyframes scaleIn{to{opacity:1;transform:scale(1)}}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}.animate-spin-slow[data-astro-cid-zsov6f23]{animation:spin 8s linear infinite}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n.services-header[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out forwards}.services-tabs[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out .2s forwards}.service-tab[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(20px)}.services-tabs[data-astro-cid-bp4bfslc].animate .service-tab[data-astro-cid-bp4bfslc]{animation:fadeInUp .6s ease-out forwards}.service-tab[data-astro-cid-bp4bfslc][data-index=\"0\"]{animation-delay:.3s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"1\"]{animation-delay:.4s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"2\"]{animation-delay:.5s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"3\"]{animation-delay:.6s}.services-grid[data-astro-cid-bp4bfslc]>div[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(30px)}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc]{animation:fadeInUp .8s ease-out forwards}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"0\"]{animation-delay:.1s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"1\"]{animation-delay:.2s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"2\"]{animation-delay:.3s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"3\"]{animation-delay:.4s}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.location-header[data-astro-cid-5gdy3rwf]{opacity:0;animation:fadeInUp .8s ease-out forwards}.location-tabs[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-tabs[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .3s forwards}.location-description[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-description[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .4s forwards}.location-cta[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-cta[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .5s forwards}.location-map[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(20px)}.location-map[data-astro-cid-5gdy3rwf].animate{animation:slideInRight .8s ease-out .4s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n"}],"routeData":{"route":"/about","isIndex":false,"type":"page","pattern":"^\\/about\\/?$","segments":[[{"content":"about","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/about.astro","pathname":"/about","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"}],"routeData":{"route":"/cms-example","isIndex":false,"type":"page","pattern":"^\\/cms-example\\/?$","segments":[[{"content":"cms-example","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/cms-example.astro","pathname":"/cms-example","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n.location-header[data-astro-cid-5gdy3rwf]{opacity:0;animation:fadeInUp .8s ease-out forwards}.location-tabs[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-tabs[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .3s forwards}.location-description[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-description[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .4s forwards}.location-cta[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-cta[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .5s forwards}.location-map[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(20px)}.location-map[data-astro-cid-5gdy3rwf].animate{animation:slideInRight .8s ease-out .4s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.coupon-pulse[data-astro-cid-esx7k6tr]{animation:couponPulse 2s ease-in-out infinite}.coupon-pulse[data-astro-cid-esx7k6tr]:hover{animation:none;transform:scale(1.05);transition:transform .3s ease}@keyframes couponPulse{0%,to{transform:scale(1);box-shadow:0 0 #f4c43066}50%{transform:scale(1.02);box-shadow:0 0 0 10px #f4c43000}}\n.why-image[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(-30px)}.why-image[data-astro-cid-hbs2bwk2].animate{animation:slideInLeft .8s ease-out forwards}.why-content[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(30px)}.why-content[data-astro-cid-hbs2bwk2].animate{animation:slideInRight .8s ease-out .2s forwards}.why-check-item[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"0\"]{animation:slideInRight .6s ease-out .4s forwards}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"1\"]{animation:slideInRight .6s ease-out .5s forwards}.why-button[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-button[data-astro-cid-hbs2bwk2]{animation:fadeInUp .6s ease-out .6s forwards}.why-card[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(30px)}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2]{animation:fadeInUp .8s ease-out forwards}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"0\"]{animation-delay:.2s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"1\"]{animation-delay:.4s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"2\"]{animation-delay:.6s}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.testimonials-header[data-astro-cid-dnksfipb]{opacity:0;animation:fadeInUp .8s ease-out forwards}.testimonials-carousel[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(30px)}.testimonials-carousel[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .3s forwards}.testimonials-logos[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(20px)}.testimonials-logos[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .5s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes scroll{0%{transform:translate(0)}to{transform:translate(-50%)}}.animate-scroll[data-astro-cid-dnksfipb]{animation:scroll 10s linear infinite}\n@keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}\n"}],"routeData":{"route":"/commercial-electrical","isIndex":false,"type":"page","pattern":"^\\/commercial-electrical\\/?$","segments":[[{"content":"commercial-electrical","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/commercial-electrical.astro","pathname":"/commercial-electrical","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n"}],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.animate-spin-slow[data-astro-cid-ysnczkpa]{animation:spin 8s linear infinite}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n"}],"routeData":{"route":"/financing","isIndex":false,"type":"page","pattern":"^\\/financing\\/?$","segments":[[{"content":"financing","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/financing.astro","pathname":"/financing","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n.coupon-pulse[data-astro-cid-esx7k6tr]{animation:couponPulse 2s ease-in-out infinite}.coupon-pulse[data-astro-cid-esx7k6tr]:hover{animation:none;transform:scale(1.05);transition:transform .3s ease}@keyframes couponPulse{0%,to{transform:scale(1);box-shadow:0 0 #f4c43066}50%{transform:scale(1.02);box-shadow:0 0 0 10px #f4c43000}}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.location-header[data-astro-cid-5gdy3rwf]{opacity:0;animation:fadeInUp .8s ease-out forwards}.location-tabs[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-tabs[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .3s forwards}.location-description[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-description[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .4s forwards}.location-cta[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-cta[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .5s forwards}.location-map[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(20px)}.location-map[data-astro-cid-5gdy3rwf].animate{animation:slideInRight .8s ease-out .4s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.testimonials-header[data-astro-cid-dnksfipb]{opacity:0;animation:fadeInUp .8s ease-out forwards}.testimonials-carousel[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(30px)}.testimonials-carousel[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .3s forwards}.testimonials-logos[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(20px)}.testimonials-logos[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .5s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes scroll{0%{transform:translate(0)}to{transform:translate(-50%)}}.animate-scroll[data-astro-cid-dnksfipb]{animation:scroll 10s linear infinite}\n.why-image[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(-30px)}.why-image[data-astro-cid-hbs2bwk2].animate{animation:slideInLeft .8s ease-out forwards}.why-content[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(30px)}.why-content[data-astro-cid-hbs2bwk2].animate{animation:slideInRight .8s ease-out .2s forwards}.why-check-item[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"0\"]{animation:slideInRight .6s ease-out .4s forwards}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"1\"]{animation:slideInRight .6s ease-out .5s forwards}.why-button[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-button[data-astro-cid-hbs2bwk2]{animation:fadeInUp .6s ease-out .6s forwards}.why-card[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(30px)}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2]{animation:fadeInUp .8s ease-out forwards}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"0\"]{animation-delay:.2s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"1\"]{animation-delay:.4s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"2\"]{animation-delay:.6s}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n@keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}\n"}],"routeData":{"route":"/ground-up-construction","isIndex":false,"type":"page","pattern":"^\\/ground-up-construction\\/?$","segments":[[{"content":"ground-up-construction","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/ground-up-construction.astro","pathname":"/ground-up-construction","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n.location-header[data-astro-cid-5gdy3rwf]{opacity:0;animation:fadeInUp .8s ease-out forwards}.location-tabs[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-tabs[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .3s forwards}.location-description[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-description[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .4s forwards}.location-cta[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-cta[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .5s forwards}.location-map[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(20px)}.location-map[data-astro-cid-5gdy3rwf].animate{animation:slideInRight .8s ease-out .4s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n"}],"routeData":{"route":"/location","isIndex":false,"type":"page","pattern":"^\\/location\\/?$","segments":[[{"content":"location","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/location.astro","pathname":"/location","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/robots.txt","pattern":"^\\/robots\\.txt$","segments":[[{"content":"robots.txt","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/robots.txt.mjs","pathname":"/robots.txt","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n@keyframes fadeIn{to{opacity:1}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}@keyframes scaleIn{to{opacity:1;transform:scale(1)}}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}.animate-spin-slow[data-astro-cid-p7sdbsda]{animation:spin 8s linear infinite}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n.services-header[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out forwards}.services-tabs[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out .2s forwards}.service-tab[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(20px)}.services-tabs[data-astro-cid-bp4bfslc].animate .service-tab[data-astro-cid-bp4bfslc]{animation:fadeInUp .6s ease-out forwards}.service-tab[data-astro-cid-bp4bfslc][data-index=\"0\"]{animation-delay:.3s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"1\"]{animation-delay:.4s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"2\"]{animation-delay:.5s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"3\"]{animation-delay:.6s}.services-grid[data-astro-cid-bp4bfslc]>div[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(30px)}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc]{animation:fadeInUp .8s ease-out forwards}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"0\"]{animation-delay:.1s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"1\"]{animation-delay:.2s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"2\"]{animation-delay:.3s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"3\"]{animation-delay:.4s}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n@keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}\n.portfolio-header[data-astro-cid-7kp4msfm]{animation:fadeInUp .8s ease-out forwards}.portfolio-carousel[data-astro-cid-7kp4msfm]{animation:fadeIn .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{to{opacity:1}}\n.testimonials-header[data-astro-cid-dnksfipb]{opacity:0;animation:fadeInUp .8s ease-out forwards}.testimonials-carousel[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(30px)}.testimonials-carousel[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .3s forwards}.testimonials-logos[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(20px)}.testimonials-logos[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .5s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes scroll{0%{transform:translate(0)}to{transform:translate(-50%)}}.animate-scroll[data-astro-cid-dnksfipb]{animation:scroll 10s linear infinite}\n"}],"routeData":{"route":"/santa-monica","isIndex":false,"type":"page","pattern":"^\\/santa-monica\\/?$","segments":[[{"content":"santa-monica","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/santa-monica.astro","pathname":"/santa-monica","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n.why-image[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(-30px)}.why-image[data-astro-cid-hbs2bwk2].animate{animation:slideInLeft .8s ease-out forwards}.why-content[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(30px)}.why-content[data-astro-cid-hbs2bwk2].animate{animation:slideInRight .8s ease-out .2s forwards}.why-check-item[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"0\"]{animation:slideInRight .6s ease-out .4s forwards}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"1\"]{animation:slideInRight .6s ease-out .5s forwards}.why-button[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-button[data-astro-cid-hbs2bwk2]{animation:fadeInUp .6s ease-out .6s forwards}.why-card[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(30px)}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2]{animation:fadeInUp .8s ease-out forwards}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"0\"]{animation-delay:.2s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"1\"]{animation-delay:.4s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"2\"]{animation-delay:.6s}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n.services-header[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out forwards}.services-tabs[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out .2s forwards}.service-tab[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(20px)}.services-tabs[data-astro-cid-bp4bfslc].animate .service-tab[data-astro-cid-bp4bfslc]{animation:fadeInUp .6s ease-out forwards}.service-tab[data-astro-cid-bp4bfslc][data-index=\"0\"]{animation-delay:.3s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"1\"]{animation-delay:.4s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"2\"]{animation-delay:.5s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"3\"]{animation-delay:.6s}.services-grid[data-astro-cid-bp4bfslc]>div[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(30px)}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc]{animation:fadeInUp .8s ease-out forwards}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"0\"]{animation-delay:.1s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"1\"]{animation-delay:.2s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"2\"]{animation-delay:.3s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"3\"]{animation-delay:.4s}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n.location-header[data-astro-cid-5gdy3rwf]{opacity:0;animation:fadeInUp .8s ease-out forwards}.location-tabs[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-tabs[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .3s forwards}.location-description[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-description[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .4s forwards}.location-cta[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-cta[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .5s forwards}.location-map[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(20px)}.location-map[data-astro-cid-5gdy3rwf].animate{animation:slideInRight .8s ease-out .4s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n"}],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/sitemap.xml","pattern":"^\\/sitemap\\.xml$","segments":[[{"content":"sitemap.xml","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/emdash/dist/astro/routes/sitemap.xml.mjs","pathname":"/sitemap.xml","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"_astro/Layout.7CYkmIBT.css"},{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n@keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n"}],"routeData":{"route":"/specials","isIndex":false,"type":"page","pattern":"^\\/specials\\/?$","segments":[[{"content":"specials","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/specials.astro","pathname":"/specials","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/sitemap-[collection].xml","pattern":"^\\/sitemap-([^/]+?)\\.xml\\/?$","segments":[[{"content":"sitemap-","dynamic":false,"spread":false},{"content":"collection","dynamic":true,"spread":false},{"content":".xml","dynamic":false,"spread":false}]],"params":["collection"],"component":"node_modules/emdash/dist/astro/routes/sitemap-_collection_.xml.mjs","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"external","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"inline","content":"@keyframes ring{0%,to{transform:rotate(0)}10%,30%{transform:rotate(-15deg)}20%,40%{transform:rotate(15deg)}50%{transform:rotate(0)}}@keyframes glow{0%,to{box-shadow:0 0 5px #f4c43080,0 0 10px #f4c4304d}50%{box-shadow:0 0 20px #f4c430cc,0 0 30px #f4c43080,0 0 40px #f4c4304d}}.animate-ring[data-astro-cid-gfykqide]{animation:ring 2s ease-in-out infinite}.animate-glow[data-astro-cid-gfykqide]{animation:glow 2s ease-in-out infinite}a[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]{border-radius:0!important}button[data-astro-cid-6ygtcg62]:disabled{pointer-events:none}a[data-astro-cid-6ygtcg62]:hover svg[data-astro-cid-6ygtcg62],button[data-astro-cid-6ygtcg62]:hover:not(:disabled) svg[data-astro-cid-6ygtcg62]{transform:translate(4px)}@keyframes wiggle{0%,to{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@keyframes bounce{0%,to{transform:translate(0)}50%{transform:translate(4px)}}@keyframes fade-in{0%{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}.animate-fade-in[data-astro-cid-gryac3mr]{animation:fade-in .3s ease-out}\n@keyframes slideInFromRight{0%{opacity:0;transform:translate(50px)}to{opacity:1;transform:translate(0)}}@keyframes floatCoupon{0%,to{transform:scale(1)}50%{transform:scale(1.05)}}@keyframes floatCouponWithGlow{0%,to{transform:scale(1);box-shadow:0 0 30px #f4c43066,0 0 60px #f4c4304d,0 20px 60px #0000004d}50%{transform:scale(1.05);box-shadow:0 0 50px #f4c430b3,0 0 100px #f4c43080,0 20px 60px #0000004d}}.maintenance-header[data-astro-cid-mko2e4bw]{opacity:0;animation:fadeInUp .8s ease-out forwards}.maintenance-card[data-astro-cid-mko2e4bw]{opacity:0;transform:translateY(30px)}.maintenance-card[data-astro-cid-mko2e4bw].animate{animation:fadeInUp .8s ease-out forwards}.maintenance-card[data-astro-cid-mko2e4bw]:nth-child(1).animate{animation-delay:.2s}.maintenance-card[data-astro-cid-mko2e4bw]:nth-child(2).animate{animation-delay:.4s}.maintenance-card[data-astro-cid-mko2e4bw]:nth-child(3).animate{animation-delay:.6s}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n@keyframes fadeInUp{0%{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}\n@keyframes fadeIn{to{opacity:1}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}@keyframes scaleIn{to{opacity:1;transform:scale(1)}}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}.animate-spin-slow[data-astro-cid-zsov6f23]{animation:spin 8s linear infinite}@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}\n.services-header[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out forwards}.services-tabs[data-astro-cid-bp4bfslc]{opacity:0;animation:fadeInUp .8s ease-out .2s forwards}.service-tab[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(20px)}.services-tabs[data-astro-cid-bp4bfslc].animate .service-tab[data-astro-cid-bp4bfslc]{animation:fadeInUp .6s ease-out forwards}.service-tab[data-astro-cid-bp4bfslc][data-index=\"0\"]{animation-delay:.3s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"1\"]{animation-delay:.4s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"2\"]{animation-delay:.5s}.service-tab[data-astro-cid-bp4bfslc][data-index=\"3\"]{animation-delay:.6s}.services-grid[data-astro-cid-bp4bfslc]>div[data-astro-cid-bp4bfslc]{opacity:0;transform:translateY(30px)}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc]{animation:fadeInUp .8s ease-out forwards}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"0\"]{animation-delay:.1s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"1\"]{animation-delay:.2s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"2\"]{animation-delay:.3s}.services-grid[data-astro-cid-bp4bfslc].animate>div[data-astro-cid-bp4bfslc][data-service-index=\"3\"]{animation-delay:.4s}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n@keyframes spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}.animate-spin-slow[data-astro-cid-ysnczkpa]{animation:spin 8s linear infinite}\n.portfolio-header[data-astro-cid-7kp4msfm]{animation:fadeInUp .8s ease-out forwards}.portfolio-carousel[data-astro-cid-7kp4msfm]{animation:fadeIn .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes fadeIn{to{opacity:1}}\n.why-image[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(-30px)}.why-image[data-astro-cid-hbs2bwk2].animate{animation:slideInLeft .8s ease-out forwards}.why-content[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(30px)}.why-content[data-astro-cid-hbs2bwk2].animate{animation:slideInRight .8s ease-out .2s forwards}.why-check-item[data-astro-cid-hbs2bwk2]{opacity:0;transform:translate(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"0\"]{animation:slideInRight .6s ease-out .4s forwards}.why-content[data-astro-cid-hbs2bwk2].animate .why-check-item[data-astro-cid-hbs2bwk2][data-index=\"1\"]{animation:slideInRight .6s ease-out .5s forwards}.why-button[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(20px)}.why-content[data-astro-cid-hbs2bwk2].animate .why-button[data-astro-cid-hbs2bwk2]{animation:fadeInUp .6s ease-out .6s forwards}.why-card[data-astro-cid-hbs2bwk2]{opacity:0;transform:translateY(30px)}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2]{animation:fadeInUp .8s ease-out forwards}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"0\"]{animation-delay:.2s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"1\"]{animation-delay:.4s}.why-cards[data-astro-cid-hbs2bwk2].animate .why-card[data-astro-cid-hbs2bwk2][data-card-index=\"2\"]{animation-delay:.6s}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}\n.faq-header[data-astro-cid-mh6t5pw4]{opacity:0;animation:fadeInUp .8s ease-out forwards}.faq-questions[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(-30px)}.faq-questions[data-astro-cid-mh6t5pw4].animate{animation:slideInLeft .8s ease-out .3s forwards}.faq-cta[data-astro-cid-mh6t5pw4]{opacity:0;transform:translate(30px)}.faq-cta[data-astro-cid-mh6t5pw4].animate{animation:slideInRight .8s ease-out .3s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.location-header[data-astro-cid-5gdy3rwf]{opacity:0;animation:fadeInUp .8s ease-out forwards}.location-tabs[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-tabs[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .3s forwards}.location-description[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-description[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .4s forwards}.location-cta[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(-20px)}.location-cta[data-astro-cid-5gdy3rwf].animate{animation:slideInLeft .8s ease-out .5s forwards}.location-map[data-astro-cid-5gdy3rwf]{opacity:0;transform:translate(20px)}.location-map[data-astro-cid-5gdy3rwf].animate{animation:slideInRight .8s ease-out .4s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes slideInLeft{to{opacity:1;transform:translate(0)}}@keyframes slideInRight{to{opacity:1;transform:translate(0)}}\n.testimonials-header[data-astro-cid-dnksfipb]{opacity:0;animation:fadeInUp .8s ease-out forwards}.testimonials-carousel[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(30px)}.testimonials-carousel[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .3s forwards}.testimonials-logos[data-astro-cid-dnksfipb]{opacity:0;transform:translateY(20px)}.testimonials-logos[data-astro-cid-dnksfipb].animate{animation:fadeInUp .8s ease-out .5s forwards}@keyframes fadeInUp{to{opacity:1;transform:translateY(0)}}@keyframes scroll{0%{transform:translate(0)}to{transform:translate(-50%)}}.animate-scroll[data-astro-cid-dnksfipb]{animation:scroll 10s linear infinite}\n"},{"type":"external","src":"_astro/Layout.7CYkmIBT.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"serverLike":true,"middlewareMode":"classic","base":"/","trailingSlash":"ignore","compressHTML":true,"experimentalQueuedRendering":{"enabled":false,"poolSize":0,"contentCache":false},"componentMetadata":[["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/query-BJn8TOPk.mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/middleware.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:middleware",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:manifest",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/astro/dist/entrypoints/prerender.js",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/index.mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/apply-wJhM_bwU.mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/seed/index.mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/taxonomies-WamPVA2x.mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/taxonomies-CLs9HPE2.mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/src/astro/routes/admin.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/about.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/cms-example.astro",{"propagation":"in-tree","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/commercial-electrical.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/financing.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/ground-up-construction.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/index.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/location.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/santa-monica.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/services.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/pages/specials.astro",{"propagation":"none","containsHead":true}],["C:/Users/sabido/electrician_website/src/lib/cms.ts",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:src/pages/cms-example@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:pages",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/astro/dist/core/app/entrypoints/virtual/prod.js",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:app",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/setup/dev-bypass.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/dev-bypass@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/setup/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/disable.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/disable@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/enable.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/enable@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/uninstall.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/uninstall@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/update.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/update@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/install.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/install@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/registry/install.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/registry/install@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/plugins/updates.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/updates@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/import/wordpress/execute.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress/execute@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/reorder.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/reorder@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/schema/collections/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/schema/orphans/_slug_.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/orphans/_slug_@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/schema/orphans/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/orphans/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/taxonomies/index.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/index@_@mjs",{"propagation":"in-tree","containsHead":false}],["C:/Users/sabido/electrician_website/node_modules/emdash/dist/astro/routes/api/mcp.mjs",{"propagation":"in-tree","containsHead":false}],["\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/mcp@_@mjs",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000virtual:astro:actions/noop-entrypoint":"chunks/noop-entrypoint_BOlrdqWF.mjs","\u0000virtual:astro:session-driver":"chunks/_virtual_astro_session-driver_DYx9Bb3p.mjs","\u0000virtual:astro:server-island-manifest":"chunks/_virtual_astro_server-island-manifest_CQQ1F5PF.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/apply-wJhM_bwU.mjs":"chunks/apply-wJhM_bwU_AvjWwG50.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/load-DmXNVhst.mjs":"chunks/load-DmXNVhst_DyTgr651.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/validate-mz87i8_1.mjs":"chunks/validate-mz87i8_1_BElwTvmd.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/validation-DKHhXjPr.mjs":"chunks/validation-DKHhXjPr_DkCKe_5A.mjs","\u0000virtual:emdash/wait-until":"chunks/wait-until_C0sBMZKz.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/taxonomy-D4Uc2LsZ.mjs":"chunks/taxonomy-D4Uc2LsZ_BcrFt9f5.mjs","\u0000astro:content":"chunks/_astro_content_BUtf6gbh.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/bylines-BYHWU3T7.mjs":"chunks/bylines-BYHWU3T7_BCHhh3TY.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/taxonomies-WamPVA2x.mjs":"chunks/taxonomies-WamPVA2x_leJ5kPza.mjs","\u0000virtual:emdash/seed":"chunks/seed_K7-lG5iX.mjs","astro/entrypoints/prerender":"prerender-entry.BgupNCx9.mjs","\u0000virtual:astro:middleware":"virtual_astro_middleware.mjs","@astrojs/vercel/entrypoint":"entry.mjs","\u0000virtual:astro:page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_DvxAY-Vq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/well-known/auth@_@mjs":"chunks/auth_ChwqhmOP.mjs","\u0000virtual:astro:page:node_modules/emdash/src/astro/routes/admin@_@astro":"chunks/admin_eyil3iVR.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/_domain_@_@mjs":"chunks/_domain__BHOLJDH0.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/allowed-domains/index@_@mjs":"chunks/index_vB19Wlu7.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/api-tokens/_id_@_@mjs":"chunks/_id__UcIWSp0C.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/api-tokens/index@_@mjs":"chunks/index_CWjEQWSA.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/translations@_@mjs":"chunks/translations_2MeSgeC8.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/bylines/_id_/index@_@mjs":"chunks/index_DOVtaGUc.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/bylines/index@_@mjs":"chunks/index_CosHWJAW.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/comments/bulk@_@mjs":"chunks/bulk_B4Darcdn.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/comments/counts@_@mjs":"chunks/counts_D71KuqRF.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/comments/_id_/status@_@mjs":"chunks/status_DB5u63Ai.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/comments/_id_@_@mjs":"chunks/_id__pj7fQRyQ.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/comments/index@_@mjs":"chunks/index_Cbw1SKVF.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/_hookName_@_@mjs":"chunks/_hookName__DJUrklcs.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/hooks/exclusive/index@_@mjs":"chunks/index_BSQWbA2r.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/_id_@_@mjs":"chunks/_id__RAuRB8DK.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/oauth-clients/index@_@mjs":"chunks/index_CRYuxgV8.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/icon@_@mjs":"chunks/icon_BjKmH5yp.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/install@_@mjs":"chunks/install_SjyWCcCr.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/_id_/index@_@mjs":"chunks/index_DuhHEpo5.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/marketplace/index@_@mjs":"chunks/index_OfEozYge.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/registry/install@_@mjs":"chunks/install_DJs6gho7.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/updates@_@mjs":"chunks/updates_DHJrtLKm.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/disable@_@mjs":"chunks/disable_C39CmBui.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/enable@_@mjs":"chunks/enable_DSbR92or.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/content-C0ooIs-f.mjs":"chunks/content-C0ooIs-f_Bwo8eX_E.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/fts-manager-Mnrtn-r2.mjs":"chunks/fts-manager-Mnrtn-r2_V9gjL7bx.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/query-BJn8TOPk.mjs":"chunks/query-BJn8TOPk_cu-tTSgy.mjs","\u0000virtual:emdash/config":"chunks/config_kQwpNaU2.mjs","\u0000virtual:emdash/dialect":"chunks/dialect_D_z8L6bH.mjs","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/auth/dist/adapters/kysely.mjs":"chunks/kysely_B71kB-eV.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/cache-CNk1jIxp.mjs":"chunks/cache-CNk1jIxp_DFeVYLPD.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/chunks-BkfVdD-3.mjs":"chunks/chunks-BkfVdD-3_DFCxAf1E.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/uninstall@_@mjs":"chunks/uninstall_CMoIYMNk.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/update@_@mjs":"chunks/update_CPXOuuUC.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/_id_/index@_@mjs":"chunks/index_BoSABWM5.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/plugins/index@_@mjs":"chunks/index_BFOB52ow.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/thumbnail@_@mjs":"chunks/thumbnail_YPBTk4tq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/_id_/index@_@mjs":"chunks/index_IGc5LS47.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/themes/marketplace/index@_@mjs":"chunks/index_CT8iKS_P.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/users/_id_/disable@_@mjs":"chunks/disable_BbJUAOO8.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/users/_id_/enable@_@mjs":"chunks/enable_BiXDFam0.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/users/_id_/send-recovery@_@mjs":"chunks/send-recovery_DDKvWvKb.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/users/_id_/index@_@mjs":"chunks/index_C5r5Haxf.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/admin/users/index@_@mjs":"chunks/index_Blun0Ql-.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/dev-bypass@_@mjs":"chunks/dev-bypass_D0p_gj5H.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/invite/accept@_@mjs":"chunks/accept_CnC3DoDa.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/invite/complete@_@mjs":"chunks/complete_CMXjoJqr.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/invite/register-options@_@mjs":"chunks/register-options_tjGEAxU7.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/invite/index@_@mjs":"chunks/index_DNKPV79i.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/logout@_@mjs":"chunks/logout_Dgmuu8H0.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/magic-link/send@_@mjs":"chunks/send_BXVW8ksd.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/magic-link/verify@_@mjs":"chunks/verify_DYDM-0BA.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/me@_@mjs":"chunks/me_GIaolPbC.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/mode@_@mjs":"chunks/mode_DeTfJa4x.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_/callback@_@mjs":"chunks/callback_CegRAvpp.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/oauth/_provider_@_@mjs":"chunks/_provider__5wRVV4cj.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/passkey/options@_@mjs":"chunks/options_CdVfR7bI.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/passkey/register/options@_@mjs":"chunks/options_B1S9LiHe.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/passkey/register/verify@_@mjs":"chunks/verify_DaYXBBAB.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/passkey/verify@_@mjs":"chunks/verify_B2FyQpX6.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/passkey/_id_@_@mjs":"chunks/_id__D3NK-Z0m.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/passkey/index@_@mjs":"chunks/index_pC0rJlxE.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/signup/complete@_@mjs":"chunks/complete_hhDG9Kau.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/signup/request@_@mjs":"chunks/request_BEobfST1.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/auth/signup/verify@_@mjs":"chunks/verify_DzVVtD64.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/comments/_collection_/_contentId_/index@_@mjs":"chunks/index_Br01rMmq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/trash@_@mjs":"chunks/trash_C3eN83Wn.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/compare@_@mjs":"chunks/compare_BH4qoh7m.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/discard-draft@_@mjs":"chunks/discard-draft_Btyu5w5Z.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/duplicate@_@mjs":"chunks/duplicate_CRUYidvL.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/permanent@_@mjs":"chunks/permanent_Dj48UNI_.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/preview-url@_@mjs":"chunks/preview-url_z3RoIjnz.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/publish@_@mjs":"chunks/publish_TPh57afY.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/restore@_@mjs":"chunks/restore_DiqP6DEq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/revisions@_@mjs":"chunks/revisions_B8ACalt9.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/schedule@_@mjs":"chunks/schedule_hfqQPDOJ.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/terms/_taxonomy_@_@mjs":"chunks/_taxonomy__B-QyUiv3.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/translations@_@mjs":"chunks/translations_XpZDXulD.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_/unpublish@_@mjs":"chunks/unpublish_0Y1p8POO.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/_id_@_@mjs":"chunks/_id__BXdJ2GZD.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/content/_collection_/index@_@mjs":"chunks/index_RT5MLTKM.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/dashboard@_@mjs":"chunks/dashboard_8WgxWOYg.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/dev/emails@_@mjs":"chunks/emails_C8XgrbP6.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/probe@_@mjs":"chunks/probe_OyvRXGM-.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress/analyze@_@mjs":"chunks/analyze_CzpFgcqc.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress/execute@_@mjs":"chunks/execute_BHbMG-lq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress/media@_@mjs":"chunks/media_BN-HlTbb.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress/prepare@_@mjs":"chunks/prepare_B1r-yaaq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress/rewrite-urls@_@mjs":"chunks/rewrite-urls_g53-9N7L.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/analyze@_@mjs":"chunks/analyze_CYI5arkC.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/callback@_@mjs":"chunks/callback_hZBIJxVt.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/import/wordpress-plugin/execute@_@mjs":"chunks/execute_Dix9pylP.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/manifest@_@mjs":"chunks/manifest_B_x5vygz.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/mcp@_@mjs":"chunks/mcp_BIFxcMUP.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media/file/_...key_@_@mjs":"chunks/_.._-Zgg98on.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/_itemId_@_@mjs":"chunks/_itemId__DSMtUarT.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media/providers/_providerId_/index@_@mjs":"chunks/index_qEUiL-1R.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media/providers/index@_@mjs":"chunks/index_DsjksQ-_.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media/upload-url@_@mjs":"chunks/upload-url_KIHVOXla.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media/_id_/confirm@_@mjs":"chunks/confirm_DVovc8l0.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media/_id_@_@mjs":"chunks/_id__C-H1SUjv.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/media@_@mjs":"chunks/media_DaZraXiY.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/menus/_name_/items/_id_@_@mjs":"chunks/_id__CUOKK-o_.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/menus-Bjf5R1Qq.mjs":"chunks/menus-Bjf5R1Qq_BkGIWiJ8.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/menus/_name_/items@_@mjs":"chunks/items_CpTNSs1D.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/menus/_name_/reorder@_@mjs":"chunks/reorder_BgIoUEMW.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/menus/_name_/translations@_@mjs":"chunks/translations_RnxQHXY2.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/menus/_name_@_@mjs":"chunks/_name__Bp1wwgIW.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/menus/index@_@mjs":"chunks/index_CTKh8lsw.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/device/authorize@_@mjs":"chunks/authorize_CAE4PWNS.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/device/code@_@mjs":"chunks/code_CkZNFwlx.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/device/token@_@mjs":"chunks/token_CT73kE4f.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/register@_@mjs":"chunks/register_DZWoetWs.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/token/refresh@_@mjs":"chunks/refresh_6AH3lrkg.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/token/revoke@_@mjs":"chunks/revoke_BmyNg-J1.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/token@_@mjs":"chunks/token_BcFPPs-I.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/plugins/_pluginId_/_...path_@_@mjs":"chunks/_.._B0JpxGZR.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/redirects/404s/summary@_@mjs":"chunks/summary_Bjhdkdf-.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/redirects/404s/index@_@mjs":"chunks/index_xNso-ksJ.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/redirects/_id_@_@mjs":"chunks/_id__B4VQOFof.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/redirects/index@_@mjs":"chunks/index_D8uS0Xg-.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/restore@_@mjs":"chunks/restore_BH46n7fS.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/revisions/_revisionId_/index@_@mjs":"chunks/index_D-Z0KY2z.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/reorder@_@mjs":"chunks/reorder_CDG0vdWN.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/_fieldSlug_@_@mjs":"chunks/_fieldSlug__CLsSGyIp.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/fields/index@_@mjs":"chunks/index_D-8qZHmj.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/_slug_/index@_@mjs":"chunks/index_C_7eUcSI.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/collections/index@_@mjs":"chunks/index_CaGC5sjK.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/orphans/_slug_@_@mjs":"chunks/_slug__BD6wBUHk.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/orphans/index@_@mjs":"chunks/index_D7abi--L.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/schema/index@_@mjs":"chunks/index_B5Mu1lx_.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/search/enable@_@mjs":"chunks/enable_wZi9O2WF.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/search/rebuild@_@mjs":"chunks/rebuild_xyuph4L8.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/search/stats@_@mjs":"chunks/stats_D98b4ELs.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/search-By-NN3da.mjs":"chunks/search-By-NN3da_BHnv-BlX.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/search/suggest@_@mjs":"chunks/suggest_CYlrCFcL.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/search/index@_@mjs":"chunks/index_DHhd71Hd.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/sections/_slug_@_@mjs":"chunks/_slug__CddA8Exp.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/sections/index@_@mjs":"chunks/index_YCNknLkK.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/settings/email@_@mjs":"chunks/email_1AawTqr3.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/settings@_@mjs":"chunks/settings_TOLCs4aS.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/settings-CJnKiWuR.mjs":"chunks/settings-CJnKiWuR_DQ6u9CPP.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/admin-verify@_@mjs":"chunks/admin-verify_1rKWktlv.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/admin@_@mjs":"chunks/admin_8Cc2_Lfq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/dev-bypass@_@mjs":"chunks/dev-bypass_DAz_6lrs.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/dev-reset@_@mjs":"chunks/dev-reset_BocJRX_d.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/status@_@mjs":"chunks/status_RWeanZRk.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/setup/index@_@mjs":"chunks/index_CsbxbWzm.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/snapshot@_@mjs":"chunks/snapshot_BKAsAzRh.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_/translations@_@mjs":"chunks/translations_BAW1NZ0_.mjs","C:/Users/sabido/electrician_website/node_modules/emdash/dist/taxonomies-CLs9HPE2.mjs":"chunks/taxonomies-CLs9HPE2_BQA_DL6v.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/_slug_@_@mjs":"chunks/_slug__sijIA6-k.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/_name_/terms/index@_@mjs":"chunks/index_I5r-6Cod.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/taxonomies/index@_@mjs":"chunks/index_DB4jRKBk.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/themes/preview@_@mjs":"chunks/preview_Dk0O_EqD.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/typegen@_@mjs":"chunks/typegen_Bv_vGwAM.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/reorder@_@mjs":"chunks/reorder_D28Z7qpZ.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets/_id_@_@mjs":"chunks/_id__ByBWokF-.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/widget-areas/_name_/widgets@_@mjs":"chunks/widgets_C46sN9zL.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/widget-areas/_name_@_@mjs":"chunks/_name__B2Bv4PvJ.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/widget-areas/index@_@mjs":"chunks/index_C3f8C6q_.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/widget-components@_@mjs":"chunks/widget-components_Owqa0UKS.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/oauth/authorize@_@mjs":"chunks/authorize_BhjhKv6E.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/well-known/oauth-authorization-server@_@mjs":"chunks/oauth-authorization-server_Bf_vXnKq.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/api/well-known/oauth-protected-resource@_@mjs":"chunks/oauth-protected-resource_By_ETpcF.mjs","\u0000virtual:astro:page:src/pages/about@_@astro":"chunks/about_DzWr4KUJ.mjs","\u0000virtual:astro:page:src/pages/cms-example@_@astro":"chunks/cms-example_C2h7RA3C.mjs","\u0000virtual:astro:page:src/pages/commercial-electrical@_@astro":"chunks/commercial-electrical_CnFO-h5L.mjs","\u0000virtual:astro:page:src/pages/contact@_@astro":"chunks/contact_D2qfk7pb.mjs","\u0000virtual:astro:page:src/pages/financing@_@astro":"chunks/financing_B4w4Fjd0.mjs","\u0000virtual:astro:page:src/pages/ground-up-construction@_@astro":"chunks/ground-up-construction_oVPdjueX.mjs","\u0000virtual:astro:page:src/pages/location@_@astro":"chunks/location_BSCTCfVb.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/robots.txt@_@mjs":"chunks/robots_DouGDxeG.mjs","\u0000virtual:astro:page:src/pages/santa-monica@_@astro":"chunks/santa-monica_CeFrnueH.mjs","\u0000virtual:astro:page:src/pages/services@_@astro":"chunks/services_euToMGS-.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/sitemap.xml@_@mjs":"chunks/sitemap_CoIy3tCF.mjs","\u0000virtual:astro:page:src/pages/specials@_@astro":"chunks/specials_GEz_HH9w.mjs","\u0000virtual:astro:page:node_modules/emdash/dist/astro/routes/sitemap-_collection_.xml@_@mjs":"chunks/sitemap-_collection__C20eGuYR.mjs","\u0000virtual:astro:page:src/pages/index@_@astro":"chunks/index_a_rZdRw5.mjs","C:/Users/sabido/electrician_website/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_DN-zYevE.mjs","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-CXZHQHKt.js":"_astro/messages-CXZHQHKt.QQPp85y8.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-B4SjKBpv.js":"_astro/messages-B4SjKBpv.DqvoL0Ny.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-Cz2f6Su-.js":"_astro/messages-Cz2f6Su-.DdllUnOK.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-rxCTcw_6.js":"_astro/messages-rxCTcw_6.B1PBE1FU.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-CX3dih9c.js":"_astro/messages-CX3dih9c.CCei4mvQ.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-B1vNWgt7.js":"_astro/messages-B1vNWgt7.CYvjwd8Y.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-BMFLZDHo.js":"_astro/messages-BMFLZDHo.D13cVAYN.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-DW1BWiJ5.js":"_astro/messages-DW1BWiJ5.NzZZAMHv.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-zuRDwn8n.js":"_astro/messages-zuRDwn8n.BFBy2Fmw.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-CA-O-TjM.js":"_astro/messages-CA-O-TjM.BmQ29ePh.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-BWDz4uQu.js":"_astro/messages-BWDz4uQu.BrWypwuq.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-hYPn9ilH.js":"_astro/messages-hYPn9ilH.DVzMeXI_.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-qYhBOhtE.js":"_astro/messages-qYhBOhtE.B_G51R23.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-BXt6OWYC.js":"_astro/messages-BXt6OWYC.B1_lU7I7.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-wpqHOBfn.js":"_astro/messages-wpqHOBfn.AI5SEnD9.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/dist/messages-DpMKfmmV.js":"_astro/messages-DpMKfmmV.B74wrE4d.js","C:/Users/sabido/electrician_website/node_modules/emdash/dist/schema-Djdlfi5G.mjs":"chunks/schema-Djdlfi5G_Fa5xGGKC.mjs","\u0000astro:asset-imports":"chunks/_astro_asset-imports_D9aVaOQr.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BcEe_9wP.mjs","emdash/routes/PluginRegistry":"_astro/PluginRegistry.DSm1ROop.js","C:/Users/sabido/electrician_website/src/components/sections/About.astro?astro&type=script&index=0&lang.ts":"_astro/About.astro_astro_type_script_index_0_lang.BxtCjQXD.js","C:/Users/sabido/electrician_website/src/components/sections/Services.astro?astro&type=script&index=0&lang.ts":"_astro/Services.astro_astro_type_script_index_0_lang.DxVg1PX8.js","C:/Users/sabido/electrician_website/src/components/sections/Stats.astro?astro&type=script&index=0&lang.ts":"_astro/Stats.astro_astro_type_script_index_0_lang.C1Qp4Yji.js","C:/Users/sabido/electrician_website/src/components/sections/FAQ.astro?astro&type=script&index=0&lang.ts":"_astro/FAQ.astro_astro_type_script_index_0_lang.Voy5sKat.js","C:/Users/sabido/electrician_website/src/components/sections/Location.astro?astro&type=script&index=0&lang.ts":"_astro/Location.astro_astro_type_script_index_0_lang.OWfdeYwt.js","C:/Users/sabido/electrician_website/src/components/sections/FloatingOffer.astro?astro&type=script&index=0&lang.ts":"_astro/FloatingOffer.astro_astro_type_script_index_0_lang.DNOnWKez.js","C:/Users/sabido/electrician_website/src/components/sections/OfferModal.astro?astro&type=script&index=0&lang.ts":"_astro/OfferModal.astro_astro_type_script_index_0_lang.C1-b2-Yk.js","C:/Users/sabido/electrician_website/src/components/sections/WhyChooseUs.astro?astro&type=script&index=0&lang.ts":"_astro/WhyChooseUs.astro_astro_type_script_index_0_lang.C26RBmFo.js","C:/Users/sabido/electrician_website/src/components/sections/Coupons.astro?astro&type=script&index=0&lang.ts":"_astro/Coupons.astro_astro_type_script_index_0_lang.BzX9DrEs.js","C:/Users/sabido/electrician_website/src/components/sections/Testimonials.astro?astro&type=script&index=0&lang.ts":"_astro/Testimonials.astro_astro_type_script_index_0_lang.D9J6ALdI.js","C:/Users/sabido/electrician_website/src/components/sections/Financing.astro?astro&type=script&index=0&lang.ts":"_astro/Financing.astro_astro_type_script_index_0_lang.CgUGJkqo.js","C:/Users/sabido/electrician_website/src/components/sections/Home.astro?astro&type=script&index=0&lang.ts":"_astro/Home.astro_astro_type_script_index_0_lang.oHUrSFIs.js","C:/Users/sabido/electrician_website/src/components/sections/CTABanner.astro?astro&type=script&index=0&lang.ts":"_astro/CTABanner.astro_astro_type_script_index_0_lang.GitLPqz7.js","C:/Users/sabido/electrician_website/src/components/sections/MaintenancePlan.astro?astro&type=script&index=0&lang.ts":"_astro/MaintenancePlan.astro_astro_type_script_index_0_lang.CLF7Ec-s.js","C:/Users/sabido/electrician_website/src/components/sections/Portfolio.astro?astro&type=script&index=0&lang.ts":"_astro/Portfolio.astro_astro_type_script_index_0_lang.7MmnX2k5.js","C:/Users/sabido/electrician_website/src/components/sections/AboutSantaMonica.astro?astro&type=script&index=0&lang.ts":"_astro/AboutSantaMonica.astro_astro_type_script_index_0_lang.DYK7VVRx.js","C:/Users/sabido/electrician_website/src/components/sections/WhyChooseSantaMonica.astro?astro&type=script&index=0&lang.ts":"_astro/WhyChooseSantaMonica.astro_astro_type_script_index_0_lang.C3nQvbAF.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/registry-client/dist/discovery/index.js":"_astro/index.zPAiV7HD.js","C:/Users/sabido/electrician_website/node_modules/@emdash-cms/admin/node_modules/@atcute/identity-resolver/dist/index.js":"_astro/index.aEyXvc9R.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["C:/Users/sabido/electrician_website/src/components/sections/About.astro?astro&type=script&index=0&lang.ts","const s=document.querySelector(\".counter\");if(s){const t=parseInt(s.getAttribute(\"data-target\")||\"0\");let e=0;const u=t/30,d=1e3/30,o=()=>{e+=u,e<t?(s.textContent=Math.floor(e)+\"+\",setTimeout(o,d)):s.textContent=t+\"+\"},r=new IntersectionObserver(b=>{b.forEach(n=>{n.isIntersecting&&(o(),r.unobserve(n.target))})},{threshold:.5});r.observe(s)}const l={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},a=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting&&(e.target.classList.contains(\"about-images\")&&(e.target.querySelector(\".about-image-1\")?.classList.add(\"animate-[slideInLeft_0.8s_ease-out_0.2s_forwards]\"),e.target.querySelector(\".about-image-2\")?.classList.add(\"animate-[slideInRight_0.8s_ease-out_0.4s_forwards]\"),e.target.querySelector(\".about-experience-card\")?.classList.add(\"animate-[scaleIn_0.6s_ease-out_0.6s_forwards]\")),e.target.classList.contains(\"about-content\")&&(e.target.classList.add(\"animate-[fadeIn_0.8s_ease-out_0.3s_forwards]\"),e.target.querySelector(\".about-cards\")?.classList.add(\"animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]\"),e.target.querySelector(\".about-button\")?.classList.add(\"animate-[fadeInUp_0.8s_ease-out_0.7s_forwards]\")),a.unobserve(e.target))})},l),c=document.querySelector(\".about-images\"),i=document.querySelector(\".about-content\");c&&a.observe(c);i&&a.observe(i);"],["C:/Users/sabido/electrician_website/src/components/sections/Services.astro?astro&type=script&index=0&lang.ts","const d={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},a=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add(\"animate\"),a.unobserve(t.target))})},d),n=document.querySelector(\".services-tabs\"),l=document.querySelectorAll(\".services-grid\");n&&a.observe(n);l.forEach(e=>a.observe(e));const i=document.querySelectorAll(\".service-tab\"),b=document.querySelectorAll(\".service-content\");i.forEach(e=>{e.addEventListener(\"click\",()=>{const t=e.getAttribute(\"data-category\");i.forEach(r=>{r.classList.remove(\"active\",\"bg-gradient-to-r\",\"from-[#F4C430]\",\"to-[#e5b52a]\",\"text-black\",\"border-transparent\"),r.classList.add(\"bg-white\",\"text-gray-700\",\"border-2\",\"border-gray-200\");const o=r.querySelector(\".absolute.left-1\\\\/2\");o&&o.classList.contains(\"border-t-[14px]\")&&o.remove()}),e.classList.add(\"active\",\"bg-gradient-to-r\",\"from-[#F4C430]\",\"to-[#e5b52a]\",\"text-black\",\"border-transparent\"),e.classList.remove(\"bg-white\",\"text-gray-700\",\"border-2\",\"border-gray-200\");const c=document.createElement(\"div\");c.className=\"absolute left-1/2 -translate-x-1/2 -bottom-3 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[14px] border-t-[#e5b52a] drop-shadow-md\",e.appendChild(c),b.forEach(r=>r.classList.add(\"hidden\"));const s=document.querySelector(`.service-content[data-category=\"${t}\"]`);if(s){s.classList.remove(\"hidden\");const r=s.querySelector(\".services-grid\");r&&(r.classList.remove(\"animate\"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{r.classList.add(\"animate\")})}))}})});"],["C:/Users/sabido/electrician_website/src/components/sections/Stats.astro?astro&type=script&index=0&lang.ts","function u(e){const t=parseFloat(e.getAttribute(\"data-target\")||\"0\"),n=e.getAttribute(\"data-decimal\")===\"true\",i=t/(2e3/16);let o=0;const s=()=>{o+=i,o<t?(e.textContent=n?o.toFixed(1):Math.floor(o).toString(),requestAnimationFrame(s)):e.textContent=n?t.toFixed(1):t.toString()};s()}const c=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.querySelectorAll(\".counter\").forEach(r=>{u(r)}),c.unobserve(t.target))})},{threshold:.3}),a=document.getElementById(\"stats-section\");a&&c.observe(a);"],["C:/Users/sabido/electrician_website/src/components/sections/FAQ.astro?astro&type=script&index=0&lang.ts","const u={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},r=new IntersectionObserver(t=>{t.forEach(s=>{s.isIntersecting&&(s.target.classList.add(\"animate\"),r.unobserve(s.target))})},u),c=document.querySelector(\".faq-questions\"),i=document.querySelector(\".faq-cta\");c&&r.observe(c);i&&r.observe(i);const q=document.querySelectorAll(\".faq-item\");q.forEach(t=>{const s=t.querySelector(\".faq-question\"),e=t.querySelector(\".faq-answer\"),a=t.querySelector(\".faq-icon\");s?.addEventListener(\"click\",()=>{const l=e?.style.maxHeight&&e.style.maxHeight!==\"0px\";q.forEach(o=>{const n=o.querySelector(\".faq-answer\"),f=o.querySelector(\".faq-icon\");o!==t&&n&&(n.style.maxHeight=\"0px\",f?.classList.remove(\"rotate-180\"))}),l?(e&&(e.style.maxHeight=\"0px\"),a?.classList.remove(\"rotate-180\")):(e&&requestAnimationFrame(()=>{const o=e.scrollHeight;requestAnimationFrame(()=>{e.style.maxHeight=o+\"px\"})}),a?.classList.add(\"rotate-180\"))})});"],["C:/Users/sabido/electrician_website/src/components/sections/Location.astro?astro&type=script&index=0&lang.ts","const s={threshold:.1,rootMargin:\"0px 0px -50px 0px\"},o=new IntersectionObserver(i=>{i.forEach(e=>{e.isIntersecting&&(e.target.classList.add(\"animate\"),o.unobserve(e.target))})},s),t=document.querySelector(\".location-tabs\"),c=document.querySelector(\".location-description\"),n=document.querySelector(\".location-cta\"),r=document.querySelector(\".location-map\");t&&o.observe(t);c&&o.observe(c);n&&o.observe(n);r&&o.observe(r);"],["C:/Users/sabido/electrician_website/src/components/sections/FloatingOffer.astro?astro&type=script&index=0&lang.ts","const t=document.getElementById(\"floating-offer-btn\"),e=document.getElementById(\"offer-modal\");t?.addEventListener(\"click\",()=>{e&&(e.classList.remove(\"hidden\"),e.classList.add(\"flex\"))});"],["C:/Users/sabido/electrician_website/src/components/sections/OfferModal.astro?astro&type=script&index=0&lang.ts","const n=document.getElementById(\"offer-modal\"),h=document.getElementById(\"close-modal\"),E=document.getElementById(\"maybe-later-btn\");let c=\"00\",d=\"00\",r=\"00\",l=\"00\";function e(o,s,a){const t=document.getElementById(o);t&&s!==a?(t.style.transform=\"translateY(-100%)\",t.style.opacity=\"0\",setTimeout(()=>{t.textContent=s,t.style.transform=\"translateY(100%)\",setTimeout(()=>{t.style.transform=\"translateY(0)\",t.style.opacity=\"1\"},50)},250)):t&&(t.textContent=s)}function L(){const o=new Date().getTime()+864e5,s=setInterval(()=>{const a=new Date().getTime(),t=o-a;if(t<0){clearInterval(s),e(\"countdown-days\",\"00\",c),e(\"countdown-hours\",\"00\",d),e(\"countdown-minutes\",\"00\",r),e(\"countdown-seconds\",\"00\",l);return}const g=Math.floor(t/(1e3*60*60*24)),p=Math.floor(t%(1e3*60*60*24)/(1e3*60*60)),v=Math.floor(t%(1e3*60*60)/(1e3*60)),S=Math.floor(t%(1e3*60)/1e3),u=String(g).padStart(2,\"0\"),m=String(p).padStart(2,\"0\"),f=String(v).padStart(2,\"0\"),y=String(S).padStart(2,\"0\");e(\"countdown-days\",u,c),e(\"countdown-hours\",m,d),e(\"countdown-minutes\",f,r),e(\"countdown-seconds\",y,l),c=u,d=m,r=f,l=y},1e3)}L();let w=!1;setTimeout(()=>{n&&!w&&(w=!0,n.classList.remove(\"hidden\"),n.classList.add(\"flex\"))},3e3);function i(){n&&(n.classList.add(\"hidden\"),n.classList.remove(\"flex\"))}h?.addEventListener(\"click\",i);E?.addEventListener(\"click\",i);n?.addEventListener(\"click\",o=>{o.target===n&&i()});"],["C:/Users/sabido/electrician_website/src/components/sections/WhyChooseUs.astro?astro&type=script&index=0&lang.ts","const c={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},e=new IntersectionObserver(n=>{n.forEach(t=>{t.isIntersecting&&(t.target.classList.add(\"animate\"),e.unobserve(t.target))})},c),r=document.querySelector(\".why-image\"),o=document.querySelector(\".why-content\"),s=document.querySelector(\".why-cards\");r&&e.observe(r);o&&e.observe(o);s&&e.observe(s);"],["C:/Users/sabido/electrician_website/src/components/sections/Coupons.astro?astro&type=script&index=0&lang.ts","const a={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},t=new IntersectionObserver(e=>{e.forEach(s=>{if(s.isIntersecting){const o=s.target,r=o.dataset.index,n=r===\"0\"?\"0.2s\":r===\"1\"?\"0.4s\":\"0.6s\";o.style.animation=`fadeInUp 0.8s ease-out ${n} forwards`,t.unobserve(o)}})},a);document.querySelectorAll(\".coupon-card\").forEach(e=>{t.observe(e)});"],["C:/Users/sabido/electrician_website/src/components/sections/Testimonials.astro?astro&type=script&index=0&lang.ts","const b={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},i=new IntersectionObserver(s=>{s.forEach(e=>{e.isIntersecting&&(e.target.classList.add(\"animate\"),i.unobserve(e.target))})},b),a=document.querySelector(\".testimonials-carousel\"),l=document.querySelector(\".testimonials-logos\");a&&i.observe(a);l&&i.observe(l);let t=0;const r=document.querySelector(\".testimonial-track\"),L=document.querySelectorAll(\".testimonial-slide\"),c=document.querySelectorAll(\".carousel-dot\");function p(){return window.innerWidth>=768?3:1}const d=L.length/2;function n(s=!0){const e=p(),v=-(t*(100/e));s?r.style.transition=\"transform 500ms ease-in-out\":r.style.transition=\"none\",r.style.transform=`translateX(${v}%)`;const g=t%d;c.forEach((y,S)=>{const o=y.querySelector(\"span\");o&&(S===g?(o.classList.remove(\"bg-gray-300\"),o.classList.add(\"bg-[#F4C430]\")):(o.classList.remove(\"bg-[#F4C430]\"),o.classList.add(\"bg-gray-300\")))})}function u(){t++,n(!0),t>=d&&setTimeout(()=>{t=0,n(!1)},500)}c.forEach((s,e)=>{s.addEventListener(\"click\",()=>{t=e,n(!0)})});let m=setInterval(u,5e3);const f=document.querySelector(\".testimonial-carousel\");f?.addEventListener(\"mouseenter\",()=>{clearInterval(m)});f?.addEventListener(\"mouseleave\",()=>{m=setInterval(u,5e3)});window.addEventListener(\"resize\",()=>n(!0));n(!1);"],["C:/Users/sabido/electrician_website/src/components/sections/Financing.astro?astro&type=script&index=0&lang.ts","const a={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},s=new IntersectionObserver(t=>{t.forEach(n=>{n.isIntersecting&&(n.target.classList.contains(\"financing-benefits\")?n.target.classList.add(\"animate-[slideInLeft_0.8s_ease-out_0.3s_forwards]\"):n.target.classList.contains(\"financing-options\")&&n.target.classList.add(\"animate-[slideInRight_0.8s_ease-out_0.3s_forwards]\"),s.unobserve(n.target))})},a),e=document.querySelector(\".financing-benefits\"),i=document.querySelector(\".financing-options\");e&&s.observe(e);i&&s.observe(i);"],["C:/Users/sabido/electrician_website/src/components/sections/Home.astro?astro&type=script&index=0&lang.ts","document.addEventListener(\"DOMContentLoaded\",function(){const s=[\"HOME\",\"BUSINESS\",\"FUTURE\",\"WORLD\"];let e=0;const t=document.getElementById(\"rotating-word\"),a=document.querySelectorAll(\"[data-bg-index]\");function c(){if(t&&a.length>0){const n=(e+1)%s.length;t.classList.remove(\"opacity-100\",\"translate-y-0\",\"scale-100\"),t.classList.add(\"opacity-0\",\"-translate-y-[30px]\",\"scale-[0.8]\"),a[n].classList.remove(\"opacity-0\"),a[n].classList.add(\"opacity-100\"),a[e].classList.remove(\"opacity-100\"),a[e].classList.add(\"opacity-0\"),setTimeout(()=>{e=n,t.textContent=s[e],t.classList.remove(\"opacity-0\",\"-translate-y-[30px]\",\"scale-[0.8]\"),t.classList.add(\"opacity-100\",\"translate-y-0\",\"scale-100\")},500)}}t&&(t.textContent=s[0],t.classList.add(\"opacity-100\",\"translate-y-0\",\"scale-100\")),setInterval(c,3e3)});"],["C:/Users/sabido/electrician_website/src/components/sections/CTABanner.astro?astro&type=script&index=0&lang.ts","let a=0;const s=document.querySelectorAll(\".carousel-slide\"),o=document.querySelectorAll(\".indicator\"),i=s.length;function c(t){s.forEach(e=>{e.classList.remove(\"opacity-100\",\"relative\",\"z-10\"),e.classList.add(\"opacity-0\",\"absolute\",\"inset-0\",\"pointer-events-none\")}),s[t].classList.remove(\"opacity-0\",\"absolute\",\"inset-0\",\"pointer-events-none\"),s[t].classList.add(\"opacity-100\",\"relative\",\"z-10\"),o.forEach((e,r)=>{r===t?(e.classList.remove(\"bg-gray-600\"),e.classList.add(\"bg-[#F4C430]\")):(e.classList.remove(\"bg-[#F4C430]\"),e.classList.add(\"bg-gray-600\"))}),a=t}function n(){const t=(a+1)%i;c(t)}let l=setInterval(n,3e3);o.forEach((t,e)=>{t.addEventListener(\"click\",()=>{c(e),clearInterval(l),l=setInterval(n,3e3)})});"],["C:/Users/sabido/electrician_website/src/components/sections/MaintenancePlan.astro?astro&type=script&index=0&lang.ts","const t={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},r=new IntersectionObserver(e=>{e.forEach(n=>{n.isIntersecting&&(n.target.classList.add(\"animate\"),r.unobserve(n.target))})},t);document.querySelectorAll(\".maintenance-card\").forEach(e=>{r.observe(e)});"],["C:/Users/sabido/electrician_website/src/components/sections/Portfolio.astro?astro&type=script&index=0&lang.ts","const y={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},s=new IntersectionObserver(r=>{r.forEach(t=>{t.isIntersecting&&(t.target.classList.add(\"animate\"),s.unobserve(t.target))})},y),l=document.querySelector(\".portfolio-header\"),a=document.querySelector(\".portfolio-carousel\");l&&s.observe(l);a&&s.observe(a);const n=document.querySelector(\".portfolio-track\"),d=document.querySelectorAll(\".portfolio-slide\"),w=document.querySelector(\".portfolio-prev\"),x=document.querySelector(\".portfolio-next\");let e=0;const u=d.length/2;let f=0;function p(){requestAnimationFrame(()=>{const r=d[0],t=window.getComputedStyle(n),S=parseInt(t.gap)||20;f=r.offsetWidth+S})}window.addEventListener(\"load\",p);let c;window.addEventListener(\"resize\",()=>{clearTimeout(c),c=window.setTimeout(()=>{p(),o(!1)},150)});function o(r=!0){r?n.style.transition=\"transform 500ms ease-in-out\":n.style.transition=\"none\";const t=-(e*f);n.style.transform=`translateX(${t}px)`}function i(){e++,o(!0),e>=u&&setTimeout(()=>{e=0,o(!1)},500)}function g(){e===0?(e=u,o(!1),setTimeout(()=>{e--,o(!0)},20)):(e--,o(!0))}x?.addEventListener(\"click\",i);w?.addEventListener(\"click\",g);let m=setInterval(i,3e3);const v=document.querySelector(\".portfolio-carousel\");v?.addEventListener(\"mouseenter\",()=>{clearInterval(m)});v?.addEventListener(\"mouseleave\",()=>{m=setInterval(i,3e3)});"],["C:/Users/sabido/electrician_website/src/components/sections/AboutSantaMonica.astro?astro&type=script&index=0&lang.ts","const s=document.querySelector(\".counter\");if(s){const e=parseInt(s.getAttribute(\"data-target\")||\"0\");let t=0;const d=e/30,b=1e3/30,a=()=>{t+=d,t<e?(s.textContent=Math.floor(t)+\"+\",setTimeout(a,b)):s.textContent=e+\"+\"},r=new IntersectionObserver(f=>{f.forEach(n=>{n.isIntersecting&&(a(),r.unobserve(n.target))})},{threshold:.5});r.observe(s)}const g={threshold:.2,rootMargin:\"0px 0px -50px 0px\"},o=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.contains(\"about-images\")&&t.target.querySelector(\".about-image-1\")?.classList.add(\"animate-[slideInLeft_0.8s_ease-out_0.2s_forwards]\"),t.target.classList.contains(\"about-content\")&&(t.target.classList.add(\"animate-[fadeIn_0.8s_ease-out_0.3s_forwards]\"),t.target.querySelector(\".about-button\")?.classList.add(\"animate-[fadeInUp_0.8s_ease-out_0.5s_forwards]\")),t.target.classList.contains(\"about-cards\")&&t.target.classList.add(\"animate-[fadeInUp_0.8s_ease-out_0.7s_forwards]\"),o.unobserve(t.target))})},g),c=document.querySelector(\".about-images\"),i=document.querySelector(\".about-content\"),u=document.querySelector(\".about-cards\");c&&o.observe(c);i&&o.observe(i);u&&o.observe(u);"],["C:/Users/sabido/electrician_website/src/components/sections/WhyChooseSantaMonica.astro?astro&type=script&index=0&lang.ts","const l={threshold:.1,rootMargin:\"0px 0px -50px 0px\"},s=new IntersectionObserver(e=>{e.forEach(t=>{t.isIntersecting&&(t.target.classList.add(\"opacity-100\",\"translate-y-0\",\"scale-100\"),s.unobserve(t.target))})},l),n=document.querySelector(\".text-center.mb-12\");n&&(n.classList.add(\"opacity-0\",\"translate-y-8\",\"transition-all\",\"duration-700\"),s.observe(n));const o=document.querySelectorAll(\".space-y-12\")[0];o&&o.querySelectorAll(\".flex.gap-4\").forEach((e,t)=>{e instanceof HTMLElement&&(e.classList.add(\"opacity-0\",\"-translate-x-8\",\"transition-all\",\"duration-700\"),e.style.transitionDelay=`${t*150}ms`,s.observe(e))});const a=document.querySelector(\".flex.justify-center.lg\\\\:mx-4\");a instanceof HTMLElement&&(a.classList.add(\"opacity-0\",\"scale-90\",\"transition-all\",\"duration-1000\"),a.style.transitionDelay=\"300ms\",s.observe(a));const r=document.querySelectorAll(\".space-y-12\")[1];r&&r.querySelectorAll(\".flex.gap-4\").forEach((e,t)=>{e instanceof HTMLElement&&(e.classList.add(\"opacity-0\",\"translate-x-8\",\"transition-all\",\"duration-700\"),e.style.transitionDelay=`${t*150}ms`,s.observe(e))});"]],"assets":["/24-7-service.png","/angi-certified.png","/bbb-logo.png","/certified.png","/electrixa.png","/google-reviews.webp","/licensed-insured.png","/lights.png","/_astro/index.aEyXvc9R.js","/_astro/index.zPAiV7HD.js","/_astro/messages-B1vNWgt7.CYvjwd8Y.js","/_astro/messages-B4SjKBpv.DqvoL0Ny.js","/_astro/messages-BMFLZDHo.D13cVAYN.js","/_astro/messages-BWDz4uQu.BrWypwuq.js","/_astro/messages-BXt6OWYC.B1_lU7I7.js","/_astro/messages-CA-O-TjM.BmQ29ePh.js","/_astro/messages-CX3dih9c.CCei4mvQ.js","/_astro/messages-CXZHQHKt.QQPp85y8.js","/_astro/messages-Cz2f6Su-.DdllUnOK.js","/_astro/messages-DpMKfmmV.B74wrE4d.js","/_astro/messages-DW1BWiJ5.NzZZAMHv.js","/_astro/messages-hYPn9ilH.DVzMeXI_.js","/_astro/messages-qYhBOhtE.B_G51R23.js","/_astro/messages-rxCTcw_6.B1PBE1FU.js","/_astro/messages-wpqHOBfn.AI5SEnD9.js","/_astro/messages-zuRDwn8n.BFBy2Fmw.js","/_astro/PluginRegistry.DSm1ROop.js","/_astro/fonts/08f0ea18cdf1ae81.woff2","/_astro/fonts/1633c6c006fb5995.woff2","/_astro/fonts/190f8cf059e0f931.woff2","/_astro/fonts/1d7aab50fda97bb3.woff2","/_astro/fonts/1e5097bbf9c9d577.woff2","/_astro/fonts/63342f4e10d096aa.woff2","/_astro/fonts/6ed39b447c70fac7.woff2","/_astro/fonts/81fc65a9fa1b7533.woff2","/_astro/fonts/84070159564df0be.woff2","/_astro/fonts/9593fbb8383eb01c.woff2","/_astro/fonts/a582ec5275b6220a.woff2","/_astro/fonts/a9bea187e846fcc2.woff2","/_astro/fonts/ad35ff1453ab1728.woff2","/_astro/fonts/cced06053f87829e.woff2","/_astro/fonts/d581d51cd793384e.woff2","/_astro/fonts/f52e1d65e1364c61.woff2","/_astro/Layout.7CYkmIBT.css","/_astro/admin@_@astro.CgFRJmcl.css"],"buildFormat":"directory","checkOrigin":false,"actionBodySizeLimit":1048576,"serverIslandBodySizeLimit":1048576,"allowedDomains":[],"key":"F+3I/LyWJe8zKOzcvGMUA8egBi4QiPBDeBbaIDvSlTA=","image":{},"devToolbar":{"enabled":false,"debugInfoOutput":""},"logLevel":"info","shouldInjectCspMetaTags":false}));
					const manifestRoutes = _manifest.routes;
					
					const manifest = Object.assign(_manifest, {
					  renderers,
					  actions: () => import('./noop-entrypoint_BOlrdqWF.mjs'),
					  middleware: () => import('../virtual_astro_middleware.mjs'),
					  sessionDriver: () => import('./_virtual_astro_session-driver_DYx9Bb3p.mjs'),
					  
					  serverIslandMappings: () => import('./_virtual_astro_server-island-manifest_CQQ1F5PF.mjs'),
					  routes: manifestRoutes,
					  pageMap,
					});

const createApp$1 = ({ streaming } = {}) => {
  return new App(manifest, streaming);
};

const createApp = createApp$1;

function getFirstForwardedValue(multiValueHeader) {
  return multiValueHeader?.toString()?.split(",").map((e) => e.trim())?.[0];
}
const IP_RE = /^[0-9a-fA-F.:]{1,45}$/;
function isValidIpAddress(value) {
  return IP_RE.test(value);
}
function getValidatedIpFromHeader(headerValue) {
  const raw = getFirstForwardedValue(headerValue);
  if (raw && isValidIpAddress(raw)) {
    return raw;
  }
  return void 0;
}
function getClientIpAddress(request) {
  return getValidatedIpFromHeader(request.headers.get("x-forwarded-for"));
}

const app = createApp();
var entrypoint_default = {
  async fetch(request) {
    const url = new URL(request.url);
    const middlewareSecretHeader = request.headers.get(ASTRO_MIDDLEWARE_SECRET_HEADER);
    const hasValidMiddlewareSecret = middlewareSecretHeader === middlewareSecret;
    let realPath = void 0;
    if (hasValidMiddlewareSecret) {
      realPath = request.headers.get(ASTRO_PATH_HEADER);
    } else if (request.headers.get("x-vercel-isr") === "1") {
      realPath = url.searchParams.get(ASTRO_PATH_PARAM);
    }
    if (typeof realPath === "string") {
      url.pathname = realPath;
      request = new Request(url.toString(), {
        method: request.method,
        headers: request.headers,
        ...request.body ? { body: request.body, duplex: "half" } : {}
      });
    }
    const routeData = app.match(request);
    let locals = {};
    const astroLocalsHeader = request.headers.get(ASTRO_LOCALS_HEADER);
    if (astroLocalsHeader) {
      if (!hasValidMiddlewareSecret) {
        return new Response("Forbidden", { status: 403 });
      }
      locals = JSON.parse(astroLocalsHeader);
    }
    if (hasValidMiddlewareSecret) {
      request.headers.delete(ASTRO_MIDDLEWARE_SECRET_HEADER);
    }
    const response = await app.render(request, {
      routeData,
      clientAddress: getClientIpAddress(request),
      locals
    });
    if (app.setCookieHeaders) {
      for (const setCookieHeader of app.setCookieHeaders(response)) {
        response.headers.append("Set-Cookie", setCookieHeader);
      }
    }
    return response;
  }
};

export { types as a, entrypoint_default as e, isRemoteAllowed as i, renderComponent as r, typeHandlers as t };
