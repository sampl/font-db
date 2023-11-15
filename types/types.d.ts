import { BaseHit } from "instantsearch.js/es/types";
import { superFamilies } from "../scripts/util/superFamilies";

export type AdobeFontFamily = {
  id: string;
  name: string;
  slug: string;
  web_link: string;
  browse_info: {
    capitals: string; // eg "uppercase-lowercase"
    classification: string; // eg "slab-serif"
    contrast: string; // eg "regular"
    language: string[]; // eg "ca", "cs", etc
    number_style: string; // eg "lowercase"
    recommended_for: string[]; // eg "paragraphs"
    weight: string[]; // eg "heavy", "regular"
    width: string; // eg "regular"
    x_height: string[]; // eg "high"
  };
  css_stack: string;
  description: string;
  foundry: {
    name: string;
    slug: string;
  };
  libraries: {
    id: string;
    name: string;
  }[];
  variations: {
    id: string; // eg "gjst:n3"
    link: string; // eg "/api/v1/json/families/gjst/n3"
    name: string; // eg "Abril Text Light"
    fvd: string; // eg "n4"
  }[];
};

export type GoogleFontFamily = {
  family: string; // eg "Anonymous Pro",
  variants: string[]; // eg ["regular", "italic", "700", "700italic"],
  subsets: string[]; // eg ["cyrillic", "greek", "latin", "latin-ext"],
  version: string; // eg "v21",
  lastModified: string; // eg "2022-09-22",
  category: string; // eg "monospace",
  kind: string; // eg "webfonts#webfont",
  menu: string; // eg "http://fonts.gstatic.com/s/anonymouspro/v21/rP2Bp2a15UIB7Un-bOeISG3pHl028A.ttf",
  files: {
    [key: string]: string; // eg "700italic": "http://fonts.gstatic.com/s/anonymouspro/v21/rP2Bp2a15UIB7Un-bOeISG3pLlw89CH98Ko.ttf",
  };
  axes?: [
    // @cspell:ignore capaibility
    // variable fonts only, when requesting with capaibility=VF (sic)
    {
      tag: "wdth";
      start: 62.5;
      end: 100;
    }
  ];
};

export type FontshareData = {
  slug: string;
  name: string;
  designers: string;
  category: string;
  version: string;
  fontshareDebut: string;
  tags: string;
  license: string;
  supportedLanguages: string;
  availableStyles: string;
};

// WIP
export type FontFamily = {
  // services
  googleFontsFamily?: string;
  adobeFontsSlug?: string;
  adobeFontsId?: string;
  fontShareSlug?: string;

  // ids
  id: string;
  name: string;
  slug: string;

  // info
  description?: string;
  foundryName?: string;
  // designersNames?: string[];

  // can only be one of the strings in array superFamilies
  superFamily?: (typeof superFamilies)[number];

  // attributes
  contrast?: "low" | "medium" | "high";
  // weights?: string[];
  // variations?: string[];
  // type?:
  //   | "script"
  //   | "handwritten"
  //   | "serif"
  //   | "sans-serif"
  //   | "display"
  //   | "monospace"
  //   | "symbol";
  // tags?:
  //   | "geometric"
  //   | "rational"
  //   | "humanist"
  //   | "rounded"
  //   | "blackletter"
  //   | "rounded"
  //   | "grotesk"
  //   | "retro"
  //   | "spooky"
  //   | "holiday"
  //   | "country"
  //   | "";
  // license?: "open source" | "closed source";
  // family?: "clarendon" | "baskerville";

  // supports
  // languages?: string[];
  // scripts?: string[];

  // usage
  hosted?: boolean;
  freeToUse?: boolean;

  // stats
  // popularity?: number;
  // trending?: number;
  // lastModified?: string;
  // dateAdded?: string;
  // dateModified?: string;
  // dateReleased?: string;
};

export type Hit = BaseHit & FontFamily & { objectID: string };
