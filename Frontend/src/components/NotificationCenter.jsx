import React, { useEffect, useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { NOTIFICATIONS_API_URL, NOTIFICATIONS_STREAM_URL } from "../config/api";
import { getStoredToken, hasRole } from "../utils/auth";

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const token = getStoredToken();
  const isPassenger = hasRole("user");
  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  useEffect(() => {
    if (!token || !isPassenger) {
      setNotifications([]);
      return undefined;
    }

    const loadNotifications = async () => {
      const response = await fetch(NOTIFICATIONS_API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setNotifications(data.notifications || []);
    };

    loadNotifications().catch(() => setNotifications([]));

    const source = new EventSource(
      `${NOTIFICATIONS_STREAM_URL}?token=${encodeURIComponent(token)}`
    );

    source.addEventListener("notificationSnapshot", (event) => {
      setNotifications(JSON.parse(event.data));
    });

    source.addEventListener("notification", (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((current) => [
        notification,
        ...current.filter((item) => item.id !== notification.id)
      ].slice(0, 20));
    });

    return () => source.close();
  }, [token, isPassenger]);

  const markRead = async () => {
    if (!token) return;

    setNotifications((current) =>
      current.map((notification) => ({ ...notification, read: true }))
    );

    await fetch(`${NOTIFICATIONS_API_URL}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    }).catch(() => {});
  };

  if (!isPassenger) {
    return null;
  }

  return (
    <div className="notification-center">
      <button
        className="notification-trigger"
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
        aria-expanded={isOpen}
      >
        <Bell size={18} />
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notification-panel" role="status" aria-live="polite">
          <div className="notification-header">
            <strong>Notifications</strong>
            <button type="button" onClick={markRead}>
              <CheckCheck size={16} />
              Mark read
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <p>No service updates yet.</p>
            ) : (
              notifications.map((notification) => (
                <article
                  key={notification.id}
                  className={`notification-item ${notification.read ? "read" : "unread"}`}
                >
                  <strong>{notification.title}</strong>
                  <span>{notification.message}</span>
                  <small>{new Date(notification.createdAt).toLocaleString()}</small>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
