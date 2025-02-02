import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import userInfoHook from "../userInfo/UserInfoHook";

interface Props {
  item: Status;
}

const Story = (props: Props) => {
  const { displayErrorMessage } = useToastListener();

  const { setDisplayedUser, currentUser, authToken } = userInfoHook();

  const getUser = async (
    authToken: AuthToken,
    alias: string
  ): Promise<User | null> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.findUserByAlias(alias);
  };

  const extractAlias = (value: string): string => {
    const index = value.indexOf("@");
    return value.substring(index);
  };

  const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
    event.preventDefault();

    try {
      const alias = extractAlias(event.target.toString());

      const user = await getUser(authToken!, alias);

      if (!!user) {
        if (currentUser!.equals(user)) {
          setDisplayedUser(currentUser!);
        } else {
          setDisplayedUser(user);
        }
      }
    } catch (error) {
      displayErrorMessage(`Failed to get user because of exception: ${error}`);
    }
  };

  return (
    <>
      <h2>
        <b>
          {props.item.user.firstName} {props.item.user.lastName}
        </b>{" "}
        -{" "}
        <Link
          to={props.item.user.alias}
          onClick={(event) => navigateToUser(event)}
        >
          {props.item.user.alias}
        </Link>
      </h2>
      {props.item.formattedDate}
      <br />
    </>
  );
};

export default Story;
