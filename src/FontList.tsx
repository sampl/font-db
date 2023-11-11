import { useState } from "react";
import { useInfiniteHits } from "react-instantsearch";

import { previewTexts } from "./defaults/previewTexts";
import type { Hit } from "../types/types";
import Modal from "./components/Modal";
import DetailPage from "./DetailPage";
import useFont from "./hooks/useFont";

const TEST_WITH_GOOGLE_FONTS = true;

const FontList = ({
  previewSize,
  previewText,
  previewTextCustom,
  setPreviewTextCustom,
}: {
  previewSize: number;
  previewText?: string;
  previewTextCustom?: string | null;
  setPreviewTextCustom: (text: string | null) => void;
}) => {
  const { hits, showPrevious, showMore, isFirstPage, isLastPage } =
    useInfiniteHits();
  const [currentFont, setCurrentFont] = useState<Hit | null>(null);

  return (
    <div>
      <Modal isOpen={Boolean(currentFont)} onClose={() => setCurrentFont(null)}>
        {currentFont && <DetailPage fontFamily={currentFont.name} />}
      </Modal>

      {!isFirstPage && (
        <button onClick={showPrevious} disabled={isFirstPage}>
          Show previous results
        </button>
      )}

      <ol className="font-family-list">
        {/* @ts-ignore */}
        {hits.map((hit: Hit) => (
          <FontListItem
            key={hit.objectID}
            hit={hit}
            fontFamily={hit.name}
            previewSize={previewSize}
            previewText={previewText}
            previewTextCustom={previewTextCustom}
            setPreviewTextCustom={setPreviewTextCustom}
            setCurrentFont={setCurrentFont}
          />
        ))}
      </ol>
      <button onClick={showMore} disabled={isLastPage}>
        Show more results
      </button>
    </div>
  );
};

const FontListItem = ({
  hit,
  fontFamily,
  previewSize,
  previewText,
  previewTextCustom,
  setPreviewTextCustom,
  setCurrentFont,
}: {
  hit: Hit;
  fontFamily: string;
  previewSize: number;
  previewText?: string;
  previewTextCustom?: string | null;
  setPreviewTextCustom: (text: string | null) => void;
  setCurrentFont: (font: Hit) => void;
}) => {
  const text =
    previewText === "Name"
      ? fontFamily
      : previewTextCustom ??
        previewTexts.find((text) => text.name === previewText)?.text ??
        "ABC123";

  useFont({
    service: TEST_WITH_GOOGLE_FONTS ? "google" : "adobe",
    fontFamily,
    weights: [400, 500, 600],
  });

  // Image previews for MyFonts
  // const fontId = "334083bed54a36d52383a3c3a928f97a";
  // const textRaw = "Test 123";
  // const fontSize = 64;
  // const foregroundColor = "000000";
  // const backgroundColor = "ffffff";

  // const text = encodeURIComponent(textRaw);
  // const myFontsImageUrl = `https://sig.monotype.com/render/101/font/${fontId}?rt=${text}&rs=${fontSize}&fg=${foregroundColor}&bg=${backgroundColor}&w=1000&ft=&tp=0&t=cw`;
  // console.log(myFontsImageUrl);

  return (
    <li className="font-family-list-item" onClick={() => setCurrentFont(hit)}>
      <input
        className="font-family-list-item__preview"
        style={{
          fontFamily: TEST_WITH_GOOGLE_FONTS ? fontFamily : `birra-2`,
          fontSize: previewSize,
        }}
        value={text}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => setPreviewTextCustom(e.target.value)}
      />
      <div className="font-family-list-item__family">{fontFamily}</div>
    </li>
  );
};

export default FontList;
