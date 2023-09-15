import { Axios } from 'axios';

export const axios = new Axios({
  headers: {
    'Content-Type': 'application/json',
  },
});
