import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InterviewRequest {
  type: 'question' | 'evaluate';
  role: string;
  question?: string;
  answer?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, role, question, answer }: InterviewRequest = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("AI service is not configured");
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (type === 'question') {
      systemPrompt = `You are an expert technical interviewer. Generate one interview question for a ${role} position. 
      The question should be:
      - Practical and commonly asked in real interviews
      - Clear and specific
      - Appropriate for entry to mid-level candidates
      
      Return ONLY the question text, nothing else. No numbering, no prefixes.`;
      
      userPrompt = `Generate one interview question for a ${role} role.`;
    } else if (type === 'evaluate') {
      systemPrompt = `You are an expert technical interviewer evaluating a candidate's answer. 
      Provide constructive, educational feedback that helps students improve.
      Be encouraging but honest. Focus on practical improvements.
      
      Your response MUST be valid JSON with this exact structure:
      {
        "score": <number from 1-10>,
        "strengths": ["<strength 1>", "<strength 2>"],
        "improvements": ["<improvement 1>", "<improvement 2>"],
        "sampleAnswer": "<a better answer showing what an ideal response would look like>"
      }
      
      Return ONLY the JSON object, no markdown, no code blocks, no additional text.`;
      
      userPrompt = `Role: ${role}
Question: ${question}
Candidate's Answer: ${answer}

Evaluate this answer and provide feedback.`;
    }

    console.log(`Processing ${type} request for role: ${role}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please wait a moment and try again." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log("AI response received:", content?.substring(0, 100));

    if (type === 'question') {
      return new Response(JSON.stringify({ question: content.trim() }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Parse the evaluation JSON
      let evaluation;
      try {
        // Clean up the response in case there's any markdown formatting
        const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        evaluation = JSON.parse(cleanContent);
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", content);
        // Provide a default response if parsing fails
        evaluation = {
          score: 5,
          strengths: ["You provided an answer to the question"],
          improvements: ["Try to be more specific with examples", "Structure your answer more clearly"],
          sampleAnswer: "Unable to generate sample answer at this time. Please try again."
        };
      }
      
      return new Response(JSON.stringify(evaluation), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in interview-ai function:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
