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
          content: "You are a professional Resume Parser. Take the messy text from a PDF resume and organize it into a clean JSON object. Keys: fullName, email, phone, city, state, country, linkedin, portfolio, headline, yearsExperience, currentTitle, skills, experience, education, certifications, projects, achievements, languages." 
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" },
    });

    return Response.json({ data: JSON.parse(completion.choices[0].message.content) });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "AI failed to process text" }, { status: 500 });
  }
}
