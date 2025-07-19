// app/dashboard/suggestions/page.tsx
import {getSuggestions} from '@/actions/suggestions';
import ConstructionSuggestionsPage from './page';

export default async function SuggestionsPage() {
  const suggestions = await getSuggestions(); // ✅ called on the server

  return <ConstructionSuggestionsPage initialSuggestions={suggestions} />;
}
