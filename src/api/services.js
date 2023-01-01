import { client } from "./axiosClient"

export async function register({ fingerprint, codeword = false }) {
  const payload = {
    fingerprint: fingerprint.toString(),
    codeword: codeword,
  }
  return client.post("/auth/register", payload, { authorization: false })
}

export async function graph() {
  return client.get("/users/graph")
}

export async function pushPayload({ events }) {
  return client.post("/users/eventStream", events)
}

export async function saveProfile({ profile }) {
  return client.post("/users/profile", profile)
}
