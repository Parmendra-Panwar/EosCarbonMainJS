import Modal from "../ui/Modal";
import Button from "../ui/Button";

export default function ConfirmModal({
  open,
  title,
  onConfirm,
  onClose,
}: any) {
  return (
    <Modal open={open} onClose={onClose}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirm
        </Button>
      </div>
    </Modal>
  );
}
