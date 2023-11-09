import * as RadixModal from "@radix-ui/react-dialog";

export default function Modal({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <RadixModal.Root open={isOpen} onOpenChange={onClose}>
      <RadixModal.Portal>
        <RadixModal.Overlay className="modal__overlay" onClick={onClose} />
        <RadixModal.Content className="modal__content">
          <button className="modal__close" onClick={onClose}>
            close
          </button>
          {children}
        </RadixModal.Content>
      </RadixModal.Portal>
    </RadixModal.Root>
  );
}
