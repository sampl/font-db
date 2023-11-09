import { useEffect, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";

import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_KEY } from "../keys";
import PreviewStyles from "./PreviewStyles";
import Refinements from "./Refinements";
import FontList from "./FontList";

import { colorStyles } from "./defaults/colorStyles";
import { previewTexts } from "./defaults/previewTexts";

function App() {
  const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_KEY);
  const [colorStyle, setColorStyle] = useState(colorStyles[0]);
  const [previewText, setPreviewText] = useState(previewTexts[0].name);
  const [previewTextCustom, setPreviewTextCustom] = useState<string | null>(
    null
  );
  const [previewSize, setPreviewSize] = useState(20);

  useEffect(() => {
    document.body.dataset.colorStyle = colorStyle;
  }, [colorStyle]);

  return (
    <>
      <header>
        <h1 className="logo">
          <a href="/">FontDB</a>
        </h1>
        <div>
          <PreviewStyles
            previewText={previewText}
            previewSize={previewSize}
            colorStyle={colorStyle}
            setPreviewText={setPreviewText}
            setPreviewSize={setPreviewSize}
            setColorStyle={setColorStyle}
            previewTextCustom={previewTextCustom}
            setPreviewTextCustom={setPreviewTextCustom}
          />
        </div>
      </header>
      <main>
        {/* https://www.algolia.com/doc/api-reference/widgets/refinement-list/react */}
        <InstantSearch indexName="typefaces_dev" searchClient={searchClient}>
          <div className="two-columns">
            <div>
              <Refinements />
            </div>
            <div>
              <FontList
                previewSize={previewSize}
                previewText={previewText}
                previewTextCustom={previewTextCustom}
                setPreviewTextCustom={setPreviewTextCustom}
              />
            </div>
          </div>
        </InstantSearch>
      </main>
    </>
  );
}

export default App;
