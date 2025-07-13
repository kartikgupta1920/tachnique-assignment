let employees = [];
let currentPageSize = 3;
let currentPage = 1;

function renderEmployees(data = employees) {
  const totalPages = Math.ceil(data.length / currentPageSize);
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * currentPageSize;
  const end = start + currentPageSize;
  const paginated = data.slice(start, end);

  const list = document.getElementById("employeeList");
  list.innerHTML = "";

  paginated.forEach(emp => {
    const card = document.createElement("div");
    card.className = "employee-card";
    card.innerHTML = `
      <strong>${emp.firstName} ${emp.lastName}</strong><br/>
      <b>Email:</b> ${emp.email}<br/>
      <b>Department:</b> ${emp.department}<br/>
      <b>Role:</b> ${emp.role}<br/>
      <button onclick="editEmployee(${emp.id})">Edit</button>
      <button onclick="deleteEmployee(${emp.id})">Delete</button>
    `;
    list.appendChild(card);
  });

  renderPagination(data, start, Math.min(end, data.length), data.length);
}

function renderPagination(data, startIndex, endIndex, totalCount) {
  const container = document.querySelector("#pagination");
  const label = document.querySelector("#pageInfo");
  const totalPages = Math.ceil(data.length / currentPageSize);

  container.innerHTML = "";
  label.textContent = `Showing ${startIndex + 1}–${endIndex} of ${totalCount}`;

  // Previous Button
  const prevBtn = document.createElement("button");
  prevBtn.textContent = "Previous";
  prevBtn.disabled = currentPage === 1;
  prevBtn.onclick = () => {
    currentPage--;
    renderEmployees(data);
  };
  container.appendChild(prevBtn);

  // Page Buttons
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active-page" : "";
    btn.onclick = () => {
      currentPage = i;
      renderEmployees(data);
    };
    container.appendChild(btn);
  }

  // Next Button
  const nextBtn = document.createElement("button");
  nextBtn.textContent = "Next";
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.onclick = () => {
    currentPage++;
    renderEmployees(data);
  };
  container.appendChild(nextBtn);
}

function applySearch() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const filtered = employees.filter(e =>
    e.firstName.toLowerCase().includes(query) ||
    e.lastName.toLowerCase().includes(query) ||
    e.email.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderEmployees(filtered);
}

function applyFilter() {
  const fname = document.getElementById("filterFirstName").value.toLowerCase();
  const dept = document.getElementById("filterDepartment").value.toLowerCase();
  const role = document.getElementById("filterRole").value.toLowerCase();

  const filtered = employees.filter(e =>
    (!fname || e.firstName.toLowerCase().includes(fname)) &&
    (!dept || e.department.toLowerCase() === dept) &&
    (!role || e.role.toLowerCase() === role)
  );
  currentPage = 1;
  renderEmployees(filtered);
}

function resetFilter() {
  document.getElementById("filterFirstName").value = "";
  document.getElementById("filterDepartment").value = "";
  document.getElementById("filterRole").value = "";
  currentPage = 1;
  renderEmployees();
}

function sortEmployees() {
  const sortKey = document.getElementById("sortSelect").value;
  if (sortKey) {
    employees.sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
    currentPage = 1;
    renderEmployees();
  }
}

function changePageSize() {
  currentPageSize = parseInt(document.getElementById("paginationSelect").value);
  currentPage = 1;
  renderEmployees();
}

function deleteEmployee(id) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees = employees.filter(e => e.id !== id);
    localStorage.setItem("employees", JSON.stringify(employees));
    currentPage = 1;
    renderEmployees();
  }
}

function editEmployee(id) {
  localStorage.setItem("editId", id);
  window.location.href = "add-edit.html";
}

window.onload = () => {
  const stored = localStorage.getItem("employees");
  if (stored) {
    employees = JSON.parse(stored);
  } else {
    employees = defaultEmployees; // from data.js
    localStorage.setItem("employees", JSON.stringify(employees));
  }
  renderEmployees();
};
