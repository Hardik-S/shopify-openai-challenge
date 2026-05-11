const STORAGE_KEY = 'legacy-rebuilder-shopify-openai-challenge-modern-v1';
const MAX_ENTRIES = 30;
const DEFAULT_COUNT = 'n/a';

const openAIEndpoint = 'https://api.openai.com/v1/completions';
const promptForm = document.getElementById('promptForm');
const promptInput = document.getElementById('promptInput');
const apiKeyInput = document.getElementById('apiKey');
const toneSelect = document.getElementById('toneSelect');
const searchInput = document.getElementById('searchInput');
const submitBtn = document.getElementById('submitBtn');
const responseList = document.getElementById('responseList');
const emptyState = document.getElementById('emptyState');
const modePill = document.getElementById('modePill');
const countPill = document.getElementById('countPill');
const lastRun = document.getElementById('lastRun');
const errorText = document.getElementById('errorText');
const clearBtn = document.getElementById('clearBtn');
const exportJsonBtn = document.getElementById('exportJsonBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const toggleThemeBtn = document.getElementById('toggleThemeBtn');
const clearDialog = document.getElementById('clearDialog');
const cancelClear = document.getElementById('cancelClear');
const confirmClearBtn = document.getElementById('confirmClear');

let entries = [];

const tonePrompts = {
  helpful: 'Respond in a helpful and practical style.',
  concise: 'Respond in a short and concise style.',
  creative: 'Respond with vivid, creative phrasing.'
};

const hashPseudoRandom = (text) => {
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < text.length; i += 1) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

const localFallback = (prompt, tone) => {
  const hash = hashPseudoRandom(`${tone}::${prompt}`);
  const samples = [
    'Great idea: break this into 3 clear implementation steps.',
    'Consider a short plan first, then test with one synthetic example.',
    'Add guardrails for malformed inputs, then provide a compact answer.',
    'This response style is deterministic and uses no live API key.',
    'Use this output as a baseline and refine if needed.'
  ];
  const sample = samples[hash % samples.length];
  return `${sample} Prompt length=${prompt.length}, tone=${tone}, seed=${hash}.`;
};

const formatTime = (iso) =>
  new Date(iso).toLocaleString('en-CA', {
    hour12: false,
    timeZone: 'America/Toronto'
  });

const setError = (message) => {
  errorText.textContent = message || '';
};

const buildPromptPayload = (prompt, tone) => ({
  prompt: `${tonePrompts[tone]}\n\nUser: ${prompt}\nAssistant:`,
  max_tokens: 160,
  temperature: tone === 'creative' ? 0.85 : 0.35,
  n: 1,
  stop: null,
  model: 'text-davinci-003'
});

const writeStorage = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
};

const loadStorage = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
  return [];
};

const escapeCsvValue = (value) => {
  const normalized = String(value ?? '');
  if (/["\n,]/.test(normalized)) {
    return `"${normalized.replaceAll('"', '""')}"`;
  }
  return normalized;
};

const renderEntry = (entry) => {
  const item = document.createElement('li');
  item.className = 'card';
  item.innerHTML = `
    <h3>${entry.prompt}</h3>
    <p class="meta">
      ${entry.modeLabel} • ${entry.durationMs != null ? `${entry.durationMs}ms` : 'unknown ms'} •
      ${entry.timestamp}
    </p>
    <p class="response">${entry.response}</p>
    <div class="card-actions">
      <button type="button" data-id="${entry.id}" data-kind="copy">Copy response</button>
      <button type="button" data-id="${entry.id}" data-kind="delete">Delete</button>
    </div>
  `;

  const copyBtn = item.querySelector('[data-kind="copy"]');
  const deleteBtn = item.querySelector('[data-kind="delete"]');

  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(entry.response).catch(() => {
      setError('Copy failed. You can still select and copy manually.');
    });
  });

  deleteBtn.addEventListener('click', () => {
    entries = entries.filter((row) => row.id !== entry.id);
    writeStorage();
    paint();
  });

  return item;
};

const paint = () => {
  const query = searchInput.value.trim().toLowerCase();
  responseList.innerHTML = '';
  const visible = entries.filter((entry) => {
    if (!query) {
      return true;
    }
    return (
      entry.prompt.toLowerCase().includes(query) ||
      entry.response.toLowerCase().includes(query)
    );
  });

  visible.forEach((entry) => responseList.appendChild(renderEntry(entry)));
  emptyState.style.display = visible.length ? 'none' : 'block';
  countPill.textContent = `${entries.length} saved prompts`;
  lastRun.textContent =
    entries.length > 0
      ? `Latest: ${entries[0].timestamp}`
      : 'No responses yet';
};

