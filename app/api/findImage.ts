import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST requests are allowed" });
  }

  const { postText } = req.body;

  if (!postText) {
    return res.status(400).json({ message: "Post text is required." });
  }

  try {

    const openAiResponse = await axios.post(
      "https://api.openai.com/v1/completions",
      {
        model: "text-davinci-003",
        prompt: `Generate a list of keywords or themes for this text: "${postText}"`,
        max_tokens: 50,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const keywords = openAiResponse.data.choices[0].text.trim();

    const photosResponse = await axios.get(
      `https://api.pexels.com/v1/search`,
      {
        params: {
          query: keywords,
          per_page: 5,
        },
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );


    const videosResponse = await axios.get(
      `https://api.pexels.com/videos/search`,
      {
        params: {
          query: keywords,
          per_page: 5,
        },
        headers: {
          Authorization: PEXELS_API_KEY,
        },
      }
    );

    const photos = photosResponse.data.photos.map((photo: any) => ({
      id: photo.id,
      url: photo.src.medium,
      description: photo.alt,
    }));

    const videos = videosResponse.data.videos.map((video: any) => ({
      id: video.id,
      url: video.video_files[0]?.link,
      duration: video.duration,
    }));

    res.status(200).json({ photos, videos });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res.status(500).json({ message: "Something went wrong", error });
  }
}
