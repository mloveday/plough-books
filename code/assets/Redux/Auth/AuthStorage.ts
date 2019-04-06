export const getResponseFromLocalStorage = () => {
  const response = localStorage.getItem('auth_response');
  return response ? JSON.parse(response) : null;
};

export const removeAuthFromLocalStorage = () => {
  localStorage.removeItem('auth_response');
};

export const storeAuthInLocalStorage = (response: any) => {
  localStorage.setItem('auth_response', JSON.stringify(response));
};

export const getAuthTokenFromLocalStorage = () => {
  return getResponseFromLocalStorage().tokenId;
};