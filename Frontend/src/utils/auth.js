export const getStoredUser = () => {
  const rawUser = localStorage.getItem("user");

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem("token");

export const isAuthenticated = () => Boolean(getStoredToken());

export const hasRole = (...roles) => {
  const user = getStoredUser();
  return Boolean(user?.role && roles.includes(user.role));
};

export const setSession = ({ token, user }) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
