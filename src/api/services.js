import { client } from "./axiosClient"

export async function register({
  fingerprint,
  codeword = false,
  email = false,
  encryptedEmail = false,
  encryptedCode = false,
}) {
  const payload = {
    fingerprint: fingerprint.toString(),
    codeword: codeword,
    email: email,
    encryptedEmail: encryptedEmail,
    encryptedCode: encryptedCode,
  }
  return client.post("/auth/register", payload, { authorization: false })
}

export async function graph() {
  return client.get("/users/graph")
}

export async function loadProfile() {
  return client.get("/users/profile")
}

export async function pushPayload({ events }) {
  return client.post("/users/eventStream", events)
}

export async function saveProfile({ profile }) {
  return client.post("/users/profile", profile)
}
