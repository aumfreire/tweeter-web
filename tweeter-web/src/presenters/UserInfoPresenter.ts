import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model/service/UserService";

export interface UserInfoView {
  displayErrorMessage: (message: string) => void;
  displayInfoMessage: (message: string, duration: number) => void;
  clearLastInfoMessage: () => void;
  setLoading: (isLoading: boolean) => void;
  setIsFollower: (isFollower: boolean) => void;
  setFolloweeCount: (count: number) => void;
  setFollowerCount: (count: number) => void;
}

export class UserInfoPresenter {
  private view: UserInfoView;
  private userService: UserService;

  constructor(view: UserInfoView) {
    this.view = view;
    this.userService = new UserService();
  }

  public async setIsFollowerStatus(
    authToken: AuthToken,
    currentUser: User,
    displayedUser: User
  ) {
    try {
      if (currentUser === displayedUser) {
        this.view.setIsFollower(false);
      } else {
        const isFollower = await this.userService.getIsFollowerStatus(
          authToken,
          currentUser,
          displayedUser
        );
        this.view.setIsFollower(isFollower);
      }
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to determine follower status because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowees(authToken: AuthToken, displayedUser: User) {
    try {
      const count = await this.userService.getFolloweeCount(
        authToken,
        displayedUser
      );
      this.view.setFolloweeCount(count);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followees count because of exception: ${error}`
      );
    }
  }

  public async setNumbFollowers(authToken: AuthToken, displayedUser: User) {
    try {
      const count = await this.userService.getFollowerCount(
        authToken,
        displayedUser
      );
      this.view.setFollowerCount(count);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to get followers count because of exception: ${error}`
      );
    }
  }

  public async followDisplayedUser(authToken: AuthToken, displayedUser: User) {
    try {
      this.view.setLoading(true);
      this.view.displayInfoMessage(`Following ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.follow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(true);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to follow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setLoading(false);
    }
  }

  public async unfollowDisplayedUser(
    authToken: AuthToken,
    displayedUser: User
  ) {
    try {
      this.view.setLoading(true);
      this.view.displayInfoMessage(`Unfollowing ${displayedUser.name}...`, 0);

      const [followerCount, followeeCount] = await this.userService.unfollow(
        authToken,
        displayedUser
      );

      this.view.setIsFollower(false);
      this.view.setFollowerCount(followerCount);
      this.view.setFolloweeCount(followeeCount);
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to unfollow user because of exception: ${error}`
      );
    } finally {
      this.view.clearLastInfoMessage();
      this.view.setLoading(false);
    }
  }
}
