// src/services/adminService.js
import axios from 'axios';

export const fetchAdminData = () =>
  axios.get('/admin')
       .then(res => res.data);
