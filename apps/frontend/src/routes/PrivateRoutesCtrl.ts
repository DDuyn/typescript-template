import { Ctrl } from "@lib/SpoonKit/controller/Ctrl";
import { state } from "@lib/SpoonKit/signals/State";

export class PrivateRoutesCtrl extends Ctrl {
  authInProgress = state<boolean>(false);

  /*private authService = provide(AuthService);


  async ctrlStart() {
    this.authInProgress.set(true);

    if (!this.authService.isAuthenticated()) {
      await this.authService.auth();
    }

    this.authInProgress.set(false);
  }*/
}
