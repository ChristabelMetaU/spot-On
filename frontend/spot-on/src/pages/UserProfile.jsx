/** @format */
import { useNavigate } from "react-router-dom";
const UserProfile = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="profile">
      <i class="fa fa-arrow-left" aria-hidden="true"></i>
      <button
        onClick={() => {
          navigate("/");
        }}
      >
        X
      </button>
      <h1>{user.username}</h1>
      <p>{user.email}</p>
      <div className="profile__stats">Recent Activity</div>
      <div>Legends</div>
      <div>
        <button>Log out </button>
      </div>
    </div>
  );
};
export default UserProfile;
