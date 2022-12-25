import axios from "axios"

let failQueue = []
let isRefreshing = false

const processQueue = error => {
  failQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })

  failQueue = []
}

export function createAxiosClient({
  options,
  getCurrentAccessToken,
  refreshTokenUrl,
  setRefreshedTokens,
  logout,
}) {
  const client = axios.create(options)

  client.interceptors.request.use(
    config => {
      if (config.authorization !== false) {
        const token = getCurrentAccessToken()
        if (token) {
          config.headers.Authorization = "Bearer " + token
          config.withCredentials = true
        }
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  client.interceptors.response.use(
    response => {
      return response
    },
    error => {
      const originalRequest = error.config
      originalRequest.headers = JSON.parse(
        JSON.stringify(originalRequest.headers || {})
      )

      const handleError = error => {
        processQueue(error)
        logout()
        return Promise.reject(error)
      }

      if (
        error.response?.status === 401 &&
        originalRequest?.url !== refreshTokenUrl &&
        originalRequest?._retry !== true
      ) {
        localStorage.clear()
        if (isRefreshing) {
          return new Promise(function(resolve, reject) {
            failQueue.push({ resolve, reject })
          })
            .then(() => {
              return client(originalRequest)
            })
            .catch(err => {
              return Promise.reject(err)
            })
        }
        isRefreshing = true
        originalRequest._retry = true
        return client
          .post(refreshTokenUrl)
          .then(res => {
            const tokens = {
              accessToken: res.data?.jwt,
            }
            setRefreshedTokens(tokens)
            processQueue(null)
            return client(originalRequest)
          }, handleError)
          .finally(() => {
            isRefreshing = false
          })
      }

      if (error.response?.status === 401) {
        localStorage.clear()
        return handleError(error)
      }

      return Promise.reject(error)
    }
  )

  return client
}
