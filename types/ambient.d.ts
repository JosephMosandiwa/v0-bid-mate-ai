// Minimal ambient/type shims to reduce compile noise during triage

declare module "@/lib/types" {
  export type PinTenderOptions = any
}

declare module "@/lib/types/tender" {
  export type AnalyzedTender = any
  export type Tender = any
}

// Provide cheerio namespace typings used across scrapers
declare namespace cheerio {
  type Element = any
  type Cheerio<T = Element> = any

  interface CheerioAPI {
    (selector: string, context?: any): Cheerio
    load: (html: string) => CheerioAPI
    html: (elem?: any) => string | null
    text: (elem?: any) => string
    attr: (elem: any, name: string) => string | undefined
    find: (selector: string) => Cheerio
    toArray: () => Element[]
    [key: string]: any
  }
}

declare module "cheerio" {
  const cheerio: cheerio.CheerioAPI
  export = cheerio
  export as namespace cheerio
}

declare module "pdf-lib" {
  interface PDFField {
    setText?(value: string): void
    check?(): void
    uncheck?(): void
    select?(value: string): void
    getName?(): string
    acroField?: any
  }

  interface PDFTextField extends PDFField {}
  interface PDFCheckBox extends PDFField {}
  interface PDFRadioGroup extends PDFField {}
  interface PDFDropdown extends PDFField {}
}

declare module "pdf-lib" {
  export class PDFDocument {
    static load(bytes: Uint8Array | ArrayBuffer, options?: any): Promise<any>
    static create(): any
    getForm: () => any
    getPages: () => any[]
    getPageIndices: () => number[]
    copyPages: (source: PDFDocument, indices: number[]) => Promise<any[]>
    getPageCount: () => number
    addPage: (size?: any) => any
    save: () => Promise<Uint8Array>
    embedFont: (font: any) => Promise<any>
    getTitle: () => string | null
    getAuthor: () => string | null
    getSubject: () => string | null
    getCreator: () => string | null
    getProducer: () => string | null
    getCreationDate: () => Date | undefined
    getModificationDate: () => Date | undefined
  }

  // Provide runtime values so `instanceof PDFTextField` checks compile
  export const PDFTextField: any
  export const PDFCheckBox: any
  export const PDFRadioGroup: any
  export const PDFDropdown: any
  export const rgb: (...args: any[]) => any
  export const StandardFonts: any
}
