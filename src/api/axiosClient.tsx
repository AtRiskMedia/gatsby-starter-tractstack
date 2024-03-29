import { createAxiosClient } from './createAxiosClient'
import { conciergeSync } from '../api/services'
import { useAuthStore } from '../stores/authStore'
import { IAuthStoreLoginResponse } from '../types'

function getCurrentAccessToken() {
  return useAuthStore.getState().accessToken
}

function setRefreshedTokens(response: IAuthStoreLoginResponse) {
  const login = useAuthStore.getState().login
  login(response)
}

function logout(full: boolean = false) {
  const logout = useAuthStore.getState().logout
  logout(full)
}

function getAuthData() {
  const authData = useAuthStore.getState().authData
  return {
    encryptedCode: authData.encryptedCode,
    encryptedEmail: authData.encryptedEmail,
  }
}

export const client = createAxiosClient({
  options: {
    baseURL: process.env.CONCIERGE_BASE_URL_FRONT,
    timeout: 10000,
    headers: {
      'Content-Type': `application/json`,
    },
  },
  getCurrentAccessToken,
  refreshTokenUrl: process.env.CONCIERGE_REFRESH_TOKEN_URL_FRONT,
  setRefreshedTokens,
  getAuthData,
  logout,
})

export const getTokens = async (
  codeword?: string | null,
  email?: string | null,
) => {
  const encryptedEmail = useAuthStore.getState().authData.encryptedEmail
  const encryptedCode = useAuthStore.getState().authData.encryptedCode
  const referrer = useAuthStore.getState().referrer
  const fingerprint = useAuthStore.getState().fingerprint
  const params =
    codeword && email
      ? { codeword, email }
      : encryptedCode && encryptedEmail
        ? { encryptedCode, encryptedEmail }
        : {}
  try {
    const response = await conciergeSync({ referrer, ...params, fingerprint })
    const accessToken = response.data.jwt
    const auth = response.data.auth
    const knownLead = response.data.known_lead
    const firstname = response.data.first_name
    const newFingerprint = response.data.fingerprint
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
      fingerprint: newFingerprint,
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
