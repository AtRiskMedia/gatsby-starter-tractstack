import { client } from "./axiosClient"

export function register({ fingerprint }) {
  const payload = {
    fingerprint: fingerprint.toString(),
  }
  return client.post("auth/register", payload, { authorization: false })
}

export function graph() {
  return client.get("/users/graph")
}

export function pushPayload({ payload }) {
  return client.post("/users/eventSteam", payload)
}
