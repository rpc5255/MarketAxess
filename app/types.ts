import * as t from "io-ts";
import { isLeft } from "fp-ts/lib/Either";

const Picture = t.type({
  id: t.string,
  url: t.string,
  width: t.number,
  height: t.number,
});

export type PictureT = t.TypeOf<typeof Picture>;

// validates json is of type Picture[], otherwise throws an error
export function decodePictureArray(json: unknown): PictureT[] {
  const decoded = t.array(Picture).decode(json);
  if (isLeft(decoded)) {
    throw Error("Unexpected data format");
  }
  const decodedPictures: PictureT[] = decoded.right;
  return decodedPictures;
}
