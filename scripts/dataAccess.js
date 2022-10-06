const applicationState = {
  moods: [],
  entries: [],
};

const API = "http://localhost:8088";

export const fetchEntries = async () => {
  const dataFetch = await fetch(`${API}/entries/?_expand=mood`);
  const journalEntries = await dataFetch.json();
  applicationState.entries = journalEntries;
};

export const fetchMoods = async () => {
  const dataFetch = await fetch(`${API}/moods`);
  const moods = await dataFetch.json();
  applicationState.moods = moods;
};

export const getEntries = () => {
  return applicationState.entries.map((entry) => ({ ...entry }));
};

export const getMoods = () => {
  return applicationState.moods.map((mood) => ({ ...mood }));
};

export const addNewEntry = async (newEntry) => {
  const fetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newEntry),
  };
  const response = await fetch(`${API}/entries`, fetchOptions);
  const responseJson = await response.json(response);
  document.dispatchEvent(new CustomEvent("renderSidebar"));
};

export const editEntry = async (object) => {
  const fetchOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(object),
  };
  const response = await fetch(`${API}/entries/${object.id}`, fetchOptions);
  const responseJson = await response.json(response);
  document.dispatchEvent(new CustomEvent("renderSidebar"));
};

export const deleteEntry = async (id) => {
  await fetch(`${API}/entries/${id}`, { method: "DELETE" });
  document.dispatchEvent(new CustomEvent("stateChanged"));
};
