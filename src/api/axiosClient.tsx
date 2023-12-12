import { createAxiosClient } from './createAxiosClient'
import { register } from '../api/services'
import { useAuthStore } from '../stores/authStore'
import { IAuthStoreLoginResponse } from '../types'

function getCurrentAccessToken() {
  return useAuthStore.getState().accessToken
}

function setRefreshedTokens(response: IAuthStoreLoginResponse) {
  const login = useAuthStore.getState().login
  login(response)
}

function logout() {
  const logout = useAuthStore.getState().logout
  logout()
}

function getAuthData() {
  const fingerprint = useAuthStore.getState().fingerprint
  const authData = useAuthStore.getState().authData
  return {
    fingerprint,
    encryptedCode: authData.encryptedCode,
    encryptedEmail: authData.encryptedEmail,
  }
}

export const client = createAxiosClient({
  options: {
    baseURL: process.env.CONCIERGE_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': `application/json`,
    },
  },
  getCurrentAccessToken,
  refreshTokenUrl: process.env.CONCIERGE_REFRESH_TOKEN_URL,
  setRefreshedTokens,
  getAuthData,
  logout,
})

export const getTokens = async (
  fingerprint: string,
  codeword?: string | null,
  email?: string | null,
) => {
  const encryptedEmail = useAuthStore.getState().authData.encryptedEmail
  const encryptedCode = useAuthStore.getState().authData.encryptedCode
  const referrer = useAuthStore.getState().referrer
  const params =
    codeword && email
      ? { codeword, email }
      : encryptedCode && encryptedEmail
        ? { encryptedCode, encryptedEmail }
        : {}
  try {
    const response = await register({ fingerprint, referrer, ...params })
    const accessToken = response.data.jwt
    const auth = response.data.auth
    const knownLead = response.data.known_lead
    const firstname = response.data.first_name
    const encryptedEmail = response.data.encryptedEmail
    const encryptedCode = response.data.encryptedCode
    const beliefs =
      typeof response.data.beliefs === `string`
        ? JSON.parse(response?.data?.beliefs)
        : null
    return {
      tokens: accessToken,
      auth,
      firstname,
      knownLead,
      encryptedEmail,
      encryptedCode,
      beliefs,
      error: null,
    }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message || error,
      tokens: null,
    }
  }
}
/*
export const getProfile = async () => {
  try {
    const response = await loadProfile()
    const firstname = response.data.firstname
    const email = response.data.email
    const contactPersona = response.data.contactPersona
    const shortBio = response.data.shortBio
    return {
      firstname,
      email,
      contactPersona,
      shortBio,
    }
  } catch (error: any) {
    return {
      error: error?.response?.data?.message || error?.message,
      tokens: null,
    }
  }
}
*/
