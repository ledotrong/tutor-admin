import axios from 'axios';
import { api_url } from '../core/constants';

export function callApiLogin(body) {
  return axios({
    method: 'POST',
    data: body,
    url: `${api_url}/user/login`
  });
}
export function callApiRegister(body) {
  return axios({
    method: 'POST',
    data: body,
    url: `${api_url}/user/register`
  });
}
export function callApiAddInfo(body) {
  return axios({
    method: 'POST',
    data: body,
    url: `${api_url}/user/addinfo`
  });
}
export function callApiGetInfo() {
  console.log('token', localStorage.getItem('usertoken'));
  return axios({
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('usertoken')}`
    },
    mode: 'cors',
    url: `${api_url}/me`
  });
}
export function callApiUpdateInfo(body) {
  return axios({
    method: 'POST',
    data: { ...body, token: localStorage.getItem('usertoken') },
    url: `${api_url}/user/updateinfo`
  });
}
export function callApiAccount(body){
  console.log(body);
  return axios({
    method: 'POST',
    data: body,
    url: `${api_url}/user/activatedaccount`
  })
}