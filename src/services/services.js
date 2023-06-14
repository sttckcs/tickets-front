import axios from 'axios'

export function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export const APIHeaders = {
    'Accept' : 'application/json',
    'Content-Type' : 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Authorization' : {
        toString () {
            return `Bearer ${getCookie('token')}`
        }
    } 
};

export const API = axios.create({
    baseURL : 'http://localhost:3001',
    withCredentials: true,
    timeout: 6000,
    headers : APIHeaders
});
