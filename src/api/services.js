import { client } from "./axiosClient"

export async function register({ fingerprint }) {
  const payload = {
    fingerprint: fingerprint.toString(),
  }
  return client.post("auth/register", payload, { authorization: false })
}

export async function graph() {
  return client.post("/users/graph")
}

export async function pushPayload({ payload }) {
  return client.post("/users/eventStream", payload)
}
