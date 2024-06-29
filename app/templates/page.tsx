"use client";

import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { fetchAssets } from "@/utils/fetch";

const descriptions = {
  video: "This is the original one",
  hayao: "This style emulates the animation style of Hayao Miyazaki.",
  shinkai: "This style emulates the animation style of Makoto Shinkai.",
  paprika: "This style is inspired by the vibrant and surreal colors of Paprika.",
  portraitSketch: "This style converts the video into a portrait sketch.",
  jpFace: "This style focuses on Japanese facial animation effects.",
};

const videoWidth = 640; // Adjust the modal video size if needed
const videoHeight = 480;

const themeColors = {
  video: "bg-gradient-to-r from-blue-400 via-blue-500 to-gray-600 text-white",
  hayao: "bg-gradient-to-r from-[#55A84C] via-[#279C8B] to-[#032966] text-white",
  shinkai: "bg-gradient-to-r from-[#4E8BD7] via-[#FDEDB4] to-[#D0BBD3] text-black",
  paprika: "bg-gradient-to-r from-[#AA4436] via-[#F2C89C] to-[#312623] text-white",
  portraitSketch: "bg-gradient-to-r from-gray-800 via-gray-600 to-gray-400 text-white",
  jpFace: "bg-gradient-to-r from-pink-300 via-pink-200 to-pink-100 text-black",
};

export default function Page() {
  const [presignedUrls, setPresignedUrls] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getPresignedUrls = async () => {
      try {
        const urls = await fetchAssets();
        setPresignedUrls(urls);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getPresignedUrls();
  }, []);

  const handlePlay = (model) => {
    setPlaying(model);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPlaying(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Video Styles Comparison</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(presignedUrls).map(([model, url]) => (
          <div
            key={model}
            className={`${themeColors[model]} p-4 rounded-lg shadow-md hover:opacity-75 duration-300 cursor-pointer`}
            onClick={() => handlePlay(model)}
          >
            <h2 className="text-xl font-semibold mb-2">{model}</h2>
            <p className="mb-4">{descriptions[model]}</p>
          </div>
        ))}
      </div>

      <Transition show={isModalOpen} as={React.Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={React.Fragment}
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
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className={`w-full max-w-3xl transform overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${themeColors[playing]}`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6">
                      {playing}
                    </Dialog.Title>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      onClick={closeModal}
                    >
                      <span className="sr-only">Close</span>
                      <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-center">
                    {playing && (
                      <video width={videoWidth} height={videoHeight} controls autoPlay>
                        <source src={presignedUrls[playing]} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
