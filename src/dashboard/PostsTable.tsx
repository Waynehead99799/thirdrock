import { memo } from "react";
import type { Post } from "../api/posts";

const PostRow = memo(function PostRow({ post }: { post: Post }) {
  return (
    <tr className="border-t border-neutral-100 hover:bg-neutral-50/80">
      <td className="px-3 py-2 align-top text-neutral-500 tabular-nums">{post.id}</td>
      <td className="px-3 py-2 align-top tabular-nums">{post.userId}</td>
      <td className="px-3 py-2 align-top font-medium text-neutral-900">{post.title}</td>
      <td className="max-w-md px-3 py-2 align-top text-sm text-neutral-600">
        <span className="line-clamp-2" title={post.body}>
          {post.body}
        </span>
      </td>
    </tr>
  );
});

type Props = {
  posts: Post[];
  emptyMessage?: string;
};

export const PostsTable = memo(function PostsTable({ posts, emptyMessage }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white shadow-sm">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-600">
            <th className="px-3 py-2 font-medium">ID</th>
            <th className="px-3 py-2 font-medium">User</th>
            <th className="px-3 py-2 font-medium">Title</th>
            <th className="px-3 py-2 font-medium">Preview</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-3 py-8 text-center text-neutral-500">
                {emptyMessage ?? "No rows."}
              </td>
            </tr>
          ) : (
            posts.map((post) => <PostRow key={post.id} post={post} />)
          )}
        </tbody>
      </table>
    </div>
  );
});
