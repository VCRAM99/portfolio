export type RevealGroupId = 'experience' | 'featured' | 'other' | 'education' | 'contact'

export type RevealScores = Record<'hero' | RevealGroupId, number>

const HYSTERESIS_PX = 28

const groupIds: RevealGroupId[] = ['experience', 'featured', 'other', 'education', 'contact']

const generations = Object.fromEntries(groupIds.map((group) => [group, 0])) as Record<RevealGroupId, number>

const listeners = Object.fromEntries(groupIds.map((group) => [group, new Set<() => void>()])) as Record<
  RevealGroupId,
  Set<() => void>
>

export function chooseActiveGroup(scores: RevealScores, current: RevealGroupId | null): RevealGroupId | null {
  const candidates: Array<[RevealGroupId | null, number]> = [
    [null, scores.hero],
    ['experience', scores.experience],
    ['featured', scores.featured],
    ['other', scores.other],
    ['education', scores.education],
    ['contact', scores.contact],
  ]

  let best: RevealGroupId | null = current
  let bestScore = -1

  for (const [group, score] of candidates) {
    if (score > bestScore) {
      best = group
      bestScore = score
    }
  }

  if (bestScore <= 0) return current
  if (best === current) return current

  const currentScore = current === null ? scores.hero : scores[current]
  if (currentScore > 0 && bestScore < currentScore + HYSTERESIS_PX) return current

  return best
}

export function shouldResetGroup(visible: boolean, active: boolean, visited: boolean) {
  return visited && !visible && !active
}

export function getRevealGeneration(group: RevealGroupId) {
  return generations[group]
}

export function subscribeRevealGroup(group: RevealGroupId, listener: () => void) {
  listeners[group].add(listener)
  return () => listeners[group].delete(listener)
}

export function resetRevealGroup(group: RevealGroupId) {
  generations[group] += 1
  listeners[group].forEach((listener) => listener())
}
