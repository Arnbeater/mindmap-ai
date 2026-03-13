import OpenAI from "openai";

function isOpenRouterBaseUrl(baseURL) {
  return typeof baseURL === "string" && baseURL.includes("openrouter.ai");
}

function isOpenRouterApiKey(apiKey) {
  return typeof apiKey === "string" && apiKey.startsWith("sk-or-v1");
}

function resolveBaseUrl(apiKey) {
  if (process.env.OPENAI_BASE_URL) return process.env.OPENAI_BASE_URL;
  if (isOpenRouterApiKey(apiKey)) return "https://openrouter.ai/api/v1";
  return undefined;
}

export function getDefaultModel() {
  if (process.env.OPENAI_MODEL) return process.env.OPENAI_MODEL;

  const baseUrl = resolveBaseUrl(process.env.OPENAI_API_KEY);

  return isOpenRouterBaseUrl(baseUrl)
    ? "openai/gpt-4o-mini"
    : "gpt-4.1-mini";
}

export function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is missing");
  }

  const baseURL = resolveBaseUrl(apiKey);
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
