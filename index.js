const COHORT = "2311-FSA-ET-WEB-PT-SF";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
  events: [],
};

const eventList = document.querySelector("#events");
const addEventsForm = document.querySelector("#addEvent");
addEventsForm.addEventListener("submit", addEvent);

async function render() {
  await getEvents();
  renderEvents();
}
render();

async function getEvents() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();
    state.events = json.data;
  } catch (error) {
    console.error(error);
  }
}

function renderEvents() {
  if (!state.events.length) {
    eventList.innerHTML = "<li>No events.</li>";
    return;
  }

  const eventsCards = state.events.map((event) => {
    const li = document.createElement("li");
    li.innerHTML = `
    <h2>${event.name}</h2>
    <p>${event.description}</p>
    <p>${event.date}</p>
    <p>${event.location}</p>
    `;
    const button = document.createElement("button");
    button.textContent = "Delete";
    li.append(button);

    button.addEventListener("click", () => deleteEvent(event.id));
    return li;
  });
  eventList.replaceChildren(...eventsCards);
}

async function addEvent(event) {
  event.preventDefault();
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: addEventsForm.name.value,
        description: addEventsForm.description.value,
        date: new Date(addEventsForm.date.value),
        location: addEventsForm.location.value,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to create event");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}

async function deleteEvent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
    render();
  } catch (error) {
    console.error(error);
  }
}
