import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

interface Dimensions {
  width: number;
  height: number;
  aspectRatio: string;
  maxChars: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests allowed" });
  }

  const { text, format, dimensions } = req.body;

  if (!text || !format || !dimensions) {
    return res.status(400).json({ message: "Text, format, and dimensions are required" });
  }

  if (text.length > dimensions.maxChars) {
    return res.status(400).json({ 
      message: `Text length exceeds maximum limit of ${dimensions.maxChars} characters` 
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
      return res.status(400).json({ message: "Failed to determine theme." });
    }

    // Get a suitable background image
    const pexelsResponse = await axios.get(
      `https://api.pexels.com/v1/search`,
      {
        params: { 
          query: theme,
          per_page: 1,
          orientation: format === 'post' ? 'square' : 'portrait',
          size: 'large'
        },
        headers: { Authorization: PEXELS_API_KEY },
      }
    );

    const result = pexelsResponse.data.photos;

    if (!result || result.length === 0) {
      return res.status(404).json({ 
        message: `No suitable background found for theme: ${theme}` 
      });
    }

    return res.status(200).json({ theme, result });

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const statusCode = error.response?.status || 500;
      const errorMessage = error.response?.data?.error?.message || error.message;
      
      return res.status(statusCode).json({ 
        message: "API request failed", 
        error: errorMessage 
      });
    }
    
    return res.status(500).json({ 
      message: "An unexpected error occurred." 
    });
  }
}