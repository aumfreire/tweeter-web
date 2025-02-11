import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserNavigationView {
  displayErrorMessage: (message: string) => void;
  setDisplayedUser: (user: User) => void;
}

export class UserNavigationPresenter {
  private view: UserNavigationView;
  private userService: UserService;
  private authToken: AuthToken;
  private alias: string;

  constructor(view: UserNavigationView, authToken: AuthToken, alias: string) {
    this.view = view;
    this.userService = new UserService();
    this.authToken = authToken;
    this.alias = alias;
  }

  private extractAlias(value: string): string {
    const index = value.indexOf("@");
    return value.substring(index);
  }

  public async navigateToUser(event: React.MouseEvent, currentUser: User) {
    event.preventDefault();

    try {
      const alias = this.extractAlias(event.target.toString());

      const user = await this.getUser(this.authToken, alias);

      if (user) {
        if (currentUser.equals(user)) {
          this.view.setDisplayedUser(currentUser);
        } else {
          this.view.setDisplayedUser(user);
        }
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
    }
  }

  public async getUser(
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> {
    try {
      return await this.userService.getUser(authToken, alias);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get user because of exception: ${error}`
      );
      return null;
    }
  }
}
