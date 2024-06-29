"use client";

import { useSession } from 'next-auth/react';
import AboutVideo from "@/components/Introduction/AboutVideo";
import SampleStyles from "@/components/Introduction/SampleStyles";
import Link from "next/link";
import { ArrowRightIcon, PlayIcon } from "@heroicons/react/24/outline";
import { ScissorsIcon, CubeTransparentIcon } from "@heroicons/react/20/solid";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { fetchRecentData } from '@/utils/fetch';  // Ensure this import points to your fetchUserData function

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/');
    } else {
      async function getUserData() {
        try {
          const data = await fetchRecentData(session.user.email);
          setUserData(data);
          setLoading(false);
        } catch (err) {
          setError(err);
          setLoading(false);
        }
      }
      getUserData();
    }
  }, [session, status, router]);

  if (status === 'loading' || loading) return <p>Loading...</p>;

  if (!session) {
    return <p>You need to be authenticated to view this page.</p>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="max-w-screen-2xl ">
      <div className="grid grid-cols-4 mx-auto bg-slate-100 gap-4">
        <div className="relative rounded-lg col-span-1 bg-white overflow-hidden">
          <AboutVideo />
        </div>
        <div className="col-span-3 grid grid-cols-2 rounded-lg bg-white">
          <div className="col-span-1 p-4">
            <div className="text-2xl mb-3 font-base">
              Select a template to get started !
            </div>
            <div className="font-light mb-3">
              Browse our collection of free customizable templates, and start
              editing your video
            </div>
            <Link href={"/templates"}>
              <div
                className="inline-block bg-gradient-to-r from-[#E92762] via-[#9E8DBC] to-[#C9C9C9]
              p-2 text-white rounded-lg
              hover:opacity-50  
            hover:text-violet-900
              duration-300"
              >
                <span className="flex items-center space-x-2">
                  <div>Explore now</div>
                  <ArrowRightIcon className="w-5 h-5" />
                </span>
              </div>
            </Link>
          </div>
          <div className="relative w-full col-span-1 rounded-r-lg overflow-hidden">
            <SampleStyles />
          </div>
        </div>
      </div>
      <div>
        <div className="mt-5 font-light text-xl">Create your Project!</div>
        <div className="mt-5 grid grid-cols-4 gap-6">
          <Link
            href={"/editor"}
            className="flex items-center p-3 rounded-lg col-span-1 
          bg-white text-black gap-3 
          hover:bg-slate-200
          hover:text-[#E3356B]
          hover:border
          hover:border-[#E3356B]
          duration-100"
          >
            <ScissorsIcon className="bg-[#fbe3ea] text-[#E3356B] w-9 h-9 p-1"></ScissorsIcon>
            <div className="font-light">Upload Video</div>
          </Link>
          <Link
            href={"/comic-editor"}
            className="flex items-center p-3 rounded-lg col-span-1 
            bg-white text-black gap-3
            hover:bg-slate-200

          hover:text-violet-900
          hover:border
          hover:border-violet-900
          duration-100"
          >
            <CubeTransparentIcon className="bg-[#f1ebf2] text-[#A884B3] w-9 h-9 p-1"></CubeTransparentIcon>
            <div className="font-light">Project List</div>
          </Link>
        </div>
      </div>
      <div>
        <div className="mt-5 font-light text-xl">Recent Video</div>
        {userData.data.projects.length === 0 ? (
          <p className="text-center text-gray-500">No recent videos available.</p>
        ) : (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userData.data.projects.map((project) => (
              <div key={project.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center w-full max-w-sm mx-auto">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                  <p className="text-gray-600">Created at: {new Date(project.created_at).toLocaleString()}</p>
                  <a href={project.frames_download_url} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">Download Frames</a>
                  <a href={project.video_download_url} className="text-blue-500 hover:underline ml-4" target="_blank" rel="noopener noreferrer">Download Converted Video</a>
                  <a href={project.original_video_download_url} className="text-blue-500 hover:underline ml-4" target="_blank" rel="noopener noreferrer">Download original Video</a>
                </div>
                <button
                  onClick={() => router.push(`/comic-editor/${project.id}`)}
                  className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-700 flex items-center justify-center"
                  style={{ width: '40px', height: '40px' }}
                >
                  <PlayIcon className="w-6 h-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
