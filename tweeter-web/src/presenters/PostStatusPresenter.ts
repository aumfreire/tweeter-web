import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface PostStatusView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setLoading: (isLoading: boolean) => void;
  clearPost: () => void;
}

export class PostStatusPresenter {
  private view: PostStatusView;
  private userService: UserService;

  constructor(view: PostStatusView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async postStatus(
    authToken: AuthToken,
    post: string,
    currentUser: User
  ) {
    this.view.setLoading(true);
    try {
      this.view.displayInfoMessage("Posting status...", 0);

      const status = new Status(post, currentUser, Date.now());

      await this.userService.postStatus(authToken, status);

      this.view.clearPost();
      this.view.displayInfoMessage("Status posted!", 2000);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to post the status because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setLoading(false);
    }
  }
}
