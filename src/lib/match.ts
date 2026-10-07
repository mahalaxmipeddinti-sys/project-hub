export function matchScore(candidate: any, job: any) {
  // Pure function for Smart Matching logic (Score 0-100)
  
  let score = 0
  const reasons: string[] = []

  // 1. Skills (35%)
  const requiredSkills = job.skills || []
  const candSkills = candidate.skills || []
  
  if (requiredSkills.length > 0) {
    const matched = requiredSkills.filter((s: string) => candSkills.includes(s))
    const skillScore = (matched.length / requiredSkills.length) * 35
    score += skillScore
    reasons.push(`You match ${matched.length} out of ${requiredSkills.length} required skills.`)
  } else {
    score += 35 // Neutral
  }

  // 2. Experience (20%) - Mocked for MVP
  score += 20 

  // 3. Location/WorkMode (15%)
  if (job.mode === 'remote') {
    score += 15
    reasons.push("Remote job matches your location preferences automatically.")
  } else if (candidate.locations?.includes(job.location)) {
    score += 15
    reasons.push("Location perfectly matches your preference.")
  } else {
    score += 5 // Partial credit
    reasons.push("Location is outside your preferred areas.")
  }

  // 4. Salary (15%)
  if (!job.salary_max || !candidate.salary_expectation) {
    score += 15 // Neutral
  } else if (candidate.salary_expectation <= job.salary_max) {
    score += 15
    reasons.push("Your salary expectation aligns with this role.")
  } else {
    score += 5
    reasons.push("Your salary expectation is higher than the budget.")
  }

  // 5. Availability (15%) - Mocked
  score += 15

  return {
    score: Math.round(score),
    breakdown: { skills: 35, experience: 20, location: 15, salary: 15, availability: 15 },
    reasons
  }
}
