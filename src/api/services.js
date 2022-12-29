import { client } from "./axiosClient"

export async function register({ fingerprint }) {
  const payload = {
    fingerprint: fingerprint.toString(),
  }
  return client.post("/auth/register", payload, { authorization: false })
}

export async function graph() {
  return client.get("/users/graph")
}

export async function pushPayload({ events }) {
  return client.post("/users/eventStream", events)
}