const showSummary = () => {
  const latest = entries[0];
  if (!latest) {
    modePill.textContent = 'Ready';
    return;
  }
  modePill.textContent = latest.modeLabel;
};

const callOpenAI = async (prompt, tone) => {
  const token = apiKeyInput.value.trim();
  if (!token) {
    return {
      source: 'offline',
      text: localFallback(prompt, tone),
      promptEcho: prompt
    };
  }

  const payload = buildPromptPayload(prompt, tone);
  const start = performance.now();
  try {
    const response = await fetch(openAIEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const durationMs = Math.round(performance.now() - start);

    if (!response.ok) {
      return {
        source: 'error',
        errorStatus: response.status,
        durationMs
      };
    }

    const body = await response.json();
    const text = body?.choices?.[0]?.text?.trim() || 'No text returned from API.';
    return {
      source: 'live',
      text,
      durationMs
    };
  } catch (error) {
    return {
      source: 'offline',
      text: localFallback(prompt, tone),
      durationMs: Math.round(performance.now() - start)
    };
  }
};

const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  const prompt = promptInput.value.trim();
  const tone = toneSelect.value;
  if (!prompt) {
    setError('Prompt is required.');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Running...';

  const result = await callOpenAI(prompt, tone);

  if (result.source === 'error') {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit prompt';
    if (result.errorStatus === 401) {
      setError('API key rejected. Falling back to deterministic demo response.');
      const entry = {
        id: crypto.randomUUID(),
        prompt,
        response: localFallback(prompt, tone),
        timestamp: formatTime(new Date()),
        modeLabel: 'Mode: offline fallback',
        durationMs: result.durationMs
      };
      entries.unshift(entry);
      entries = entries.slice(0, MAX_ENTRIES);
      writeStorage();
      paint();
      showSummary();
      return;
    }
    setError(`Request failed with status ${result.errorStatus}. Falling back safely.`);
    return;
  }

  const entry = {
    id: crypto.randomUUID(),
    prompt,
    response: result.text,
    timestamp: formatTime(new Date()),
    modeLabel: `Mode: ${result.source === 'live' ? 'live OpenAI' : 'offline fallback'}`,
    durationMs: result.durationMs
  };

  entries = [entry, ...entries].slice(0, MAX_ENTRIES);
  writeStorage();
  promptInput.value = '';
  paint();
  showSummary();

  submitBtn.disabled = false;
  submitBtn.textContent = 'Submit prompt';
};

const clearHistory = () => {
  clearDialog.showModal();
};

const confirmClear = () => {
  entries = [];
  writeStorage();
  paint();
  showSummary();
  setError('');
  clearDialog.close();
};

const exportJson = () => {
  if (!entries.length) {
    setError('No data to export.');
    return;
  }
  const blob = new Blob([JSON.stringify(entries, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shopify-openai-challenge-modern-history.json';
  a.click();
  URL.revokeObjectURL(url);
};

const exportCsv = () => {
  if (!entries.length) {
    setError('No data to export.');
    return;
  }
  const rows = [
    ['id', 'timestamp', 'prompt', 'response', 'source', 'duration_ms']
  ];

  entries.forEach((entry) => {
    rows.push([
      entry.id,
      entry.timestamp,
      entry.prompt,
      entry.response,
      entry.modeLabel,
      entry.durationMs ?? DEFAULT_COUNT
    ]);
  });

  const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'shopify-openai-challenge-modern-history.csv';
  a.click();
  URL.revokeObjectURL(url);
};

const init = () => {
  entries = loadStorage();
  paint();
  showSummary();

  promptForm.addEventListener('submit', handleSubmit);
  searchInput.addEventListener('input', paint);
  clearBtn.addEventListener('click', clearHistory);
  cancelClear.addEventListener('click', () => clearDialog.close());
  confirmClearBtn.addEventListener('click', confirmClear);
  exportJsonBtn.addEventListener('click', exportJson);
  exportCsvBtn.addEventListener('click', exportCsv);
  toggleThemeBtn.addEventListener('click', () => {
    document.body.classList.toggle('light');
  });
};

init();
