/** @format */
import { useState, useEffect } from "react";
import "../styles/Profile.css";
import ProfileImg from "../assets/profileImg.jpg";
import ProfileLoading from "../component/profileLoading";
import { useAuth } from "../component/AuthContext";
import { useNavigate } from "react-router-dom";
import { getFormattedDate } from "../utils/getFormattedDate";
const UserProfile = ({ setIsRoutingToHome }) => {
  const navigate = useNavigate();
  const { logout, user, loading } = useAuth();
  const [userReport, setUserReport] = useState([]);
  const [showFullText, setShowFullText] = useState(false);
  const limit = 5;
  const displayedReports = showFullText
    ? userReport
    : userReport.slice(0, limit);
  const displayReport = async () => {
    const response = await fetch(
      `http://localhost:3000/user/profile/${user.id}`
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    const filteredReports = data.filter((report) => {
      const reportDate = new Date(report.created_at);
      const currentDate = new Date();
      const diffInDays = Math.floor(
        (currentDate - reportDate) / (1000 * 60 * 60 * 24)
      );
      return diffInDays <= 7;
    });
    filteredReports.sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    setUserReport(filteredReports);
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
            setIsRoutingToHome(true);
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
                className="show-All"
              >
                {showFullText ? "Show Less" : "Show All"}
              </p>
            )}
          </div>
        ) : (
          <h2>No reports found</h2>
        )}
      </div>
      <div className="legend">
        <div
          className="activity"
          onClick={() => navigate("/Home/ReserveDetails")}
        >
          <h2>Reserve a spot</h2>
          <i className="fa-solid fa-caret-right fa-2x"></i>
        </div>
        <div
          className="activity"
          onClick={() => navigate("/Home/RouteDetails")}
        >
          <h2>Find your closest spot </h2>
          <i className="fa-solid fa-caret-right fa-2x"></i>
        </div>

        <div
          className="activity"
          onClick={() => navigate("/Home/Notifications")}
        >
          <h2>Notifications </h2>
          <i className="fa-solid fa-caret-right fa-2x"></i>
        </div>
        <div className="activity" onClick={() => navigate("/Home/Predictions")}>
          <h2>Recent analytics </h2>
          <i className="fa-solid fa-caret-right fa-2x"></i>
        </div>
      </div>
      <div className="log-out">
        <button onClick={handleLogout}>Log out </button>
      </div>
    </div>
  );
};
export default UserProfile;
