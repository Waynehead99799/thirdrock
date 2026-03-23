export type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

const POSTS_URL = "https://jsonplaceholder.typicode.com/posts";

export async function fetchPosts(signal?: AbortSignal): Promise<Post[]> {
  const res = await fetch(POSTS_URL, { signal });
  if (!res.ok) {
    throw new Error(`Posts request failed (${res.status})`);
  }
  return res.json() as Promise<Post[]>;
}
