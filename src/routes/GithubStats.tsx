import React from "react";
import { useFetch } from "../hooks/useFetch";

// Fallback object — the JSON you provided with meaningful fields
const fallbackData = {
  login: "adityaSrivastava29",
  id: 59208761,
  avatar_url: "https://avatars.githubusercontent.com/u/59208761?v=4",
  html_url: "https://github.com/adityaSrivastava29",
  name: "Aditya Kumar",
  company: "@cognizant",
  blog: "https://adityasri.in/",
  location: "Noida, India",
  bio: "Full Stack Developer @Cognizant  | AI Enthusiast",
  twitter_username: "adityasri_in",
  public_repos: 75,
  public_gists: 0,
  followers: 16,
  following: 60,
  created_at: "2019-12-24T18:39:06Z",
  updated_at: "2025-11-22T13:05:07Z",
};

const GithubStats: React.FC = () => {
  const {
    data: fetched,
    loading,
    error,
  } = useFetch("https://api.github.com/users/adityasrivastava29");

  const data = fetched ?? fallbackData;

  if (loading) return <div className="p-4">Loading...</div>;
  if (error)
    return <div className="p-4 text-red-600">Error: {error.message}</div>;

  const formatDate = (iso?: string) =>
    iso ? new Date(iso).toLocaleString() : "-";

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items:center md:items-start gap-4 bg-white dark:bg-blue-600 rounded-lg shadow-md p-6">
        <img
          src={data.avatar_url}
          alt={`${data.login} avatar`}
          className="w-28 h-28 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
        />

        <div className="flex-1 w-full">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{data.name ?? data.login}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-300">
                @{data.login}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={data.html_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                View on GitHub
              </a>
            </div>
          </div>

          {data.bio && (
            <p className="mt-3 text-gray-700 dark:text-gray-300">{data.bio}</p>
          )}

          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
            <div>
              <strong>Company:</strong>
              <div className="text-gray-600 dark:text-gray-300">
                {data.company ?? "-"}
              </div>
            </div>
            <div>
              <strong>Location:</strong>
              <div className="text-gray-600 dark:text-gray-300">
                {data.location ?? "-"}
              </div>
            </div>
            <div>
              <strong>Blog:</strong>
              <div className="text-blue-600 dark:text-blue-400">
                {data.blog ? (
                  <a href={data.blog} target="_blank" rel="noreferrer">
                    {data.blog}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>
            <div>
              <strong>Twitter:</strong>
              <div className="text-gray-600 dark:text-gray-300">
                {data.twitter_username ? (
                  <a
                    href={`https://twitter.com/${data.twitter_username}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 dark:text-blue-400">
                    @{data.twitter_username}
                  </a>
                ) : (
                  "-"
                )}
              </div>
            </div>

            <div>
              <strong>Repos:</strong>
              <div className="text-gray-600 dark:text-gray-300">
                {data.public_repos}
              </div>
            </div>
            <div>
              <strong>Followers:</strong>
              <div className="text-gray-600 dark:text-gray-300">
                {data.followers}
              </div>
            </div>
            <div>
              <strong>Following:</strong>
              <div className="text-gray-600 dark:text-gray-300">
                {data.following}
              </div>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            <div>Account created: {formatDate(data.created_at)}</div>
            <div>Last updated: {formatDate(data.updated_at)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GithubStats;
