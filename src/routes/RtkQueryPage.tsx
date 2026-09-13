import React, { useState } from "react";
import {
  useGetPostsQuery,
  useAddPostMutation,
  useDeletePostMutation,
} from "../features/rtk-query/apiSlice";
import CodeBlock from "../hooks/CodeBlock";
import { LearningNote } from "../components/LearningNote";
import { useSelector } from "react-redux";
import type { RootState } from "../store";
import { useTheme } from "../hooks/useTheme";

const RtkQueryPage: React.FC = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [postLimit, setPostLimit] = useState(6);
  const [pollingInterval, setPollingInterval] = useState(0);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const {
    data: posts,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetPostsQuery(
    { limit: postLimit, search: searchTerm },
    { pollingInterval }
  );

  const [addPost, { isLoading: isAdding }] = useAddPostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  const rtkQueryCacheState = useSelector(
    (state: RootState) => state.postsApi
  );

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    try {
      await addPost({ title: title.trim(), body: body.trim(), userId: 1 }).unwrap();
      setTitle("");
      setBody("");
    } catch (err) {
      console.error("Failed to add post:", err);
    }
  };

  const handleDeletePost = async (id: number) => {
    try {
      await deletePost(id).unwrap();
    } catch (err) {
      console.error("Failed to delete post:", err);
    }
  };

  // High-contrast code badge classes for light/dark mode
  const codeBadgeBlue = theme === "dark"
    ? "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-900 text-blue-100 border border-blue-700"
    : "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-blue-200 text-blue-950 border border-blue-300";

  const codeBadgeGreen = theme === "dark"
    ? "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-900 text-emerald-100 border border-emerald-700"
    : "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-emerald-200 text-emerald-950 border border-emerald-300";

  const codeBadgePurple = theme === "dark"
    ? "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-purple-900 text-purple-100 border border-purple-700"
    : "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-purple-200 text-purple-950 border border-purple-300";

  const codeBadgeNeutral = theme === "dark"
    ? "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-700 text-amber-300 border border-gray-600"
    : "font-mono px-1.5 py-0.5 rounded text-xs font-semibold bg-gray-200 text-purple-900 border border-gray-300";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <span>⚡</span> RTK Query Mastery & Live Playground
        </h1>
        <p className={`text-base ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
          RTK Query is Redux Toolkit's powerful data fetching and caching tool. It eliminates boilerplate code for manual fetching thunks, loading flags, error states, and cache management.
        </p>
      </div>

      {/* Concept Definition Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-lg border ${
            theme === "dark"
              ? "bg-blue-950/40 border-blue-800 text-blue-200"
              : "bg-blue-50 border-blue-200 text-blue-900"
          }`}>
          <h3 className="font-bold text-sm mb-1">1. createApi & fetchBaseQuery</h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            Centralized API slice definition. <code className={codeBadgeBlue}>fetchBaseQuery</code> is a lightweight wrapper around <code className={codeBadgeBlue}>fetch</code> that handles headers, base URL, and response parsing automatically.
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            theme === "dark"
              ? "bg-emerald-950/40 border-emerald-800 text-emerald-200"
              : "bg-emerald-50 border-emerald-200 text-emerald-900"
          }`}>
          <h3 className="font-bold text-sm mb-1">2. Auto-generated Hooks</h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            RTK Query generates hooks automatically (e.g. <code className={codeBadgeGreen}>useGetPostsQuery</code>) providing data, <code className={codeBadgeGreen}>isLoading</code>, <code className={codeBadgeGreen}>isFetching</code>, <code className={codeBadgeGreen}>error</code>, and <code className={codeBadgeGreen}>refetch()</code>.
          </p>
        </div>

        <div
          className={`p-4 rounded-lg border ${
            theme === "dark"
              ? "bg-purple-950/40 border-purple-800 text-purple-200"
              : "bg-purple-50 border-purple-200 text-purple-900"
          }`}>
          <h3 className="font-bold text-sm mb-1">3. Automated Cache & Tag Invalidation</h3>
          <p className="text-xs sm:text-sm leading-relaxed">
            Queries declare <code className={codeBadgePurple}>providesTags</code> and mutations declare <code className={codeBadgePurple}>invalidatesTags</code>. Executing a mutation automatically re-fetches stale queries!
          </p>
        </div>
      </div>

      {/* Interactive Playground Section */}
      <div
        className={`p-6 rounded-lg border space-y-6 ${
          theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-gray-100 border-gray-200 text-gray-900"
        }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              🧪 Live RTK Query Interactive Playground
            </h2>
            <p className="text-xs opacity-75 mt-1">
              Interact with mock endpoints, test search filtering, trigger mutations, and observe cache invalidation.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-all">
              <span className={isFetching ? "animate-spin" : ""}>🔄</span>
              {isFetching ? "Fetching..." : "Manual Refetch"}
            </button>

            <button
              onClick={() => setPollingInterval((prev) => (prev === 0 ? 5000 : 0))}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                pollingInterval > 0
                  ? "bg-emerald-600 text-white animate-pulse"
                  : theme === "dark"
                  ? "bg-gray-700 text-gray-200"
                  : "bg-gray-200 text-gray-800"
              }`}>
              {pollingInterval > 0 ? "⏱️ Polling Active (5s)" : "⏱️ Enable Polling (5s)"}
            </button>
          </div>
        </div>

        {/* Controls Bar */}
        <div
          className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded border ${
            theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
          }`}>
          <div>
            <label className="text-xs font-semibold block mb-1 opacity-80">
              Search Title/Body (Client Transform)
            </label>
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full px-3 py-1.5 border rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1 opacity-80">
              Limit Posts Count
            </label>
            <select
              value={postLimit}
              onChange={(e) => setPostLimit(Number(e.target.value))}
              className={`w-full px-3 py-1.5 border rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}>
              <option value={3}>3 Posts</option>
              <option value={6}>6 Posts</option>
              <option value={10}>10 Posts</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold block mb-1 opacity-80">
              Query State Flags
            </label>
            <div className="flex gap-2 text-xs font-mono pt-1">
              <span className={`px-2 py-0.5 rounded ${isLoading ? "bg-amber-100 text-amber-800 font-bold" : "opacity-60"}`}>
                isLoading: {isLoading ? "true" : "false"}
              </span>
              <span className={`px-2 py-0.5 rounded ${isFetching ? "bg-blue-100 text-blue-800 font-bold" : "opacity-60"}`}>
                isFetching: {isFetching ? "true" : "false"}
              </span>
            </div>
          </div>
        </div>

        {/* Add Post Form */}
        <form
          onSubmit={handleAddPost}
          className={`p-4 rounded border space-y-3 ${
            theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
          }`}>
          <h3 className="text-sm font-bold flex items-center justify-between">
            <span>➕ Create Post Mutation (Triggers Tag Invalidation)</span>
            {isAdding && <span className="text-xs text-blue-500 animate-pulse">Submitting mutation...</span>}
          </h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Post Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`px-3 py-1.5 border rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
            <input
              type="text"
              placeholder="Post Body Content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`px-3 py-1.5 border rounded text-xs ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-400"
              }`}
            />
          </div>
          <button
            type="submit"
            disabled={isAdding || !title.trim() || !body.trim()}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded text-xs font-semibold transition-all">
            Submit New Post (invalidatesTags: ['Post'])
          </button>
        </form>

        {/* Posts Grid */}
        <div>
          <h3 className="text-sm font-bold mb-3 flex items-center justify-between">
            <span>📰 Fetched Posts List</span>
            <span className="text-xs opacity-75 font-normal">
              Showing {posts?.length || 0} posts
            </span>
          </h3>

          {isLoading && (
            <div className="p-8 text-center opacity-75 animate-pulse font-medium">
              Loading posts via RTK Query...
            </div>
          )}

          {isError && (
            <div className="p-4 bg-red-100 text-red-800 rounded text-sm">
              Error loading posts: {JSON.stringify(error)}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts?.map((post) => (
              <div
                key={post.id}
                className={`p-4 rounded border flex flex-col justify-between space-y-3 ${
                  theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-300"
                }`}>
                <div>
                  <div className="flex items-center justify-between text-xs opacity-60 mb-1">
                    <span>Post #{post.id}</span>
                    <span>User #{post.userId}</span>
                  </div>
                  <h4 className="font-bold text-sm capitalize line-clamp-1">
                    {post.title}
                  </h4>
                  <p className="text-xs opacity-80 mt-1 line-clamp-2">
                    {post.body}
                  </p>
                </div>

                <button
                  onClick={() => handleDeletePost(post.id)}
                  disabled={isDeleting}
                  className="px-2.5 py-1 text-xs bg-red-600 hover:bg-red-700 text-white rounded transition-colors self-end">
                  Delete (invalidatesTags)
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Redux RTK Query Cache Inspector */}
        <div className="p-4 bg-gray-950 text-emerald-400 rounded-lg font-mono text-xs overflow-x-auto space-y-2 border border-gray-800">
          <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
            <span className="font-bold text-gray-200">🔍 Live RTK Query Cache Store Inspector</span>
            <span>Slice Name: `postsApi`</span>
          </div>
          <div>
            <p className="text-gray-400">// Queries cache keys currently active in Redux store:</p>
            <pre className="text-xs text-amber-300 mt-1">
              {JSON.stringify(rtkQueryCacheState?.queries || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>

      {/* Code Snippets & Architecture Walkthrough */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">📚 RTK Query Implementation Code</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-1">1. Defining the API Slice</h3>
            <CodeBlock
              language="ts"
              code={`import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://jsonplaceholder.typicode.com' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], number>({
      query: (limit) => \`/posts?_limit=\${limit}\`,
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Post' as const, id })), { type: 'Post', id: 'LIST' }]
          : [{ type: 'Post', id: 'LIST' }],
    }),
    addPost: builder.mutation<Post, Partial<Post>>({
      query: (body) => ({ url: '/posts', method: 'POST', body }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
  }),
});`}
            />
          </div>

          <div>
            <h3 className="font-bold text-lg mb-1">2. Consuming Hooks in Components</h3>
            <CodeBlock
              language="tsx"
              code={`import { useGetPostsQuery, useAddPostMutation } from './apiSlice';

function PostsList() {
  const { data: posts, isLoading, refetch } = useGetPostsQuery({ limit: 6 });
  const [addPost, { isLoading: isAdding }] = useAddPostMutation();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map(post => <p key={post.id}>{post.title}</p>)}
      <button onClick={() => addPost({ title: 'New' })}>Add</button>
    </div>
  );
}`}
            />
          </div>
        </div>
      </div>

      <LearningNote title="RTK Query Best Practices">
        <ul className="text-sm space-y-1 list-disc pl-4">
          <li><strong>One API slice per base URL:</strong> Generally create one API slice per base URL for optimal cache sharing.</li>
          <li><strong>Use Tag Invalidation:</strong> Prefer tag invalidation over manual state manipulation to keep client cache automatically synced with backend.</li>
          <li><strong>Transforming Responses:</strong> Use <code className={codeBadgeNeutral}>transformResponse</code> to structure payloads before they reach components.</li>
        </ul>
      </LearningNote>
    </div>
  );
};

export default RtkQueryPage;
