import OpenAI from "openai";

function isOpenRouterBaseUrl(baseURL) {
  return typeof baseURL === "string" && baseURL.includes("openrouter.ai");
}

export function getDefaultModel() {
  if (process.env.OPENAI_MODEL) return process.env.OPENAI_MODEL;

  return isOpenRouterBaseUrl(process.env.OPENAI_BASE_URL)
    ? "openai/gpt-4o-mini"
    : "gpt-4.1-mini";
}

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const baseURL = process.env.OPENAI_BASE_URL;
  const usingOpenRouter = isOpenRouterBaseUrl(baseURL);

  const defaultHeaders = usingOpenRouter
    ? {
        ...(process.env.OPENROUTER_SITE_URL
          ? { "HTTP-Referer": process.env.OPENROUTER_SITE_URL }
          : {}),
        ...(process.env.OPENROUTER_APP_NAME
          ? { "X-Title": process.env.OPENROUTER_APP_NAME }
          : {}),
      }
    : undefined;

  return new OpenAI({
    apiKey,
    ...(baseURL ? { baseURL } : {}),
    ...(defaultHeaders ? { defaultHeaders } : {}),
  });
}
