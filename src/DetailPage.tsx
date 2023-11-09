import Tabs from "./components/Tabs";
import useFont from "./hooks/useFont";

function DetailPage({ fontFamily }: { fontFamily: string }) {
  useFont({
    fontFamily,
    weights: [400, 500, 600],
  });

  return (
    <>
      <h1>{fontFamily}</h1>
      {/* ⭐️ - Add to list… */}
      <p>Lorem ipsum description goes here.</p>
      <p>
        <a href="">Foundry link</a> · Designed by <a href="">Jane Doe</a>,{" "}
        <a href="">Karl Lagerfeld</a>
      </p>

      <div style={{ columns: 2 }}>
        <p>Embed:</p>
        <ul>
          <li>
            <a href="">Google Fonts →</a>
          </li>
          <li>
            <a href="">Adobe Fonts →</a>
          </li>
          <li>
            <a href="">Fontshare →</a>
          </li>
        </ul>

        <p>Purchase:</p>
        <ul>
          <li>
            <a href="">Myfonts →</a>
          </li>
          <li>
            <a href="">Klim (foundry site) →</a>
          </li>
        </ul>

        <p>
          {/* [Historically significant] */}
          <a href="">View on Wikipedia →</a>
        </p>

        <p>View on:</p>
        <ul>
          <li>
            <a href="">Typewolf →</a>
          </li>
          <li>
            <a href="">Fonts In Use →</a>
          </li>
          <li>
            <a href="">MyFonts →</a>
          </li>
        </ul>

        <p>Source:</p>

        <ul>
          <li>
            <a href="">github.com/rsms/inter</a>
          </li>
          <li>
            <a href="">github.com/google/fonts/tree/…</a>
          </li>
        </ul>

        <p>
          <a href="">Report a problem</a>
          {/*
        Just an idea...
        Love this font? <a href="">Order a poster print</a>
        */}
        </p>
      </div>

      <br />

      <Tabs
        label="Preview type"
        items={[
          {
            id: "samples",
            name: "Samples",
            content: (
              <div style={{ fontSize: "3rem", fontFamily }}>
                The quick brown fox jumps over the lazy dog.
              </div>
            ),
          },
          {
            id: "glyphs",
            name: "Glyphs",
            content: (
              <div style={{ fontFamily }}>
                <div className="glyph-samples">
                  <div>A</div>
                  <div>B</div>
                  <div>C</div>
                  <div>D</div>
                  <div>E</div>
                  <div>F</div>
                  <div>G</div>
                  <div>H</div>
                  <div>I</div>
                  <div>J</div>
                  <div>K</div>
                  <div>L</div>
                  <div>M</div>
                  <div>N</div>
                  <div>O</div>
                  <div>P</div>
                  <div>Q</div>
                  <div>R</div>
                  <div>S</div>
                  <div>T</div>
                  <div>U</div>
                  <div>V</div>
                  <div>W</div>
                  <div>X</div>
                  <div>Y</div>
                  <div>Z</div>
                </div>
                <div className="glyph-samples">
                  <div>a</div>
                  <div>b</div>
                  <div>c</div>
                  <div>d</div>
                  <div>e</div>
                  <div>f</div>
                  <div>g</div>
                  <div>h</div>
                  <div>i</div>
                  <div>j</div>
                  <div>k</div>
                  <div>l</div>
                  <div>m</div>
                  <div>n</div>
                  <div>o</div>
                  <div>p</div>
                  <div>q</div>
                  <div>r</div>
                  <div>s</div>
                  <div>t</div>
                  <div>u</div>
                  <div>v</div>
                  <div>w</div>
                  <div>x</div>
                  <div>y</div>
                  <div>z</div>
                </div>
                <div className="glyph-samples">
                  <div>0</div>
                  <div>1</div>
                  <div>2</div>
                  <div>3</div>
                  <div>4</div>
                  <div>5</div>
                  <div>6</div>
                  <div>7</div>
                  <div>8</div>
                  <div>9</div>
                </div>
                <div className="glyph-samples">
                  <div>!</div>
                  <div>?</div>
                  <div>.</div>
                  <div>,</div>
                  <div>:</div>
                  <div>;</div>
                  <div>&amp;</div>
                  <div>$</div>
                  <div>#</div>
                  <div>%</div>
                  <div>*</div>
                  <div>(</div>
                  <div>)</div>
                  <div>[</div>
                  <div>]</div>
                  <div>{"{"}</div>
                  <div>{"}"}</div>
                  <div>&lt;</div>
                  <div>&gt;</div>
                  <div>/</div>
                  <div>\</div>
                  <div>|</div>
                  <div>-</div>
                  <div>_</div>
                  <div>=</div>
                  <div>+</div>
                  <div>~</div>
                  <div>`</div>
                  <div>^</div>
                  <div>@</div>
                  <div>‘</div>
                  <div>’</div>
                  <div>“</div>
                  <div>”</div>
                  <div>«</div>
                  <div>»</div>
                  <div>„</div>
                  <div>…</div>
                  <div>§</div>
                  <div>©</div>
                  <div>®</div>
                  <div>™</div>
                  <div>°</div>
                  <div>¹</div>
                  <div>²</div>
                  <div>³</div>
                  <div>¼</div>
                  <div>½</div>
                  <div>¾</div>
                  <div>×</div>
                  <div>÷</div>
                  <div>¢</div>
                  <div>€</div>
                  <div>£</div>
                  <div>¥</div>
                  <div>₩</div>
                  <div>₹</div>
                  <div>₽</div>
                  <div>₿</div>
                  <div>⁰</div>
                  <div>¹</div>
                  <div>²</div>
                  <div>³</div>
                  <div>⁴</div>
                  <div>⁵</div>
                  <div>⁶</div>
                  <div>⁷</div>
                  <div>⁸</div>
                  <div>⁹</div>
                </div>
              </div>
            ),
          },
          {
            id: "test",
            name: "Test",
            content: "coming soon",
          },
        ]}
      />
    </>
  );
}

export default DetailPage;
