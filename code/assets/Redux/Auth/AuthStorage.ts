import * as Cookies from 'js-cookie';

export const getResponseFromLocalStorage = () => {
  const response = localStorage.getItem('auth_response');
  return response ? JSON.parse(response) : null;
};

export const removeAuthFromLocalStorage = () => {
  localStorage.removeItem('auth_response');
  Cookies.remove('token');
};

export const storeAuthInLocalStorage = (response: any) => {
  localStorage.setItem('auth_response', JSON.stringify(response));
  Cookies.remove('token');
  Cookies.set('token', response.tokenId, {path: '/'});
};