/** @format */
import { useState, useEffect } from "react";
import "../styles/Profile.css";
import ProfileImg from "../assets/profileImg.jpg";
import ProfileLoading from "../component/profileLoading";
import { useAuth } from "../component/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
const UserProfile = () => {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  const [userReport, setUserReport] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const limit = 5;
  const displayedReports = showFullText
    ? userReport
    : userReport.slice(0, limit);
  const getFormattedDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const now = new Date();
    const diffrenceInms = now.getTime() - date.getTime();
    const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    if (diffrenceInms < oneWeekInMs) {
      return `${formatDistanceToNow(date, { addSuffix: true })}`;
    } else {
      return `on ${`format(date, 'do MMMM, yyyy')`}`;
    }
  };
  const displayReport = async () => {
    const response = await fetch(
      `http://localhost:3000/user/profile/${user.id}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    setUserReport(data);
  };
  useEffect(() => {
    displayReport();
  }, [user.id]);
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };
  return (
    <div className="profile">
      <div className="profile-head">
        <i
          className="fa fa-arrow-left fa-2x go-back"
          aria-hidden="true"
          onClick={() => {
            navigate("/");
          }}
        ></i>
        <div className="profile-user">
          {loading ? (
            <ProfileLoading />
          ) : (
            <div className="profie-picture">
              <img src={ProfileImg} alt="profile-img" />
            </div>
          )}

          <div className="user-info">
            <h1>{user.username}</h1>
            <p>{user.email}</p>
            <p className="role">{user.role}</p>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        <p>Recent activity</p>
        {userReport.length > 0 ? (
          <div>
            {displayedReports.map((report) => (
              <div className="profile-report" key={report.id}>
                <h2>{report.spot_name}</h2>
                <p>{report.lottype}</p>
                <p>
                  {report.description.length == 0
                    ? "No additional Info"
                    : report.description}
                </p>
                <p>{getFormattedDate(report.created_at)}</p>
              </div>
            ))}
            {userReport.length > limit && (
              <p
                onClick={() => setShowFullText(!showFullText)}
                className="show-more"
              >
                {showFullText ? "Show Less" : "Show More"}
              </p>
            )}
          </div>
        ) : (
          <h2>No reports found</h2>
        )}
      </div>
      <div className="legend">
        <h2>No legends yet</h2>
      </div>
      <div className="log-out">
        <button onClick={handleLogout}>Log out </button>
      </div>
    </div>
  );
};
export default UserProfile;
