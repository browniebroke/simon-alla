/**
 * Number of columns (2 or 3) that gives the most balanced rows for `count` items:
 * multiples of 3 -> 3, other even counts -> 2, other odd counts -> whichever leaves
 * the fuller last row (5 -> 3+2, 7 -> 2+2+2+1, 11 -> 3+3+3+2).
 */
export function balancedColumns(count: number): 2 | 3 {
  if (count % 3 === 0) return 3
  if (count % 2 === 0) return 2
  // Odd and not a multiple of 3: the last row of 3 holds 1 or 2 items, the last row of 2 holds 1.
  return count % 3 === 2 ? 3 : 2
}
