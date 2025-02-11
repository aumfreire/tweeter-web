import { UserNavigationPresenter, UserNavigationView } from "../../presenters/UserNavigationPresenter";
import useToastListener from "../toaster/ToastListenerHook";
import useUserInfoHook from "./UserInfoHook";
import { AuthToken, FakeData, User } from "tweeter-shared";


const userNavigationHook = () => {
    const { displayErrorMessage } = useToastListener();
    const { setDisplayedUser, currentUser, authToken } = useUserInfoHook();
    
    const view: UserNavigationView = {
      displayErrorMessage,
      setDisplayedUser
    };


    const presenter = new UserNavigationPresenter(
      view, authToken!, currentUser!.alias);
    
      const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        if (currentUser) {
          await presenter.navigateToUser(event, currentUser);
        }
      };
      return {navigateToUser};
}

export default userNavigationHook;