import { OpenAI } from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  const { url } = await req.json();

  // For this phase, we are simulating the text extraction 
  // and sending a prompt to OpenAI to structure the data.
  // In a real production environment, we'd use a PDF library here.
  
  const completion = await openai.chat.completions.create({
    messages: [{ 
      role: "system", 
      content: "You are a professional HR assistant. Extract info from resume text into JSON format: fullName, email, skills, experience, education, headline." 
    },
    { 
      role: "user", 
      content: `Extract info from this resume file: ${url}` 
    }],
    model: "gpt-3.5-turbo-1106",
    response_format: { type: "json_object" },
  });

  return Response.json({ data: JSON.parse(completion.choices[0].message.content) });
}
