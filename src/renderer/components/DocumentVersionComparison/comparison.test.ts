import { describe, expect, it } from 'vitest';
import { buildSideBySideRows, summarizeRows } from './comparison';

describe('buildSideBySideRows', () => {
  it('pairs matching lines and highlights replacements', () => {
    const rows = buildSideBySideRows('A\nB\nC', 'A\nX\nC');

    expect(rows).toHaveLength(3);
    expect(rows[0]).toMatchObject({
      kind: 'equal',
      leftLineNumber: 1,
      rightLineNumber: 1,
      leftText: 'A',
      rightText: 'A',
    });
    expect(rows[1]).toMatchObject({
      kind: 'modified',
      leftLineNumber: 2,
      rightLineNumber: 2,
      leftText: 'B',
      rightText: 'X',
    });
    expect(rows[2]).toMatchObject({
      kind: 'equal',
      leftLineNumber: 3,
      rightLineNumber: 3,
      leftText: 'C',
      rightText: 'C',
    });
  });

  it('detects added and removed lines', () => {
    const rows = buildSideBySideRows('A\nB', 'A\nB\nC');
    const summary = summarizeRows(rows);

    expect(summary).toMatchObject({
      equalLines: 2,
      addedLines: 1,
      removedLines: 0,
      modifiedLines: 0,
    });
    expect(rows[2]).toMatchObject({
      kind: 'added',
      leftLineNumber: null,
      rightLineNumber: 3,
      rightText: 'C',
    });
  });
});
