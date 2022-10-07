import {
  fetchEntries,
  fetchMoods,
  getEntries,
  getMoods,
  addNewEntry,
  editEntry,
  deleteEntry,
} from "./dataAccess.js";
import { createSidebar } from "./sidebar.js";
import { welcomePage } from "./welcomePage.js";
import { createTopNav } from "./topNav.js";

const sidebar = document.querySelector("#sidebar");
const notebook = document.querySelector(".notebook");
const container = document.querySelector("#container");
const topNav = document.querySelector(".topnav")

const initialRender = async () => {
  await fetchEntries();
  await fetchMoods();
  sidebar.innerHTML = createSidebar();
  notebook.innerHTML = welcomePage();
  topNav.innerHTML = createTopNav();
};

initialRender();

const renderSidebar = async () => {
  await fetchEntries();
  sidebar.innerHTML = createSidebar();
};

const showLatestEntry = async () => {
  await fetchEntries()
  const entries = getEntries();
  entries.sort((objA, objB) => Number(objB.dateTime) - Number(objA.dateTime));
  convertNotebookToEntry(entries[0]);
}

document.addEventListener("stateChanged", (e) => {
  initialRender();
});

document.addEventListener("renderSidebar", (e) => {
  renderSidebar();
});

document.addEventListener("showLatestEntry", (e) => {
  showLatestEntry();
})

const convertNotebookToEntry = (entry) => {
  notebook.innerHTML = `
    <div class="notebook-entry" id="${entry.id}">
    <span class="material-symbols-outlined blackIcon" id="editEntry--${entry.id}">edit_note</span>
    <span class="material-symbols-outlined blackIcon" id="deleteEntry--${entry.id}">delete</span>
    <ul>
        <li>Date: ${entry.date}</li>
        <li>Concept: ${entry.concept}</li>
        <li>journalEntry: ${entry.journalEntry}</li>
        <li>Mood: ${entry.mood.name}</li>
    </ul>
    </div>
    `;
};

sidebar.addEventListener("click", (click) => {
  if (click.target.id.startsWith("viewEntry--")) {
    const entryId = parseInt(click.target.id.split("--")[1]);
    const entries = getEntries();
    for (const entry of entries) {
      if (entry.id === entryId) {
        convertNotebookToEntry(entry);
      }
    }
  }
});

sidebar.addEventListener("click", (click) => {
  if (click.target.id.startsWith("createEntry")) {
    const moods = getMoods();
    notebook.innerHTML = `
            <form class="entryForm">
                <fieldset class="field">
                    <label for="entryDate" class="fieldLabel">Date:</label>
                    <input type="date" class="entryForm__date" name="date">
                </fieldset>
                <fieldset class="field">
                    <label for="conceptText" class="fieldLabel">Concepts covered:</label>
                    <textarea id="concept" rows="1" cols="40" name="concept"></textarea>
                </fieldset>
                <fieldset class="field">
                    <label for="journalEntry" class="fieldLabel">Journal Entry:</label>
                    <textarea id="journalEntry" rows="10" cols="40" name="journalEntry"></textarea>
                </fieldset>
                <fieldset class="field">
                    <label for="mood" class="fieldLabel">Mood:</label>
                    <select name="mood">
                        <option value="" disabled selected>how do you feel?</option>
                        ${moods.map((mood) => {return `<option value="${mood.id}">${mood.name}</option>`}).join("")}
                    </select>
                </fieldset>
                <fieldset class="last-field">
                    <button type="button" id="submitOrder">Record Journal Entry</button>
                    <button type="button" id="cancelForm">Cancel</button>
                </fieldset>
            </form>`;
  }
});

