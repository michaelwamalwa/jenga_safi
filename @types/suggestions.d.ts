// @types/suggestion.d.ts

export interface Suggestion {
    _id?: string;          // optional for new records
    title: string;
    category: string;      // e.g. "energy", "waste"
    impact: string;        // e.g. "Reduces emissions by 20%"
    time: string;          // e.g. "1 week"
    createdAt?: string | Date;
  }
  