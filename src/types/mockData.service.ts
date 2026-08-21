import type { MockData } from '../types/domain';

export async function getMockData(): Promise<MockData> {
  const response = await fetch('/mock-data.json');

  if (!response.ok) {
    throw new Error('Failed to load SprintDesk data');
  }

  return response.json() as Promise<MockData>;
}