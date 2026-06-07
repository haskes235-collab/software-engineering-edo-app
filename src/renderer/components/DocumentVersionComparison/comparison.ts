export type ComparisonRowKind = 'equal' | 'added' | 'removed' | 'modified';

export interface ComparisonRow {
  kind: ComparisonRowKind;
  leftLineNumber: number | null;
  rightLineNumber: number | null;
  leftText: string;
  rightText: string;
}

export interface ComparisonSummary {
  equalLines: number;
  addedLines: number;
  removedLines: number;
  modifiedLines: number;
}

interface RawOperation {
  kind: 'equal' | 'insert' | 'delete';
  lineNumber: number;
  text: string;
}

function splitLines(content: string): string[] {
  return content.split(/\r?\n/);
}

function buildRawOperations(leftLines: string[], rightLines: string[]): RawOperation[] {
  const leftLength = leftLines.length;
  const rightLength = rightLines.length;

  const dp: number[][] = Array.from({ length: leftLength + 1 }, () =>
    Array.from({ length: rightLength + 1 }, () => 0),
  );

  for (let leftIndex = leftLength - 1; leftIndex >= 0; leftIndex -= 1) {
    for (let rightIndex = rightLength - 1; rightIndex >= 0; rightIndex -= 1) {
      if (leftLines[leftIndex] === rightLines[rightIndex]) {
        dp[leftIndex][rightIndex] = dp[leftIndex + 1][rightIndex + 1] + 1;
      } else {
        dp[leftIndex][rightIndex] = Math.max(
          dp[leftIndex + 1][rightIndex],
          dp[leftIndex][rightIndex + 1],
        );
      }
    }
  }

  const operations: RawOperation[] = [];
  let leftIndex = 0;
  let rightIndex = 0;

  while (leftIndex < leftLength && rightIndex < rightLength) {
    if (leftLines[leftIndex] === rightLines[rightIndex]) {
      operations.push({
        kind: 'equal',
        lineNumber: leftIndex + 1,
        text: leftLines[leftIndex],
      });
      leftIndex += 1;
      rightIndex += 1;
      continue;
    }

    if (dp[leftIndex + 1][rightIndex] >= dp[leftIndex][rightIndex + 1]) {
      operations.push({
        kind: 'delete',
        lineNumber: leftIndex + 1,
        text: leftLines[leftIndex],
      });
      leftIndex += 1;
      continue;
    }

    operations.push({
      kind: 'insert',
      lineNumber: rightIndex + 1,
      text: rightLines[rightIndex],
    });
    rightIndex += 1;
  }

  while (leftIndex < leftLength) {
    operations.push({
      kind: 'delete',
      lineNumber: leftIndex + 1,
      text: leftLines[leftIndex],
    });
    leftIndex += 1;
  }

  while (rightIndex < rightLength) {
    operations.push({
      kind: 'insert',
      lineNumber: rightIndex + 1,
      text: rightLines[rightIndex],
    });
    rightIndex += 1;
  }

  return operations;
}

export function buildSideBySideRows(
  leftContent: string,
  rightContent: string,
): ComparisonRow[] {
  const operations = buildRawOperations(splitLines(leftContent), splitLines(rightContent));
  const rows: ComparisonRow[] = [];

  for (let index = 0; index < operations.length; index += 1) {
    const current = operations[index];
    const next = operations[index + 1];

    if (current.kind === 'delete' && next?.kind === 'insert') {
      rows.push({
        kind: 'modified',
        leftLineNumber: current.lineNumber,
        rightLineNumber: next.lineNumber,
        leftText: current.text,
        rightText: next.text,
      });
      index += 1;
      continue;
    }

    if (current.kind === 'insert' && next?.kind === 'delete') {
      rows.push({
        kind: 'modified',
        leftLineNumber: next.lineNumber,
        rightLineNumber: current.lineNumber,
        leftText: next.text,
        rightText: current.text,
      });
      index += 1;
      continue;
    }

    if (current.kind === 'equal') {
      rows.push({
        kind: 'equal',
        leftLineNumber: current.lineNumber,
        rightLineNumber: current.lineNumber,
        leftText: current.text,
        rightText: current.text,
      });
      continue;
    }

    if (current.kind === 'delete') {
      rows.push({
        kind: 'removed',
        leftLineNumber: current.lineNumber,
        rightLineNumber: null,
        leftText: current.text,
        rightText: '',
      });
      continue;
    }

    rows.push({
      kind: 'added',
      leftLineNumber: null,
      rightLineNumber: current.lineNumber,
      leftText: '',
      rightText: current.text,
    });
  }

  return rows;
}

export function summarizeRows(rows: readonly ComparisonRow[]): ComparisonSummary {
  return rows.reduce<ComparisonSummary>(
    (summary, row) => {
      if (row.kind === 'equal') summary.equalLines += 1;
      if (row.kind === 'added') summary.addedLines += 1;
      if (row.kind === 'removed') summary.removedLines += 1;
      if (row.kind === 'modified') summary.modifiedLines += 1;
      return summary;
    },
    {
      equalLines: 0,
      addedLines: 0,
      removedLines: 0,
      modifiedLines: 0,
    },
  );
}
