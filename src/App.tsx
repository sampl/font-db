import { useEffect, useState } from "react";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch";

import { ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_KEY } from "../keys";
import PreviewStyles from "./PreviewStyles";
import Refinements from "./Refinements";
import FontList from "./FontList";

import { colorStyles } from "./defaults/colorStyles";
import { previewTexts } from "./defaults/previewTexts";
import Modal from "./components/Modal";

function App() {
  const searchClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_ONLY_KEY);
  const [colorStyle, setColorStyle] = useState(colorStyles[0]);
  const [welcomeModal, setWelcomeModal] = useState(false);
  const [previewText, setPreviewText] = useState(previewTexts[0].name);
  const [previewTextCustom, setPreviewTextCustom] = useState<string | null>(
    null
  );
  const [previewSize, setPreviewSize] = useState(20);

  useEffect(() => {
    document.body.dataset.colorStyle = colorStyle;
  }, [colorStyle]);

  return (
    <InstantSearch indexName="typefaces_dev" searchClient={searchClient}>
      <Modal isOpen={welcomeModal} onClose={() => setWelcomeModal(false)}>
        {/* <h3>Welcome to FontDB!</h3> */}
        {/* <iframe
          src="https://giphy.com/embed/G6sJqVpD1U4jC"
          width="480"
          height="232"
          style={{
            border: "none",
          }}
        /> */}
        <p style={{ fontSize: "1rem" }}>
          FontDB (as in “font database”) contains all available fonts from web
          hosting services like Google Fonts and Adobe Fonts, including all
          major historically significant faces. Use our powerful search, compare
          fonts, or <a href="/features">see all features -&gt;</a>.
        </p>
        <p>
          <a href="" target="_blank">
            Get involved
          </a>
          {" · "}
          <a href="" target="_blank">
            Store
          </a>
          {" · "}
          <a href="" target="_blank">
            Donate
          </a>
          {" · "}
          <a href="" target="_blank">
            Source
          </a>
          {" · "}
          <a href="" target="_blank">
            Legal
          </a>
        </p>
        <button onClick={() => setWelcomeModal(false)}>OK let's do it</button>
      </Modal>

      {/* https://www.algolia.com/doc/api-reference/widgets/refinement-list/react */}
      <div className="two-columns">
        <div className="sidebar-wrapper">
          <div>
            <h1 className="logo">
              <a href="/">FontDB</a>
            </h1>

            <Refinements />
          </div>

          <footer>
            <a href="https://algolia.com/">Search by Algolia</a>
            {" · "}
            <a href="mailto:sam@directedworks.com">Feedback</a>
            {" · "}
            <a href="https://github.com/sampl/font-db" target="_blank">
              Open source
            </a>
            {/*
                {" · "}
                <a href="https://github.com/sampl/font-db">Contribute</a>
                */}
            {" · "}
            <a href="https://github.com/sampl/font-db/blob/main/license">
              Legal
            </a>
          </footer>
        </div>

        <main>
          <header>
            <div></div>
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
          </header>

          <FontList
            previewSize={previewSize}
            previewText={previewText}
            previewTextCustom={previewTextCustom}
            setPreviewTextCustom={setPreviewTextCustom}
          />
        </main>
      </div>
    </InstantSearch>
  );
}

export default App;
