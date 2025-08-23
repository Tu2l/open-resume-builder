
/**
 * A helper function to prepare the prompt for resume analysis.
 * It takes the resume text and job description text as input and returns a formatted prompt string.
 */
export const prepareResumeAnalysisPrompt = (resumePlainText: string, jobDescriptionText: string) => {
    return `You are an AI resume expert. Analyze the provided resume and job description, and provide suggestions on how to improve the resume to better align with the job description. Focus on skills, experience, and keywords.

        Resume:
        ${resumePlainText}
        
        Job Description:
        ${jobDescriptionText}
        
        Return only the analysis as a plain text string.`;
}

/**
 * A helper function to prepare the prompt for resume improvement.
 * It takes the JSON schema, resume text, job description text, and analysis result as input and returns a formatted prompt string.
 */
export const prepareResumeImprovementPrompt = (jsonSchema: string, resumePlainText: string, jobDescriptionText: string, analysisResult: string) => {
    return `You are an expert resume writer and data extraction specialist. Your task is to rewrite the provided "Original Resume" to be better tailored for the "Job Description", using the "AI Analysis" as a guide. Then, you must output the result as a single, valid JSON object that strictly conforms to the provided "JSON Schema".

        Instructions:
        1.  The output MUST be a single, valid JSON object wrapped in \`\`\`json ... \`\`\` markdown fences. Do not include any text, notes, or explanations outside of the JSON object. Just return the JSON.
        2.  Rewrite the resume content, focusing on the summary and experience sections to align them with the target job.
        3.  Incorporate keywords and skills from the job description where appropriate.
        4.  Ensure all sections from the original resume (contact info, education, projects, etc.) are included in the final output.
        5.  For the 'responsibilities' within each 'experience' item, format them as a JSON array of strings. Each sentence or bullet point should be a separate string in the array.
        6.  For the 'skills' field, parse the user's input into a structured string. Example: "Languages: Java, Kotlin; Frameworks: React, NextJs".
        7.  If a required field from the schema is missing from the resume text (like 'email'), create a realistic placeholder.

        JSON Schema to follow:
        \`\`\`json
        ${jsonSchema}
        \`\`\`

        Original Resume:
        ${resumePlainText}
        
        Job Description:
        ${jobDescriptionText}
        
        AI Analysis:
        ${analysisResult}
        `;
}

/**
 * A helper function to call the Gemini API from the client-side.
 */
export const callGeminiApi = async (prompt: string, apiKey: string, model: string) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    });

    if (!response.ok) {
        const errorBody = await response.json();
        console.error("Gemini API Error Body:", errorBody);
        throw new Error(`Gemini API Error: ${errorBody.error?.message || response.statusText}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};
