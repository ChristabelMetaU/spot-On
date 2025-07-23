/** @format */
/** @format */
import { useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import "../styles/Notifications.css";
import { useNavigate } from "react-router-dom";
const Notifications = ({ setIsRoutingToHome }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    //fetch notifications
    const fetchNotifications = async () => {
      const response = await fetch(
        `http://localhost:3000/notifications/${user.id}`
      );
      const data = await response.json();
      if (data) {
        setNotifications(data);
      } else {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, []);
  const handleNotificationUpdate = async (notification) => {
    const response = await fetch(`http://localhost:3000/notifications/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        isRead: true,
        id: notification.id,
        userId: user.id,
      }),
    });
    const data = await response.json();
    if (data) {
      const dataIds = data.map((item) => item.id);
      const newNotifications = notifications.filter(
        (notification) => !dataIds.includes(notification.id)
      );
    } else {
      throw new Error("Failed to update notification");
    }
  };
  return (
    <>
      <div className="route-header">
        <div
          className="header-icon"
          onClick={() => {
            setIsRoutingToHome(true);
            navigate("/");
          }}
        >
          <i className="fa fa-arrow-left fa-2x go-back" aria-hidden="true"></i>
        </div>
        <div className="header-text">
          <p>Reminders</p>
          <i className="fa fa-bell" aria-hidden="true"></i>
        </div>
      </div>

      <div className="notification-page">
        <h2 className="page-title">Notifications</h2>
        <div className="notification-list">
          {notifications.length === 0 ? (
            <p className="empty-messgae">
              You have no recent notificaationsszzzz
            </p>
          ) : (
            notifications.map((notification) => (
              <div className="notification-card" key={notification.id}>
                <div className="notification-header">
                  <h4>Occupied spot reminder</h4>
                  <span>
                    {new Date(notification.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p>{notification.message}</p>
                <button onClick={() => handleNotificationUpdate(notification)}>
                  Close
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
