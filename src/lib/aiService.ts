import OpenAI from 'openai';

let openai: OpenAI;

export function initializeAI(apiKey: string) {
  openai = new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true // Required for browser usage
  });
}

interface LineOptions {
  mood?: string;
  style?: string;
}

export async function analyzeLine(line: string) {
  try {
    console.log('Analyzing line:', line);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a poetry analysis expert. Analyze the mood and style of the given line."
        },
        {
          role: "user",
          content: `Analyze this line: "${line}". Return only a JSON object with mood and style.`
        }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0].message.content;
    console.log('Analysis response:', response);
    return JSON.parse(response || '{"mood": "neutral", "style": "modern"}');
  } catch (error) {
    console.error('Error analyzing line:', error);
    throw error; // Propagate the error to handle it in the component
  }
}

export async function generateRhymingLines(line: string, options: LineOptions = {}) {
  try {
    const { mood = "neutral", style = "modern" } = options;
    console.log('Generating rhymes for:', line, 'with options:', options);
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a creative poet. Generate rhyming lines that match the following mood: ${mood} and style: ${style}.`
        },
        {
          role: "user",
          content: `Generate 3 creative lines that rhyme with this line: "${line}". Each line should maintain similar syllable count and rhythm. Return only the lines, separated by newlines.`
        }
      ],
      temperature: 0.8,
    });

    const response = completion.choices[0].message.content;
    console.log('Generation response:', response);
    return response ? response.split('\n').filter(Boolean) : [];
  } catch (error) {
    console.error('Error generating rhyming lines:', error);
    throw error; // Propagate the error to handle it in the component
  }
} 