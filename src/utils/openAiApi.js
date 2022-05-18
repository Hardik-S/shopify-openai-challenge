import { OPEN_AI_API } from '../shared/constants/open-ai-api';
import { OPEN_AI_SECRET } from '../shared/constants/open-ai-secret';

class OpenAiApi {
  constructor(options) {
    this._baseUrl = options.baseUrl;
    this._headers = options.headers;
  }

  _handleResponse(res) {
    if (res.ok) {
      return Promise.resolve(res.json()).then((data) => {
        return { data, status: res.status };
      });
    }
    return Promise.reject(res.status);
  }

  sendPrompt(data) {
    return fetch(`${this._baseUrl}`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(data)
    }).then(this._handleResponse);
  }
}

const openAiApi = new OpenAiApi({
  baseUrl: OPEN_AI_API,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${OPEN_AI_SECRET}`
  }
});

export default openAiApi;
