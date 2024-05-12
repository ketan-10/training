// material ui

// other libraries

// project imports
import Notifications from '../../../components/Notifications';
import UserProfile from '../../../components/UserProfile/UserProfile';

const Header = () => {
  return (
    <>
      <div className="z-[999] bg-white fixed flex justify-end w-full shadow p-3 gap-5 align-middle h-14">
        <Notifications />
        <UserProfile />
      </div>
    </>
  );
};
export default Header;
