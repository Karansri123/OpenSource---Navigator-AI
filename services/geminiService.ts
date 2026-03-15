import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import { UserPreferences, Project } from '../types';
import { CHARACTERISTICS_OPTIONS } from '../constants';

interface AIProjectSuggestion {
  name: string;
  description: string;
  language: string;
  tags: string[];
  url: string;
  conceptual_difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | string;
}

const mapAISuggestionToProject = (aiProj: AIProjectSuggestion, index: number): Project => ({
  name: aiProj.name || `AI Suggested Project ${index + 1}`,
  description: aiProj.description || 'No description provided by AI.',
  url: aiProj.url || 'N/A',
  language: aiProj.language || 'Unknown',
  tags: aiProj.tags && Array.isArray(aiProj.tags)
    ? (aiProj.conceptual_difficulty
        ? [...aiProj.tags, `Difficulty: ${aiProj.conceptual_difficulty}`]
        : aiProj.tags)
    : (aiProj.conceptual_difficulty
        ? [`Difficulty: ${aiProj.conceptual_difficulty}`]
        : []),
  platform: 'AI Suggestion',
  stars: 0,
  forks: 0,
  watchers: 0,
  openIssues: 0,
  closedIssues: 0,
  contributors: 0,
  commitsLastMonth: 0,
  issuesLastMonth: 0,
  pullRequestsLastMonth: 0,
  owner: undefined,
  downloads: undefined,
  recentDownloads: undefined,
  monthlyDownloads: undefined,
  versionDownloads: undefined,
  version: undefined,
  updatedAt: undefined,
  isBookmarked: false
});

const fetchAIRecommendations = async (
  preferences: Omit<UserPreferences, 'platforms'>
): Promise<Project[]> => {

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  console.log('Checking API key:', {
    hasKey: !!apiKey,
    keyLength: apiKey?.length
  });

  if (!apiKey) {
    console.error("VITE_GEMINI_API_KEY environment variable is not set.");
    throw new Error("AI service is not configured (API key missing).");
  }

  const ai = new GoogleGenerativeAI(apiKey);

  const characteristicsString = preferences.characteristics
    .map(id => CHARACTERISTICS_OPTIONS.find(c => c.id === id)?.label)
    .filter(Boolean)
    .join(', ');

  const prompt = `
System Instruction: "You are an expert software project recommender, specializing in open-source. Your goal is to recommend real, existing open-source projects that match the user's preferences."

User Preferences:
- Languages: ${preferences.languages || 'Any'}
- Topics: ${preferences.topics || 'Any'}
- Desired Characteristics: ${characteristicsString || 'General interest'}

IMPORTANT: Respond ONLY with a valid JSON array.

Each object must have:
{
"name": "Project Name",
"description": "Project description",
"language": "Primary Language",
"tags": ["tag1", "tag2"],
"url": "https://github.com/username/repo",
"conceptual_difficulty": "Beginner|Intermediate|Advanced"
}
`;

  let geminiApiResponse: GenerateContentResult | undefined;

  try {
    const model = ai.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024
      }
    });

    geminiApiResponse = await model.generateContent(prompt);

    if (!geminiApiResponse) {
      throw new Error("No response from AI model");
    }

    let jsonStr = geminiApiResponse.response.text()?.trim() || '';

    console.log('Raw AI response:', jsonStr);

    const arrayMatch = jsonStr.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (arrayMatch) {
      jsonStr = arrayMatch[0];
    }

    jsonStr = jsonStr
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/\s+/g, ' ')
      .replace(/,(\s*[}\]])/g, '$1');

    const parsedData = JSON.parse(jsonStr);

    if (!Array.isArray(parsedData)) {
      throw new Error("Response is not a JSON array");
    }

    const validProjects = parsedData.filter((item): item is AIProjectSuggestion => {

      if (!item || typeof item !== 'object') return false;

      if (
        typeof item.name !== 'string' ||
        typeof item.description !== 'string' ||
        typeof item.language !== 'string' ||
        typeof item.url !== 'string' ||
        !Array.isArray(item.tags)
      ) {
        return false;
      }

      return true;
    });

    if (validProjects.length === 0) {
      throw new Error("No valid project suggestions found");
    }

    return validProjects.map((item, index) =>
      mapAISuggestionToProject(item, index)
    );

  } catch (error) {

    console.error("Error fetching AI recommendations:", error);

    let message = "Unknown AI error";

    if (error instanceof Error) {
      message = error.message;
    }

    throw new Error(`Failed to get AI recommendations: ${message}`);
  }
};

export { fetchAIRecommendations };