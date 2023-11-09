import { colorStyles } from "./defaults/colorStyles";
import { previewTexts } from "./defaults/previewTexts";

function PreviewStyles({
  previewText,
  previewSize,
  colorStyle,
  setPreviewText,
  setPreviewSize,
  setColorStyle,
  previewTextCustom,
  setPreviewTextCustom,
}: {
  previewText: string;
  previewSize: number;
  colorStyle: string;
  setPreviewText: (value: string) => void;
  setPreviewSize: (value: number) => void;
  setColorStyle: (value: string) => void;
  previewTextCustom: string | null;
  setPreviewTextCustom: (value: string | null) => void;
}) {
  return (
    <div className="preview-styles">
      <input
        type="range"
        onChange={(e) => setPreviewSize(parseInt(e.target.value))}
        min="8"
        max="500"
        value={previewSize}
      />
      <select
        disabled={previewTextCustom !== null}
        value={previewTextCustom ? "Custom" : previewText}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setPreviewText(event.target.value);
        }}
      >
        {previewTexts.map(({ name }) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      {previewTextCustom && (
        <button onClick={() => setPreviewTextCustom(null)}>Reset</button>
      )}
      <select
        value={colorStyle}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
          setColorStyle(event.target.value);
        }}
      >
        {colorStyles.map((colorStyle) => (
          <option key={colorStyle} value={colorStyle}>
            {colorStyle}
          </option>
        ))}
      </select>
    </div>
  );
}

export default PreviewStyles;
