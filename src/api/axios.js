import axios from 'axios'
import qs from 'qs'
axios.defaults.baseURL = ''
axios.defaults.withCredentials = true
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.transformRequest = request => {
  if (!request) return request
  return qs.stringify(request)
}
axios.interceptors.response.use(
  response => response.data,
  reason => Promise.reject(reason)
)

export default axios
