"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useRouter, useParams } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import {
  fetchProject,
  saveProjectState,
  downloadProjectImages,
} from "@/utils/fetch";
import {
  TrashIcon,
  PlusCircleIcon,
  ArrowDownOnSquareIcon,
  BookmarkIcon,
  BackspaceIcon,
  StarIcon,
  ArrowDownIcon,
} from "@heroicons/react/24/solid";

function DraggableImage({
  url,
  index,
  currentIndex,
  setCurrentIndex,
  deleteImage,
  favoriteImage,
  isFavorite,
  downloadImage,
}) {
  return (
    <div className="relative mb-4">
      <img
        src={url}
        alt={`Thumbnail ${index + 1}`}
        className={`cursor-pointer w-full h-auto ${
          currentIndex === index ? "border-4 border-blue-500" : ""
        }`}
        onClick={() => setCurrentIndex(index)}
      />
      <span className="absolute top-2 left-2 bg-gray-700 text-white text-xs px-2 py-1 rounded-full">
        {index + 1}
      </span>
      <button
        onClick={() => deleteImage(index)}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-700"
      >
        <TrashIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => favoriteImage(index)}
        className={`absolute bottom-2 right-2 p-1 rounded-full ${
          isFavorite ? "bg-yellow-500 hover:bg-yellow-700" : "bg-gray-500 hover:bg-gray-700"
        } text-white`}
      >
        <StarIcon className="w-4 h-4" />
      </button>
      <button
        onClick={() => downloadImage(url, index)}
        className="absolute bottom-2 left-2 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-700"
      >
        <ArrowDownIcon className="w-4 h-4" />
      </button>
    </div>
  );
}

