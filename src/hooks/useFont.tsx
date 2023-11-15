import { useEffect, useState } from "react";

export default function useFont({
  service,
  fontFamily,
  weights,
}: {
  service?: "google" | "adobe" | "fontshare";
  fontFamily?: string;
  weights: number[];
}) {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (fontLoaded) return;
    if (service !== "google") return;
    console.log("loading google", fontFamily);
    // TODO - look for this tag having been added elsewhere
    // and don't load if we already have it?
    if (!fontFamily) return;
    const link = document.createElement("link");
    const familyNameQuery = fontFamily.replace(/ /g, "+");
    const weightsQuery = weights.join(";");
    const fontFamilyQuery = `family=${familyNameQuery}:wght@${weightsQuery}`;
    link.href = `https://fonts.googleapis.com/css2?${fontFamilyQuery}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setFontLoaded(true);
  }, [fontFamily, fontLoaded, weights, service]);

  useEffect(() => {
    if (fontLoaded) return;
    if (service !== "adobe") return;
    return;

    // Just applied for access, we'll see
    // https://github.com/typekit/fonts-api-docs/blob/master/api-reference/web_font_preview_api.md
    // TODO - how to make a font preview component that doesn't load the font unless it hasn't already been loaded

    console.log("loading adobe", fontFamily);
    const link = document.createElement("link");
    link.href = `https://use.typekit.net/${fontFamily}.css`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setFontLoaded(true);
  }, [fontFamily, fontLoaded, weights, service]);

  useEffect(() => {
    if (fontLoaded) return;
    if (service !== "fontshare") return;
    console.log("loading fontshare", fontFamily);
    const link = document.createElement("link");
    const weight = 200;
    link.href = `https://api.fontshare.com/v2/css?f[]=${fontFamily}@${weight}&display=swap`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setFontLoaded(true);
  }, [fontFamily, fontLoaded, weights, service]);

  return !service ? true : !fontFamily ? true : fontLoaded;
}
