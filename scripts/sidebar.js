import { getEntries } from "./dataAccess.js";

export const createSidebar = () => {
  const entries = getEntries();
  entries.sort((a, b) => b.id - a.id);

  const createSidenav = (entry) => {
    return `
    <div class="entry">
    <a id="viewEntry--${entry.id}">${entry.concept}</a>
    </div>`;
  };

  let html = `
    <div class="sidenav">
        <img src="styles/dannyface.JPG" class="face">
        <div class="parentDiv">
        <span class="material-symbols-outlined" id="createEntry">add_circle</span>
            <span class="iconText" id="createEntry">new entry</span>
        </div>
        ${entries.map(createSidenav).join("")}
    </div>
    `;
  return html;
};
