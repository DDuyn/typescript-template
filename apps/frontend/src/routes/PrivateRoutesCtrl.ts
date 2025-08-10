import { Ctrl } from "@lib/SpoonKit/controller/Ctrl";
import { provide } from "@lib/SpoonKit/providers";
import { state } from "@lib/SpoonKit/signals/State";
import { AuthService } from "@services/AuthService";

export class PrivateRoutesCtrl extends Ctrl {
  private authService = provide(AuthService);

  authInProgress = state<boolean>(true);

  async ctrlStart() {
    this.authInProgress.set(true);

    if (!this.authService.isAuthenticated()) {
      await this.authService.auth();
    }

    this.authInProgress.set(false);
  }
}
