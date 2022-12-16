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
  getCurrentRefreshToken,
  refreshTokenUrl,
  logout,
  setRefreshedTokens,
}) {
  const client = axios.create(options)

  client.interceptors.request.use(
    config => {
      if (config.authorization !== false) {
        const token = getCurrentAccessToken()
        if (token) {
          config.headers.Authorization = "Bearer " + token
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
      const refreshToken = getCurrentRefreshToken()

      const handleError = error => {
        processQueue(error)
        logout()
        return Promise.reject(error)
      }

      if (
        refreshToken &&
        error.response?.status === 401 &&
        error.response.data.message === "TokenExpiredError" &&
        originalRequest?.url !== refreshTokenUrl &&
        originalRequest?._retry !== true
      ) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
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
          .post(refreshTokenUrl, {
            refreshToken: refreshToken,
          })
          .then(res => {
            const tokens = {
              accessToken: res.data?.accessToken,
              refreshToken: res.data?.refreshToken,
            }
            setRefreshedTokens(tokens)
            processQueue(null)
            return client(originalRequest)
          }, handleError)
          .finally(() => {
            isRefreshing = false
          })
      }

      if (
        error.response?.status === 401 &&
        error.response?.data?.message === "TokenExpiredError"
      ) {
        return handleError(error)
      }

      return Promise.reject(error)
    }
  )

  return client
}
