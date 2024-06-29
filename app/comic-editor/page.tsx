"use client";

import React, { useEffect, useState } from "react";
import { fetchUserData } from "@/utils/fetch"; // Ensure this import points to your fetchUserData function
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { PlayIcon } from "@heroicons/react/24/solid";

export default function ComicEditor() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session && session.user) {
      async function getUserData() {
        try {
          const data = await fetchUserData(session.user.email);
          setUserData(data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      }

      getUserData();
    }
  }, [session]);

  if (status === "loading" || loading) {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    return <p>You need to be authenticated to view this page.</p>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const handleNavigate = (projectId) => {
    router.push(`/comic-editor/${projectId}`);
  };

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Projects for {userData.data.email}
      </h1>
      <hr className="mb-10" />
      {userData.data.projects.length === 0 ? (
        <p className="text-center text-gray-500">
          Please upload video to start comic generating ~
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userData.data.projects.map((project) => (
            <div
              key={project.id}
              className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center w-full max-w-sm mx-auto"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                <p className="text-gray-600">
                  Created at: {new Date(project.created_at).toLocaleString()}
                </p>
                <a
                  href={project.frames_download_url}
                  className="text-blue-500 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Frames
                </a>
                <a
                  href={project.video_download_url}
                  className="text-blue-500 hover:underline ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Converted Video
                </a>
                <a
                  href={project.original_video_download_url}
                  className="text-blue-500 hover:underline ml-4"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download original Video
                </a>
              </div>
              <button
                onClick={() => handleNavigate(project.id)}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
                style={{ width: "40px", height: "40px" }}
              >
                <PlayIcon className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
