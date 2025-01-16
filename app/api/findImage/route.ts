import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const PEXELS_API_KEY = process.env.PEXELS_ACCESS_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export const POST = async (req: NextRequest) =>{

  const { text, format, dimensions } = await req.json();

  if (!text || !format || !dimensions) {
    return new NextResponse("Not enough data to create a product", {
      status: 400,
    });
  }

  if (text.length > dimensions.maxChars) {

    return new NextResponse(`Text length exceeds maximum limit of ${dimensions.maxChars} characters`, {
      status: 400,
    });
  }

  try {
    // Get mood and visual theme for the content
    const openAiResponse = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are an expert at determining visual themes for Instagram ${format}s. 
                     Return only 1-2 keywords that would make a good background.`
          },
          {
            role: "user",
            content: `Suggest a background theme for this Instagram ${format}: "${text}"`
          },
        ],
        max_tokens: 10,
        temperature: 0.3,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const theme = openAiResponse.data.choices[0]?.message?.content?.trim();

    if (!theme) {
      return new NextResponse("Failed to determine theme", {
        status: 400,
      });
    }

    // Get a suitable background image
    const pexelsResponse = await axios.get(
      'https://api.pexels.com/v1/search',
      { 
        headers: { 
          'Authorization': `${PEXELS_API_KEY}` 
        },
        params: {
          query: theme,
          per_page: 1,
          orientation: format === 'post' ? 'square' : 'portrait',
          size: 'large'
        }
      }
    );

    const result = pexelsResponse.data.photos[0].src[`${format === 'post' ? 'large' : 'portrait'}`];

    if (!result || result.length === 0) {
      return new NextResponse(`No suitable background found for theme: ${theme}`, { status: 404 })
    }

    return NextResponse.json(result, { status: 201 });

  } catch (error :any) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    return new NextResponse(`Request failed : ${errorMessage}`, { status: 500 });
  }
}