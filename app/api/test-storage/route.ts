import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = await createClient()

    try {
        // 1. List files
        const { data: files, error: listError } = await supabase.storage
            .from("tender-documents")
            .list("temp") // Assuming temp folder

        if (listError) {
            return NextResponse.json({ error: "List failed", details: listError }, { status: 500 })
        }

        const results = {
            filesCount: files?.length || 0,
            files: files?.slice(0, 5),
            testFetch: "Not attempted"
        }

        // 2. Try to sign and fetch the first file if exists
        if (files && files.length > 0) {
            // recursive search if it's a folder? 
            // The list command on 'temp' returns folders (user_ids) usually.
            // Let's list a user folder if we can't find files directly.
            // For now, let's just try to upload a dummy file and fetch it back.
        }

        // Better test: Upload dummy, Sign, Fetch
        const dummyContent = "Hello World PDF Content"
        const fileName = `test-connectivity-${Date.now()}.txt`

        const { error: uploadError } = await supabase.storage
            .from("tender-documents")
            .upload(fileName, dummyContent)

        if (uploadError) return NextResponse.json({ error: "Upload failed", details: uploadError }, { status: 500 })

        const { data: signData, error: signError } = await supabase.storage
            .from("tender-documents")
            .createSignedUrl(fileName, 60)

        if (signError) return NextResponse.json({ error: "Sign failed", details: signError }, { status: 500 })

        const fetchResponse = await fetch(signData.signedUrl)
        const fetchText = await fetchResponse.text()

        return NextResponse.json({
            success: true,
            upload: "OK",
            sign: "OK",
            fetchStatus: fetchResponse.status,
            fetchedContent: fetchText,
            match: fetchText === dummyContent
        })

    } catch (err: any) {
        return NextResponse.json({ error: "Exception", details: err.message }, { status: 500 })
    }
}
