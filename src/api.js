import axios from "axios";
const BACKEND_URL="http://localhost:3000"

export async function submitIssue(formData) {

    return axios.post(`${BACKEND_URL}/api/report-issue`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  export const uploadVideo = (formData) => {
    return axios.post(`${BACKEND_URL}/api/upload-video`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  };