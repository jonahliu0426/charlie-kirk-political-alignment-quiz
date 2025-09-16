import { getReferenceAnswers } from '@/data/questions';

export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
}

export function calculateOverlapPercentage(userAnswers: Record<number, number>): number {
  const referenceAnswers = getReferenceAnswers() as Record<number, number>;
  
  let totalQuestions = 0;
  let matchingAnswers = 0;
  
  for (const questionId in referenceAnswers) {
    const qId = parseInt(questionId);
    const userAnswer = userAnswers[qId];
    const referenceAnswer = referenceAnswers[qId];
    
    if (userAnswer !== undefined) {
      totalQuestions++;
      
      // Calculate similarity - exact match = 100%, 1 point difference = 75%, etc.
      const difference = Math.abs(userAnswer - referenceAnswer);
      const similarity = Math.max(0, 1 - (difference / 4)); // Scale 0-1
      
      matchingAnswers += similarity;
    }
  }
  
  if (totalQuestions === 0) return 0;
  
  return Math.round((matchingAnswers / totalQuestions) * 100);
}

export function getDistributionBucket(percentage: number): string {
  if (percentage >= 90) return '90-100%';
  if (percentage >= 80) return '80-89%';
  if (percentage >= 70) return '70-79%';
  if (percentage >= 60) return '60-69%';
  if (percentage >= 50) return '50-59%';
  if (percentage >= 40) return '40-49%';
  if (percentage >= 30) return '30-39%';
  if (percentage >= 20) return '20-29%';
  if (percentage >= 10) return '10-19%';
  return '0-9%';
}

export function createDistributionData(allScores: number[]) {
  const buckets = [
    '0-9%', '10-19%', '20-29%', '30-39%', '40-49%', 
    '50-59%', '60-69%', '70-79%', '80-89%', '90-100%'
  ];
  
  const counts = buckets.map(bucket => ({
    bucket,
    count: allScores.filter(score => getDistributionBucket(score) === bucket).length
  }));
  
  return counts;
}