export default function Slideshow() {
  const [imageUrls, setImageUrls] = useState([]);
  const [deletedImageIndexes, setDeletedImageIndexes] = useState([]);
  const [favoriteImageIndexes, setFavoriteImageIndexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFavoriteModalOpen, setIsFavoriteModalOpen] = useState(false);
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  useEffect(() => {
    if (!projectId) {
      return;
    }

    async function getProjectData() {
      try {
        const data = await fetchProject(projectId);
        setImageUrls(data.images);
        setDeletedImageIndexes(data.deleted);
        setFavoriteImageIndexes(data.favorites || []);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    getProjectData();
  }, [projectId]);

  const deleteImage = (index) => {
    if (!deletedImageIndexes.includes(index)) {
      setDeletedImageIndexes((prevDeletedImageIndexes) => [
        ...prevDeletedImageIndexes,
        index,
      ]);
    }
  };

  const restoreImage = (index) => {
    setDeletedImageIndexes((prevDeletedImageIndexes) =>
      prevDeletedImageIndexes.filter((i) => i !== index)
    );
  };

  const favoriteImage = (index) => {
    if (favoriteImageIndexes.includes(index)) {
      setFavoriteImageIndexes((prevFavoriteImageIndexes) =>
        prevFavoriteImageIndexes.filter((i) => i !== index)
      );
    } else {
      setFavoriteImageIndexes((prevFavoriteImageIndexes) => [
        ...prevFavoriteImageIndexes,
        index,
      ]);
    }
  };

  const downloadImage = (url, index) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `image_${index + 1}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openFavoriteModal = () => {
    setIsFavoriteModalOpen(true);
  };

  const closeFavoriteModal = () => {
    setIsFavoriteModalOpen(false);
  };

  const handleSave = async () => {
    try {
      await saveProjectState(projectId, imageUrls.map((_, index) => index), deletedImageIndexes, favoriteImageIndexes);
      alert("Project state saved successfully.");
    } catch (error) {
      alert("Failed to save project state.");
      console.error(error);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadProjectImages(projectId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project_${projectId}_images.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download images.");
      console.error(error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const activeImageUrls = imageUrls.filter(
    (_, index) => !deletedImageIndexes.includes(index)
  );
  const deletedImages = imageUrls.filter((_, index) =>
    deletedImageIndexes.includes(index)
  );
  const favoriteImages = imageUrls.filter((_, index) =>
    favoriteImageIndexes.includes(index)
  );

  return (
    <div className="mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Slideshow for Project {projectId}
      </h1>
      <div className="flex mb-4 gap-10">
        <button
          onClick={openModal}
          className="bg-gray-700 text-white py-2 px-4 rounded-full hover:bg-gray-900 flex items-center"
        >
          <BackspaceIcon className="w-5 h-5 mr-2" /> Show deleted items
        </button>
        <button
          onClick={openFavoriteModal}
          className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-700 flex items-center"
        >
          <StarIcon className="w-5 h-5 mr-2" /> Show favorite items
        </button>
        <button
          onClick={handleSave}
          className="bg-blue-500 text-white py-2 px-4 rounded-full hover:bg-blue-700 flex items-center"
        >
          <BookmarkIcon className="w-5 h-5 mr-2" /> Save
        </button>
        <button
          onClick={handleDownload}
          className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-700 flex items-center"
        >
          <ArrowDownOnSquareIcon className="w-5 h-5 mr-2" /> Download Images as
          Zip
        </button>
      </div>
      <p className="mb-4">Total Images: {activeImageUrls.length}</p>
      <div className="flex">
        <div className="w-1/6 overflow-y-auto" style={{ maxHeight: "108vh" }}>
          {activeImageUrls.map((url, visualIndex) => {
            const actualIndex = imageUrls.indexOf(url);
            return (
              <DraggableImage
                key={actualIndex}
                url={url}
                index={actualIndex}
                currentIndex={currentIndex}
                setCurrentIndex={setCurrentIndex}
                deleteImage={deleteImage}
                favoriteImage={favoriteImage}
                isFavorite={favoriteImageIndexes.includes(actualIndex)}
                downloadImage={downloadImage}
              />
            );
          })}
        </div>
        <div className="w-5/6 relative">
          <img
            src={activeImageUrls[currentIndex]}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-auto"
          />
        </div>
      </div>
      <Transition appear show={isModalOpen} as={Fragment}>
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

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Deleted Images
                </Dialog.Title>
                <p className="mb-4">
                  Total Deleted Images: {deletedImages.length}
                </p>
                <div className="mt-2">
                  {deletedImages.length === 0 ? (
                    <p>No deleted images.</p>
                  ) : (
                    <div className="flex flex-wrap">
                      {deletedImages.map((url, visualIndex) => {
                        const actualIndex = imageUrls.indexOf(url);
                        return (
                          <div
                            key={actualIndex}
                            className="relative w-1/3 p-2"
                          >
                            <img
                              src={url}
                              alt={`Deleted Thumbnail ${actualIndex + 1}`}
                              className="w-full h-auto"
                            />
                            <button
                              onClick={() => restoreImage(actualIndex)}
                              className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full hover:bg-green-700"
                            >
                              <PlusCircleIcon className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <Transition appear show={isFavoriteModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeFavoriteModal}>
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

          <div className="fixed inset-0 overflow-y-auto flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Favorite Images
                </Dialog.Title>
                <p className="mb-4">
                  Total Favorite Images: {favoriteImages.length}
                </p>
                <div className="mt-2">
                  {favoriteImages.length === 0 ? (
                    <p>No favorite images.</p>
                  ) : (
                    <div className="flex flex-wrap">
                      {favoriteImages.map((url, visualIndex) => {
                        const actualIndex = imageUrls.indexOf(url);
                        return (
                          <div
                            key={actualIndex}
                            className="relative w-1/3 p-2"
                          >
                            <img
                              src={url}
                              alt={`Favorite Thumbnail ${actualIndex + 1}`}
                              className="w-full h-auto"
                            />
                            <button
                              onClick={() => favoriteImage(actualIndex)}
                              className="absolute top-2 right-2 bg-yellow-500 text-white p-1 rounded-full hover:bg-yellow-700"
                            >
                              <StarIcon className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                    onClick={closeFavoriteModal}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
