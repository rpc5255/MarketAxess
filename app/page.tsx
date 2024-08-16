"use client";

import { useEffect, useState } from "react";
import { decodePictureArray, PictureT } from "./types";

export default function Home() {
  const [pictures, setPictures] = useState<PictureT[]>([]);
  const [loaded, setLoaded] = useState<string[]>([]);

  async function getImages() {
    try {
      const response = await fetch(
        "https://api.thecatapi.com/v1/images/search?limit=10",
      );
      const json = (await response.json()) as unknown;
      const pictures = decodePictureArray(json);
      setPictures(pictures);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    void getImages();
  }, []);

  // click handler never receives stale state
  function handleDeletePicture(id: string) {
    setPictures(pictures.filter((i) => i.id !== id));
  }

  // onError not guaranteed to have latest state value
  function handleLoadingError(id: string) {
    setPictures((prevPictures) =>
      prevPictures.map((picture) => {
        if (picture.id === id) {
          return { ...picture, url: "./placeholder.svg" };
        } else {
          return picture;
        }
      }),
    );
  }

  // onLoad not guaranteed to have latest state value
  function handleLoad(id: string) {
    setLoaded((prevLoaded) => [...prevLoaded, id]);
  }

  return (
    <div className="text-center space-y-2 m-2">
      <h1 className="text-4xl">Cat Pictures</h1>
      <ul className="flex flex-wrap gap-2">
        {pictures.map((picture) => (
          <li
            className={`inline-flex items-start gap-1 p-2 border border-black rounded ${loaded.includes(picture.id) ? "" : "hidden"}`}
            key={picture.id}
          >
            <img
              alt={`cat picture ${picture.id}`}
              className="w-full h-auto"
              src={picture.url}
              width={picture.width}
              height={picture.height}
              onLoad={() => handleLoad(picture.id)}
              onError={() => handleLoadingError(picture.id)}
            ></img>
            <button
              className="shrink-0"
              onClick={() => handleDeletePicture(picture.id)}
            >
              <img alt="delete" src="/trash.svg" className="size-6"></img>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
