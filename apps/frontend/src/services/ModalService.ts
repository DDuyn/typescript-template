import type { AppModalCtrl } from "@component/AppModal/AppModalCtrl";

export class ModalService {
  openModalCb: ((modal: AppModalCtrl) => void) | null = null;

  public openModal(modal: AppModalCtrl) {
    modal.open.set(true);
    this.openModalCb?.(modal);
  }

  onOpenModal(cb: (modal: AppModalCtrl) => void): () => void {
    this.openModalCb = cb;

    return () => {
      this.openModalCb = null;
    };
  }
}
