import { useEffect, useState } from "react";

// TODO - not just google fonts
export default function useFont({
  service,
  fontFamily,
  weights,
}: {
  service: "google" | "adobe";
  fontFamily: string;
  weights: number[];
}) {
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (fontLoaded) return;
    if (service !== "google") return;
    // TODO - look for this tag having been added elsewhere
    // and don't load if we already have it?
    const link = document.createElement("link");
    const familyName = fontFamily;
    const familyNameQuery = familyName.replace(/ /g, "+");
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
    const link = document.createElement("link");
    const familySlug = "plm1izr";
    link.href = `https://use.typekit.net/${familySlug}.css`;
    link.rel = "stylesheet";
    document.head.appendChild(link);
    setFontLoaded(true);
  }, [fontFamily, fontLoaded, weights, service]);

  return fontLoaded;
}
