import { client } from "./axiosClient"

export function register({ fingerprint, httpReferrer, httpUserAgent }) {
  const payload = { "fingerprint": fingerprint.toString(), "http_referrer": httpReferrer, "http_user_agent": httpUserAgent }
  return client.post("auth/register", payload, { authorization: false })
}

export function graph() {
  return client.get("/users/graph")
}
