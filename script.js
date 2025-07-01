const quotes = [
  "Whoever saves a life, it's as if they saved all mankind. (Qur'an 5:32)",
  "The best people are those most beneficial to others.",
  "Charity wipes away sins like water puts out fire."
];

let quoteIndex = 0;
const typingText = document.getElementById("typingText");

function showQuoteFadeStyle() {
  if (!typingText) return;

  typingText.textContent = quotes[quoteIndex];
  typingText.classList.remove("fade-out");
  typingText.classList.add("fade-in");

  setTimeout(() => {
    typingText.classList.remove("fade-in");
    typingText.classList.add("fade-out");

    setTimeout(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      showQuoteFadeStyle();
    }, 1000);
  }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
  if (typingText) showQuoteFadeStyle();

  const donorForm = document.getElementById("donorForm");
  if (donorForm) {
    donorForm.addEventListener("submit", function (e) {
      e.preventDefault();
      saveDonor();
    });
  }

  const searchForm = document.getElementById("searchForm");
  if (searchForm) {
    searchForm.addEventListener("submit", function (e) {
      e.preventDefault();
      searchDonors();
    });
  }

  const isAdminPage = window.location.pathname.includes("admin.html");
  if (isAdminPage) {
    checkAdminAccess();
  }
});

function saveDonor() {
  const name = document.getElementById("name").value.trim();
  const age = parseInt(document.getElementById("age").value.trim());
  const bloodGroup = document.getElementById("bloodGroup").value;
  const city = document.getElementById("city").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const message = document.getElementById("message");

  const nameRegex = /^[a-zA-Z ]{3,}$/;
  const cityRegex = /^[a-zA-Z ]{3,}$/;
  const contactRegex = /^(\+92|0)?3\d{9}$/;

  if (!name || !age || !bloodGroup || !city || !contact) {
    alert("Please fill out all fields.");
    return;
  }

  if (!nameRegex.test(name)) {
    alert("Please enter a valid name (at least 3 letters).");
    return;
  }

  if (isNaN(age) || age < 18 || age > 65) {
    alert("Age must be between 18 and 65.");
    return;
  }

  if (!cityRegex.test(city)) {
    alert("Enter a valid city name.");
    return;
  }

  if (!contactRegex.test(contact)) {
    alert("Enter a valid Pakistani phone number.");
    return;
  }

  const date = new Date().toLocaleString("en-PK");
  const donor = { name, age, bloodGroup, city, contact, date };
  let donors = JSON.parse(localStorage.getItem("donors")) || [];
  donors.push(donor);
  localStorage.setItem("donors", JSON.stringify(donors));

  document.getElementById("donorForm").reset();
  message.textContent = "Thank you for registering!";
  setTimeout(() => (message.textContent = ""), 4000);
}

function searchDonors() {
  const bloodGroup = document.getElementById("searchBloodGroup").value;
  const city = document.getElementById("searchCity").value.trim().toLowerCase();
  const results = document.getElementById("results");
  results.innerHTML = "";

  let donors = JSON.parse(localStorage.getItem("donors")) || [];
  let matches = donors.filter(
    d => d.bloodGroup === bloodGroup && d.city.toLowerCase() === city
  );

  if (matches.length === 0) {
    results.innerHTML = "<p>No donor found.</p>";
    return;
  }

  matches.forEach((donor) => {
    const card = document.createElement("div");
    card.className = "donor-card";
    card.innerHTML = `
      <p><strong>Name:</strong> ${donor.name}</p>
      <p><strong>Age:</strong> ${donor.age}</p>
      <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
      <p><strong>City:</strong> ${donor.city}</p>
      <p><strong>Contact:</strong> ${donor.contact}</p>
    `;
    results.appendChild(card);
  });
}

function checkAdminPassword() {
  const password = prompt("Enter admin password:");
  if (password === "admin123") {
    localStorage.setItem("adminAccess", "granted");
    window.location.href = "admin.html";
  } else {
    alert("Incorrect password.");
  }
}

function checkAdminAccess() {
  const allowed = localStorage.getItem("adminAccess");
  if (allowed !== "granted") {
    alert("Access Denied. Redirecting to Home.");
    window.location.href = "index.html";
  } else {
    showAllDonors();
  }
}

function showAllDonors() {
  const container = document.getElementById("donorList");
  if (!container) return;

  let donors = JSON.parse(localStorage.getItem("donors")) || [];

  if (donors.length === 0) {
    container.innerHTML = "<p>No donors registered yet.</p>";
    return;
  }

  donors.forEach((donor, index) => {
    const card = document.createElement("div");
    card.className = "donor-card";
    card.innerHTML = `
      <p><strong>Name:</strong> ${donor.name}</p>
      <p><strong>Age:</strong> ${donor.age}</p>
      <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
      <p><strong>City:</strong> ${donor.city}</p>
      <p><strong>Contact:</strong> ${donor.contact}</p>
      <p><strong>Registered On:</strong> ${donor.date}</p>
      <button class="delete-btn" onclick="deleteDonor(${index})">Delete</button>
    `;
    container.appendChild(card);
  });
}

function deleteDonor(index) {
  let donors = JSON.parse(localStorage.getItem("donors")) || [];
  donors.splice(index, 1);
  localStorage.setItem("donors", JSON.stringify(donors));
  showAllDonors();
}
