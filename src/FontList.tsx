import { useState } from "react";
import { useInfiniteHits } from "react-instantsearch";

import { previewTexts } from "./defaults/previewTexts";
import type { Hit } from "../types/types";
import Modal from "./components/Modal";
import DetailPage from "./DetailPage";
import useFont from "./hooks/useFont";

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
    fontFamily,
    weights: [400, 500, 600],
  });

  return (
    <li className="font-family-list-item" onClick={() => setCurrentFont(hit)}>
      <input
        className="font-family-list-item__preview"
        style={{
          fontFamily,
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
