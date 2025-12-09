import { generateText, createGateway } from "ai"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { imageBase64, prompt, apiKey } = await req.json()

    if (!apiKey) {
      return Response.json({ error: "API key is required" }, { status: 401 })
    }

    if (!imageBase64 || !prompt) {
      return Response.json({ error: "Image and prompt are required" }, { status: 400 })
    }

    // Extract the base64 data (remove data URL prefix if present)
    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64

    // Determine media type from the data URL
    const mediaType = imageBase64.includes("data:") ? imageBase64.split(";")[0].split(":")[1] : "image/jpeg"

    const gateway = createGateway({ apiKey })

    const comicPrompt = `You are a creative comic strip artist. Based on the provided photo of a dog and the user's story prompt, generate a series of 4 cartoon-style comic panels that tell the story.

User's Story Prompt: "${prompt}"

Instructions:
1. Generate 4 distinct comic panels that tell a cohesive story
2. Each panel should be in a cartoon/comic book style with bold outlines and vibrant colors
3. The dog from the photo should be the main character, rendered in a cartoon style while keeping recognizable features
4. Include action, expressions, and dynamic compositions
5. Make it fun, engaging, and family-friendly
6. Add comic-style elements like action lines, speech bubbles mentally noted (describe where they'd go)

Also provide a brief narrative text (2-3 sentences) summarizing the comic strip story.

Generate the comic panels now.`

    const result = await generateText({
      model: gateway("google/gemini-3-pro-image-preview"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: comicPrompt,
            },
            {
              type: "file",
              data: base64Data,
              mediaType: mediaType,
            },
          ],
        },
      ],
      maxOutputTokens: 4096,
    })

    const images = []
    for (const file of result.files) {
      if (file.mediaType.startsWith("image/")) {
        images.push({
          base64: file.base64,
          mediaType: file.mediaType,
        })
      }
    }

    return Response.json({
      text: result.text,
      images,
      usage: result.usage,
      finishReason: result.finishReason,
    })
  } catch (error) {
    console.error("Error generating comic:", error)
    const message = error instanceof Error ? error.message : "Failed to generate comic strip"
    return Response.json({ error: message }, { status: 500 })
  }
}
