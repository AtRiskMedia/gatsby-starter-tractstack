import create from "zustand"

function setTokensToLocalStorage({ accessToken }) {
  localStorage.setItem("accessToken", accessToken)
}

function removeTokensFromLocalStorage() {
  localStorage.removeItem("accessToken")
}

export const useAuthStore = create((set, get) => ({
  accessToken: localStorage.getItem("accessToken") || null,
  isLoggedIn: () => !!get().accessToken,
  login: tokens => {
    setTokensToLocalStorage(tokens)
    set(state => ({
      ...state,
      accessToken: tokens.accessToken,
    }))
  },
  logout: () => {
    removeTokensFromLocalStorage()
    set(state => ({
      ...state,
      accessToken: null,
    }))
  },
}))
