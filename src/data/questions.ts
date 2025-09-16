export interface Question {
  id: number;
  question: string;
  referenceAnswer: number; // Charlie Kirk's position (1-5 scale)
  choices: string[]; // 5 specific choices for this question
}

export const questions: Question[] = [
  {
    id: 1,
    question: "How much should the federal government be involved in regulating business practices?",
    referenceAnswer: 2,
    choices: ["No regulation", "Minimal regulation", "Moderate regulation", "Significant regulation", "Extensive regulation"]
  },
  {
    id: 2,
    question: "What level of immigration would be most beneficial for the country's economy and culture?",
    referenceAnswer: 4,
    choices: ["Much lower", "Somewhat lower", "Current levels", "Somewhat higher", "Much higher"]
  },
  {
    id: 3,
    question: "How should the government balance environmental protection with economic growth?",
    referenceAnswer: 2,
    choices: ["Prioritize economy", "Favor economy", "Balance both", "Favor environment", "Prioritize environment"]
  },
  {
    id: 4,
    question: "What is the most effective way to structure tax rates across different income levels?",
    referenceAnswer: 1,
    choices: ["Flat tax for all", "Lower progressive", "Current system", "Higher progressive", "Maximum progressive"]
  },
  {
    id: 5,
    question: "How should society balance individual reproductive choices with other considerations?",
    referenceAnswer: 1,
    choices: ["Strict limits", "Some limits", "Moderate approach", "Broad access", "No restrictions"]
  },
  {
    id: 6,
    question: "What role should government play in ensuring healthcare access for citizens?",
    referenceAnswer: 1,
    choices: ["Private market", "Limited assistance", "Mixed system", "Public option", "Universal coverage"]
  },
  {
    id: 7,
    question: "How should society balance public safety concerns with individual rights regarding firearms?",
    referenceAnswer: 1,
    choices: ["Minimal restrictions", "Basic checks", "Current laws", "Stricter controls", "Maximum controls"]
  },
  {
    id: 8,
    question: "What approach should the government take regarding marriage laws and definitions?",
    referenceAnswer: 3,
    choices: ["Traditional only", "Mostly traditional", "Current approach", "More inclusive", "Fully inclusive"]
  },
  {
    id: 9,
    question: "How should minimum wage policies be determined to best serve workers and businesses?",
    referenceAnswer: 2,
    choices: ["No minimum", "Market-based", "Current system", "Moderate increase", "Substantial increase"]
  },
  {
    id: 10,
    question: "What level of international military engagement best serves American interests?",
    referenceAnswer: 4,
    choices: ["Isolationist", "Minimal engagement", "Selective involvement", "Active engagement", "Global leadership"]
  }
];

export const getQuestions = () => questions.map(q => ({ id: q.id, question: q.question, choices: q.choices }));
export const getReferenceAnswers = () => questions.reduce((acc, q) => ({ ...acc, [q.id]: q.referenceAnswer }), {});