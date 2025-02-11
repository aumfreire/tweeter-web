import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface LoginView {
  displayErrorMessage: (message: string) => void;
  navigateTo: (url: string) => void;
  setLoading: (isLoading: boolean) => void;
  updateUserInfo: (
    user: User,
    authToken: AuthToken,
    rememberMe: boolean
  ) => void;
}

export class LoginPresenter {
    private view: LoginView;
    private userService: UserService;

    constructor(view: LoginView) {
        this.view = view;
        this.userService = new UserService();
    }

    public async doLogin(alias: string, password: string, rememberMe: boolean, originalUrl?: string) {
        this.view.setLoading(true);
        try {
            const [user, authToken] =await this.userService.login(alias, password);
            this.view.updateUserInfo(user, authToken, rememberMe);
            this.view.navigateTo(originalUrl || "/");
        } catch (error) {
            this.view.displayErrorMessage(
              `Failed to log user in because of exception: ${error}`
            );
        }finally {
            this.view.setLoading(false);
        }
    }
}
