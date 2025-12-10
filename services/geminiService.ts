import { GoogleGenAI, Type } from "@google/genai";
import { Pillar, Variation, CourseData } from "../types";

const apiKey = process.env.API_KEY;

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = "gemini-2.5-flash";

// Helper to clean JSON string from code blocks
const cleanJsonString = (str: string): string => {
  return str.replace(/```json\n?|\n?```/g, "").trim();
};

export const generatePillars = async (topic: string): Promise<Pillar[]> => {
  try {
    const prompt = `
      Actúa como un mentor experto en creación de cursos online.
      El usuario quiere crear un curso sobre: "${topic}".
      Genera 10 "Temas Pilar" amplios que podrían servir como base para una estrategia de contenido.
      Devuelve SOLO un JSON con la siguiente estructura:
      [
        { "id": "1", "title": "Nombre del Pilar", "description": "Breve descripción atractiva" },
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
            },
            required: ["id", "title", "description"],
          },
        },
      },
    });

    if (!response.text) throw new Error("No response generated");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating pillars:", error);
    throw error;
  }
};

export const generateVariations = async (pillar: Pillar): Promise<Variation[]> => {
  try {
    const prompt = `
      El usuario ha elegido el tema pilar: "${pillar.title}" (${pillar.description}).
      Genera 10 variaciones específicas de lecciones o micro-cursos derivadas de este pilar.
      Cada variación debe tener un enfoque único.
      Devuelve SOLO un JSON con esta estructura:
      [
        { "id": "1", "title": "Título atractivo de la lección", "focus": "Enfoque principal (ej: Práctico, Teórico, Caso de estudio)" },
        ...
      ]
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              focus: { type: Type.STRING },
            },
            required: ["id", "title", "focus"],
          },
        },
      },
    });

    if (!response.text) throw new Error("No response generated");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Error generating variations:", error);
    throw error;
  }
};

export const generateCourse = async (variation: Variation): Promise<CourseData> => {
  try {
    const prompt = `
      Actúa como un diseñador instruccional de clase mundial.
      Crea un curso completo y detallado para la lección: "${variation.title}".
      
      IMPORTANTE: Usa Google Search para buscar información actual, datos precisos y ejemplos reales para enriquecer el contenido.
      
      Estructura del curso:
      1. Título y Subtítulo inspirador.
      2. Un color hexadecimal ("themeColor") que represente la emoción del tema (ej: azul para confianza, rojo para energía).
      3. 3 a 5 "Bloques" de contenido. Cada bloque debe ser educativo, usar formato Markdown (negritas, listas), e incluir una palabra clave para buscar una imagen relacionada ("imageKeyword").
      4. Un cuestionario (quiz) final con 3 preguntas tipo test para validar el aprendizaje.

      Devuelve la respuesta estrictamente en formato JSON dentro de un bloque de código markdown.
      Estructura JSON esperada:
      {
        "title": "...",
        "subtitle": "...",
        "themeColor": "#hex",
        "blocks": [
          { 
            "title": "...", 
            "content": "Contenido rico en markdown...", 
            "imageKeyword": "keyword for unsplash", 
            "keyPoints": ["Punto 1", "Punto 2"] 
          }
        ],
        "quiz": [
          { "question": "...", "options": ["A", "B", "C"], "correctAnswerIndex": 0 }
        ]
      }
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType: 'application/json' cannot be used with googleSearch in many cases properly,
        // so we ask for JSON in the prompt and parse it manually.
      },
    });

    const rawText = response.text || "";
    const jsonString = cleanJsonString(rawText);
    
    let courseData: CourseData;
    try {
        courseData = JSON.parse(jsonString);
    } catch (e) {
        console.error("Failed to parse JSON from course generation", rawText);
        throw new Error("El formato generado no fue válido. Por favor intenta de nuevo.");
    }

    // Extract grounding metadata if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks) {
      const sources = groundingChunks
        .map((chunk: any) => chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : null)
        .filter((source: any) => source !== null);
      
      // Deduplicate sources
      const uniqueSources = Array.from(new Map(sources.map((s: any) => [s.uri, s])).values());
      courseData.groundingSources = uniqueSources as any;
    }

    return courseData;

  } catch (error) {
    console.error("Error generating course:", error);
    throw error;
  }
};