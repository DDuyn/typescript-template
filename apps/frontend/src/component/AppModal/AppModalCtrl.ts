import { Ctrl } from "../../lib/SpoonKit/controller/Ctrl";
import { provide } from "../../lib/SpoonKit/providers";
import { emitter } from "../../lib/SpoonKit/signals/Emitter";
import { state } from "../../lib/SpoonKit/signals/State";
import { ModalService } from "../../services/ModalService";

export class AppModalCtrl extends Ctrl {
  modalService: ModalService = provide(ModalService);

  title = state<string>();
  open = state<boolean>(false);
  fullWidth = state<boolean>(true);
  maxWidth = state<"xs" | "sm" | "md" | "lg" | "xl">("sm");
  fullScreen = state<boolean>(false);
  hideBackdrop = state<boolean>(false);
  disableEscapeKeyDown = state<boolean>(false);
  disablePortal = state<boolean>(false);

  onClose = emitter<void>();
  onOpen = emitter<void>();

  public openModal() {
    this.modalService.openModal(this);
  }

  public close() {
    this.open.set(false);
    this.onClose.next();
  }

  public show() {
    this.open.set(true);
    this.onOpen.next();
  }
}
