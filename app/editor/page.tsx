"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { processVideo, processVideoSrt } from "@/utils/fetch";
import Loader from "@/components/Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Email from "next-auth/providers/email";

const Model = {
  hayao: "app/model/deploy/AnimeGANv3_Hayao_36.onnx",
  shinkai: "app/model/deploy/AnimeGANv3_Shinkai_37.onnx",
  paprika: "app/model/deploy/AnimeGANv3_Paprika.onnx",
  portraitSketch: "app/model/deploy/AnimeGANv3_PortraitSketch.onnx",
  jpFace: "app/model/deploy/AnimeGANv3_JP_face.onnx",
};

export default function VideoContainer() {
  const { data: session, status } = useSession();
  const [videoUrl, setVideoUrl] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;

  if (!session || !session.user) {
    return <p>You need to be authenticated to view this page.</p>;
  }

  const email = session.user.email;

  const handleVideoUpload = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const videoUrl = URL.createObjectURL(file);
      setVideoUrl(videoUrl);
    }
  };

  function Modal() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(Model.hayao);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    function closeModal() {
      setIsOpen(false);
    }

    function openModal() {
      setIsOpen(true);
    }

    const handleModelChange = (e: any) => {
      setSelectedModel(e.target.value);
    };

    const handleSrtUpload = (e: any) => {
      const fileInput = e.target;
      const file = fileInput.files[0];
      if (file && file.name.endsWith(".srt")) {
        setVideoFile(file);
      } else {
        alert("Please upload a valid SRT file.");
        fileInput.value = ""; // Clear the input
      }
    };

    const handleConvertWithSubtitle = async () => {
      if (videoFile && videoUrl) {
        const srtUrl = URL.createObjectURL(videoFile);
        setLoading(true);
        try {
          const result = await processVideoSrt(
            videoUrl,
            selectedModel,
            srtUrl,
            email
          );
          console.log("Download URL:", result.downloadUrl);
          console.log("R2 Object Name:", result.videoObjectName);
        } catch (error) {
          console.error("Error processing video:", error);
        } finally {
          setLoading(false);
        }
      } else {
        alert("Please upload a video file before converting.");
      }
    };

    const handleConvertWithoutSubtitle = async () => {
      if (videoUrl) {
        setLoading(true);
        try {
          const result = await processVideo(videoUrl, selectedModel, email);
          console.log("Download URL:", result.downloadUrl);
          console.log("R2 Object Name:", result.videoObjectName);
        } catch (error) {
          console.error("Error processing video:", error);
        } finally {
          setLoading(false);
          router.push("/comic-editor/");
        }
      } else {
        alert("Please upload a video file before converting.");
      }
    };

    return (
      <>
        <button
          type="button"
          onClick={openModal}
          className={`px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 w-full ${
            loading || !videoUrl
              ? "bg-blue-300 text-white cursor-not-allowed"
              : "text-white bg-blue-500 hover:bg-blue-700"
          }`}
          disabled={loading || !videoUrl}
        >
          Proceed to next phase
        </button>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex items-center justify-center min-h-full p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                    <div className="flex justify-between items-center">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Choosing the option
                      </Dialog.Title>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                        onClick={closeModal}
                      >
                        <span className="sr-only">Close</span>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="modelSelect"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Select Model
                      </label>
                      <select
                        id="modelSelect"
                        value={selectedModel}
                        onChange={handleModelChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {Object.keys(Model).map((key) => (
                          <option key={key} value={Model[key]}>
                            {key}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="srtUpload"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Upload Subtitle
                      </label>
                      <input
                        type="file"
                        id="srtUpload"
                        accept=".srt"
                        onChange={handleSrtUpload}
                        className="mt-1 block w-full text-base text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div className="mt-4">
                      {loading ? (
                        <Loader />
                      ) : (
                        <>
                          <button
                            type="button"
                            className="w-full px-4 py-2 mb-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                            onClick={handleConvertWithSubtitle}
                          >
                            Convert with Subtitle
                          </button>
                          <button
                            type="button"
                            className="w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                            onClick={handleConvertWithoutSubtitle}
                          >
                            Convert without Subtitle
                          </button>
                        </>
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
  }

  return (
    <div className="flex h-full">
      <div
        className={clsx(
          "transition-all duration-300 bg-slate-2 00 p-4 shadow-md overflow-hidden",
          {
            "w-16": collapsed,
            "w-fit": !collapsed,
          }
        )}
      >
        <div className="mb-4">
          <label
            htmlFor="videoUpload"
            className={clsx("block text-sm font-medium text-gray-700 mb-1", {
              hidden: collapsed,
            })}
          >
            Upload Video:
          </label>
          <input
            type="file"
            id="videoUpload"
            accept="video/*"
            onChange={handleVideoUpload}
            className={clsx(
              "px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm",
              {
                hidden: collapsed,
              }
            )}
          />
        </div>
        <div
          className={clsx({
            hidden: collapsed,
          })}
        >
          <Modal />
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-[48px] mt-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300"
        >
          {collapsed ? (
            <ChevronRightIcon className="w-6" />
          ) : (
            <ChevronLeftIcon className="w-6" />
          )}
        </button>
      </div>
      <div className="flex-grow p-4">
        {videoUrl && (
          <div className="w-full h-full">
            <video
              src={videoUrl}
              className="w-full h-full rounded-md"
              controls
            />
          </div>
        )}
      </div>
    </div>
  );
}
