import { useState } from "react";
import { useInfiniteHits } from "react-instantsearch";

import { previewTexts } from "./defaults/previewTexts";
import type { Hit } from "../types/types";
import Modal from "./components/Modal";
import DetailPage from "./DetailPage";

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
        {hits.map((hit: Hit) => {
          const text =
            previewText === "Name"
              ? hit.name
              : previewTextCustom ??
                previewTexts.find((text) => text.name === previewText)?.text ??
                "ABC123";

          return (
            <li
              key={hit.objectID}
              className="font-family-list-item"
              onClick={() => setCurrentFont(hit)}
            >
              <input
                className="font-family-list-item__preview"
                style={{
                  fontSize: previewSize,
                }}
                value={text}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setPreviewTextCustom(e.target.value)}
              />
              <div className="font-family-list-item__family">{hit.name}</div>
            </li>
          );
        })}
      </ol>
      <button onClick={showMore} disabled={isLastPage}>
        Show more results
      </button>
    </div>
  );
};

export default FontList;
