import { PDFDocument } from "pdf-lib"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.type !== "application/pdf") {
      return Response.json({ error: "File must be a PDF" }, { status: 400 })
    }

    console.log("[v0] Extracting PDF form fields from:", file.name)

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const form = pdfDoc.getForm()
    const fields = form.getFields()

    console.log("[v0] Found", fields.length, "form fields in PDF")

    const fieldInfo = fields.map((field) => {
      const name = field.getName()
      const type = field.constructor.name

      let fieldType = "text"
      if (type === "PDFCheckBox") fieldType = "checkbox"
      else if (type === "PDFRadioGroup") fieldType = "radio"
      else if (type === "PDFDropdown") fieldType = "select"
      else if (type === "PDFTextField") fieldType = "text"

      return {
        name,
        type: fieldType,
        originalType: type,
      }
    })

    console.log("[v0] Extracted field info:", fieldInfo.slice(0, 5))

    return Response.json({ fields: fieldInfo })
  } catch (error: any) {
    console.error("[v0] Error extracting PDF fields:", error)
    return Response.json(
      {
        error: "Failed to extract PDF fields",
        details: error?.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
