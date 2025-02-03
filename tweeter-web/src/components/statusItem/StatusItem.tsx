import { Link } from "react-router-dom";
import useToastListener from "../toaster/ToastListenerHook";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import useUserInfoHook from "../userInfo/UserInfoHook";
import userNavigationHook from "../userInfo/UserNavigationHook";

interface Props {
  item: Status;
}

const StatusItem = (props: Props) => {
  const { navigateToUser } = userNavigationHook();

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

export default StatusItem;
