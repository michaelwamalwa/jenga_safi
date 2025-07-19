'use server';
import { connectDB } from '@/lib/db';
import { Suggestion } from '@/app/models/suggestions';

export async function getSuggestions() {

    await connectDB();
  const suggestions = await Suggestion.find().sort({ createdAt: 1 });
  return JSON.parse(JSON.stringify(suggestions));
}
