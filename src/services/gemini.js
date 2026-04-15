import { GoogleGenAI } from '@google/genai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.warn('[CodArch] Gemini API key not set — add VITE_GEMINI_API_KEY to .env');
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const SYSTEM_PROMPT = `You are CodArch, an expert code reviewer and software architect. Analyze the provided code files and give a comprehensive review.

For each file, evaluate:
1. **Code Quality** — Readability, naming conventions, DRY principle
2. **Architecture** — Design patterns, separation of concerns, modularity
3. **Best Practices** — Language-specific conventions, error handling, edge cases
4. **Performance** — Potential bottlenecks, unnecessary operations
5. **Security** — Vulnerabilities, input validation, data exposure

Provide:
- An overall rating (A+ to F)
- Key findings organized by severity (🔴 Critical / 🟡 Warning / 🔵 Info)
- Specific line-by-line suggestions where applicable
- A summary of strengths and areas for improvement

Format your response in clean, readable markdown with proper headings, bullet points, and code blocks where appropriate.`;

export async function analyzeCode(files) {
    if (!ai) {
        throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to your .env file.');
    }

    const codeBlock = files
        .map((f) => `### File: ${f.name}\n\`\`\`\n${f.content}\n\`\`\``)
        .join('\n\n');

    const prompt = `${SYSTEM_PROMPT}\n\n---\n\nPlease analyze the following code files:\n\n${codeBlock}`;

    console.log('[CodArch] Sending analysis request to Gemini...');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [{ text: prompt }],
            },
        });

        console.log('[CodArch] Analysis received');
        return response.text;
    } catch (error) {
        console.error('[CodArch] Gemini API error:', error);

        if (error?.message?.includes('PERMISSION_DENIED')) {
            throw new Error('API key does not have access to gemini-2.5-flash. Please check your Google Cloud project permissions or try a different API key.');
        }
        if (error?.message?.includes('429') || error?.message?.includes('quota')) {
            throw new Error('API rate limit exceeded. Please wait a moment and try again.');
        }

        throw new Error(error?.message || 'Failed to analyze code. Please try again.');
    }
}
