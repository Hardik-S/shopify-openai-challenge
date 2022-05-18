// Important:
// You should never expose API keys on the client side in production code
// because anyone on the internet will have access to your secret key
// and can make requests with your account.
// It is however acceptable for the purpose of this application and testing
// since it won’t be widely available and we don’t expect you to have a backend server.

// eslint-disable-next-line no-undef
export const OPEN_AI_SECRET = process.env.REACT_APP_OPEN_AI_SECRET;
