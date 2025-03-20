import OpenAI from 'openai';

let openai: OpenAI;
const DAILY_LIMIT = 500;  // ~20-25 users with 20-25 requests each
const HOURLY_LIMIT = 100; // ~10 users with 10 requests each per hour

// Export the interface for the dashboard
export interface UsageStats {
  daily: {
    count: number;
    date: string;
  };
  hourly: {
    count: number;
    hour: string;
  };
}

let usageStats: UsageStats = {
  daily: {
    count: 0,
    date: new Date().toDateString()
  },
  hourly: {
    count: 0,
    hour: new Date().toISOString().split('T')[1].split(':')[0]
  }
};

function resetUsageIfNeeded() {
  const now = new Date();
  const currentDate = now.toDateString();
  const currentHour = now.toISOString().split('T')[1].split(':')[0];

  // Reset daily count if it's a new day
  if (currentDate !== usageStats.daily.date) {
    usageStats.daily = {
      count: 0,
      date: currentDate
    };
  }

  // Reset hourly count if it's a new hour
  if (currentHour !== usageStats.hourly.hour) {
    usageStats.hourly = {
      count: 0,
      hour: currentHour
    };
  }
}

function checkUsageLimits(): { allowed: boolean; reason?: string } {
  resetUsageIfNeeded();

  if (usageStats.daily.count >= DAILY_LIMIT) {
    return { 
      allowed: false, 
      reason: 'Daily limit reached. Please try again tomorrow.' 
    };
  }

  if (usageStats.hourly.count >= HOURLY_LIMIT) {
    return { 
      allowed: false, 
      reason: 'Hourly limit reached. Please try again in the next hour.' 
    };
  }

  return { allowed: true };
}

function incrementUsage() {
  usageStats.daily.count++;
  usageStats.hourly.count++;
}

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
  const usageCheck = checkUsageLimits();
  if (!usageCheck.allowed) {
    throw new Error(usageCheck.reason);
  }

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

    incrementUsage();
    const response = completion.choices[0].message.content;
    console.log('Analysis response:', response);
    return JSON.parse(response || '{"mood": "neutral", "style": "modern"}');
  } catch (error) {
    console.error('Error analyzing line:', error);
    throw error; // Propagate the error to handle it in the component
  }
}

export async function generateRhymingLines(line: string, options: LineOptions = {}) {
  const usageCheck = checkUsageLimits();
  if (!usageCheck.allowed) {
    throw new Error(usageCheck.reason);
  }

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

    incrementUsage();
    const response = completion.choices[0].message.content;
    console.log('Generation response:', response);
    return response ? response.split('\n').filter(Boolean) : [];
  } catch (error) {
    console.error('Error generating rhyming lines:', error);
    throw error; // Propagate the error to handle it in the component
  }
}

// Export usage stats for monitoring
export function getUsageStats(): UsageStats {
  resetUsageIfNeeded();
  return usageStats;
} 