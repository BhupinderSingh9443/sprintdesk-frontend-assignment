import type {
  Notification,
} from '../../types/domain';

import { getMockData } from '../../types/mockData.service';

import type {
  JsonPlaceholderPost,
} from './notification.types';

export async function getInitialNotifications():
Promise<Notification[]> {
  const data = await getMockData();

  return data.notifications;
}

export async function pollNotifications():
Promise<JsonPlaceholderPost[]> {
  const response = await fetch(
    'https://jsonplaceholder.typicode.com/posts',
  );

  if (!response.ok) {
    throw new Error(
      'Unable to retrieve notifications.',
    );
  }

  return response.json() as Promise<
    JsonPlaceholderPost[]
  >;
}

export function mapPostToNotification(
  post: JsonPlaceholderPost,
): Notification {
  return {
    /*
     * Offset prevents collisions
     * with mock notification IDs.
     */
    id: 10_000 + post.id,

    title: post.title,

    message: post.body,

    type: 'external',

    read: false,

    createdAt:
      new Date().toISOString(),
  };
}