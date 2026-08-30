import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    const { text } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0125",
      messages: [
        { 
          role: "system", 
          content: "You are an HR Assistant. Extract info from the following resume text into a JSON object with these keys: fullName, email, phone, headline, skills, experience, education." 
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" },
    });

    return Response.json({ data: JSON.parse(completion.choices[0].message.content) });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
