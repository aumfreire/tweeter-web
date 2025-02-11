import { AuthToken } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LogoutView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setLoading: (isLoading: boolean) => void;
  clearUserInfo: () => void;
}

export class LogoutPresenter {
  private view: LogoutView;
  private userService: UserService;

  constructor(view: LogoutView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async doLogout(authToken: AuthToken) {
    this.view.setLoading(true);

    try {
      this.view.displayInfoMessage("Logging Out...", 0);

      await this.userService.logout(authToken);

      this.view.clearLastInfoMessage();
      this.view.clearUserInfo();
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to log user out because of exception: ${error}`
      );
    } finally {
      this.view.setLoading(false);
    }
  }
}
