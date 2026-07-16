import { API_URL } from "constants/api.constant"

const appConfig = {
    apiPrefix: API_URL,
    authenticatedEntryPath: '/dashboard',
    unAuthenticatedEntryPath: '/sign-in',
    tourPath: '/',
    enableMock: false
}

export default appConfig