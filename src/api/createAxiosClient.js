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
  getAuthData,
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
        return Promise.reject(error)
      }

      if (
        error.response?.status === 401 &&
        originalRequest?.url !== refreshTokenUrl &&
        originalRequest?._retry !== true
      ) {
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
        const authPayload = getAuthData()
        console.log(authPayload)
        return client
          .post(refreshTokenUrl, authPayload)
          .then(res => {
            const newAccessToken =
              typeof res.tokens === "string" ? res.tokens : false
            const auth = typeof res.auth === "boolean" ? res.auth : false
            const firstname =
              typeof res.firstname === "string" ? res.firstname : false
            const tokens = {
              ...authPayload,
              accessToken: newAccessToken,
              auth: auth,
              firstname: firstname,
            }
            if (newAccessToken && tokens) setRefreshedTokens(tokens)
            processQueue(null)
            return client(originalRequest)
          }, handleError)
          .finally(() => {
            isRefreshing = false
          })
      } else if (error.response?.status === 401) {
        console.log("logged out")
        //logout()
        return handleError(error)
      }

      return Promise.reject(error)
    }
  )

  return client
}
