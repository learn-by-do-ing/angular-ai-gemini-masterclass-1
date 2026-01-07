import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

export const GEMINI_AI = new InjectionToken<GoogleGenAI>('Google GenAI instance');

export interface GeminiProvider {
  apiKey: string;
}

export function provideGemini(config: GeminiProvider): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: GEMINI_AI,
      useFactory: () => new GoogleGenAI({ apiKey: config.apiKey })
    }
  ]);
}