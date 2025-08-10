import { AppModalCtrl } from "../component/AppModal/AppModalCtrl";
import { Ctrl } from "../lib/SpoonKit/controller/Ctrl";
import { provide } from "../lib/SpoonKit/providers";
import { state } from "../lib/SpoonKit/signals/State";
import { LocationProvider } from "../providers/LocationProvider/LocationProvider";
import { Navigate } from "../providers/Navigate/Navigate";
import { AuthService } from "../services/AuthService";
import { ModalService } from "../services/ModalService";

export class RootLayoutCtrl extends Ctrl {
  modalService: ModalService = provide(ModalService);
  currentModal = state<AppModalCtrl>();

  private authService: AuthService = provide(AuthService);
  private navigate: Navigate = provide(Navigate);
  public location: LocationProvider = provide(LocationProvider);

  public isLoading = state(false);

  public menuItems = state([
    {
      title: "Oportunidades y programas",
      icon: "ri-stack-fill",
      path: "/opportunities",
      isMenuItem: true,
      submenu: [
        {
          title: "Gestión oportunidad",
          path: "/opportunities",
        },
      ],
    },
    {
      title: "Gestión de usuarios",
      icon: "ri-settings-3-fill",
      path: "/users",
      isMenuItem: true,
    },
  ]);

  public navigateTo(path: string) {
    this.navigate(path);
  }

  async logout() {
    this.isLoading.set(true);

    try {
      await this.authService.logout();
    } catch (error) {
      // TODO: Manage error
    }

    this.isLoading.set(false);
  }

  ctrlStart() {
    this.modalService.onOpenModal((modal) => {
      this.currentModal.set(null);
      setTimeout(() => this.currentModal.set(modal), 5);
    });
  }
}
