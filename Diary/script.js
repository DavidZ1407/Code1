// ================================
// Load and display note data
// ================================

function loadNotes(date) {
  const data = notesData[date];

  if (!data) {
    alert("No notes available for this date!");
    document.getElementById("noteTopic").innerText = "";
    document.getElementById("noteNotes").innerHTML = "";
    return;
  }

  setActiveButton(date);
  document.getElementById("noteTopic").innerText = data.topic || "";

  const notes = data.notes;

  let html = "<h3>Notes:</h3>";

  if (Array.isArray(notes)) {

    for (const section of notes) {
      const color = section.color || "#00ffe7";
      html += `
        <h4 style="color:${color}; text-shadow: 0 0 6px ${color}; font-size: 1.8rem; margin-top: 1.5rem;">
          ${section.title}
        </h4>
        <ul>${(section.items || []).map(item => `<li>${item}</li>`).join("")}</ul>
      `;
    }
  } else if (typeof notes === 'object') {

    for (const [category, items] of Object.entries(notes)) {
      html += `<h4>${category}</h4><ul>${items.map(n => `<li>${n}</li>`).join('')}</ul>`;
    }
  } else {
   
    html += `<ul>${(notes || []).map(n => `<li>${n}</li>`).join("")}</ul>`;
  }

  document.getElementById("noteNotes").innerHTML = html;
}

// ================================
// Highlight the active button
// ================================

function setActiveButton(date) {
  const buttons = document.querySelectorAll('.note_buttons button');

  buttons.forEach(btn => {
    const isActive = btn.getAttribute('data-date') === date;
    btn.classList.toggle('active', isActive);
  });
}

// ================================
// Make the box expandable on click
// ================================

function enableBoxClickEffect() {
  const colBox = document.querySelector('.col_box');

  if (colBox) {
    colBox.addEventListener('click', () => {
      colBox.classList.toggle('active');
    });
  }
}

// ================================
// Initialize the page on load
// ================================

window.onload = function () {
  loadNotes('Day_1');
  enableBoxClickEffect();
};