container.addEventListener("click", (clickEvent) => {
  if (clickEvent.target.id.startsWith("submitOrder")) {
    let date = document.querySelector("input[name=date]")?.value;
    let dateEntered = new Date(date);
    dateEntered = dateEntered.toLocaleDateString();
    let concept = document.getElementById("concept")?.value;
    let journalEntry = document.getElementById("journalEntry")?.value;
    let mood = document.querySelector("select[name=mood]")?.value;
    let dateTimeInitiated = Number(new Date())

    let newEntry = {
      dateTime: dateTimeInitiated,
      date: date,
      concept: concept,
      journalEntry: journalEntry,
      moodId: mood,
    };

    addNewEntry(newEntry);

  }
});

const convertEntryToEdit = (entry) => {
  let div = entry.id;
  const moods = getMoods();

  const displayUnselectedMoods = (entry) => {
    let html = ``;
    for (const mood of moods) {
      if (mood.id != entry.moodId) {
        html += `<option value="${mood.id}">${mood.name}</option>`;
      }
    }
    return html;
  };

  document.getElementById(div).innerHTML = `
    <div class="editPage">
    <fieldset class="field">
        <label for="entryDate" class="fieldLabel">Date:</label>
        <input type="date" class="entryForm__date" name="newDate" value="${entry.date}">
    </fieldset>
    <fieldset class="field">
        <label for="conceptText" class="fieldLabel">Concepts covered:</label>
        <textarea id="concept" rows="1" cols="40" name="newConcept">${entry.concept}</textarea>
    </fieldset>
    <fieldset class="field">
        <label for="journalEntry" class="fieldLabel">Journal Entry:</label>
        <textarea id="journalEntry" rows="10" cols="40" name="newJournalEntry">${entry.journalEntry}</textarea>
    </fieldset>
    
    <fieldset class="field">
        <label for="mood" class="fieldLabel">Mood:</label>
        <select name="mood">
            <option value="${entry.moodId}" selected="selected">${entry.mood.name}</option>
            ${displayUnselectedMoods(entry)}
        </select>
    </fieldset>

    <fieldset class="last-field">
    <button type="button" id="saveEntry--${entry.id}">Save Journal Entry</button>
    <button type="button" id="cancelEntry--${entry.id}">Cancel</button>
    </fieldset>
    </div>
    
    `;
};

container.addEventListener("click", (click) => {
  if (click.target.id.startsWith("editEntry--")) {
    const entryId = parseInt(click.target.id.split("--")[1]);
    const entries = getEntries();
    for (const entry of entries) {
      if (entry.id === entryId) {
        convertEntryToEdit(entry);
      }
    }
  }
});

container.addEventListener("click", (click) => {
  if (click.target.id.startsWith("saveEntry--")) {
    const newDate = document.querySelector("input[name='newDate']").value;
    const newConcept = document.querySelector(
      "textarea[name='newConcept']"
    ).value;
    const newJournalEntry = document.querySelector(
      "textarea[name='newJournalEntry']"
    ).value;
    const newMood = document.querySelector("select[name='mood']").value;
    const dateTimeInitiated = Number(new Date())
    const entryId = parseInt(click.target.id.split("--")[1]);

    const dataToSendToAPI = {
      dateTime: dateTimeInitiated,
      id: entryId,
      date: newDate,
      concept: newConcept,
      journalEntry: newJournalEntry,
      moodId: newMood,
    };

    editEntry(dataToSendToAPI);

  }
});

container.addEventListener("click", (click) => {
  if (click.target.id.startsWith("deleteEntry--")) {
    const entryId = parseInt(click.target.id.split("--")[1]);
    deleteEntry(entryId);
  }
});

container.addEventListener("click", (click) => {
  if (click.target.id.startsWith("cancelEntry--")) {
    const entryId = parseInt(click.target.id.split("--")[1]);
    const entries = getEntries();
    for (const entry of entries) {
      if (entry.id === entryId) {
        convertNotebookToEntry(entry);
      }
    }
  }
});

container.addEventListener("click", (click) => {
  if (click.target.id.startsWith("cancelForm")) {
    initialRender();
  }
});
