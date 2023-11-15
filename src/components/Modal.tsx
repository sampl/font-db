import * as RadixModal from "@radix-ui/react-dialog";

export default function Modal({
  isOpen,
  onClose,
  style = "dialog",
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  style?: "sideSheet" | "dialog";
  children: React.ReactNode;
}) {
  return (
    <RadixModal.Root open={isOpen} onOpenChange={onClose}>
      <RadixModal.Portal>
        <RadixModal.Overlay className="modal__overlay" onClick={onClose} />
        <RadixModal.Content
          className={`modal__content ${
            style === "sideSheet"
              ? "modal__content--sideSheet"
              : "modal__content--dialog"
          }`}
        >
          <button
            className="modal__close"
            onClick={onClose}
            style={{
              padding: style === "sideSheet" ? "2rem" : "1rem",
            }}
          >
            {style === "sideSheet" ? "close" : "×"}
          </button>
          {children}
        </RadixModal.Content>
      </RadixModal.Portal>
    </RadixModal.Root>
  );
}
