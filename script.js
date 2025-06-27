const customerList = document.getElementById('customers');
const detailsDiv = document.getElementById('details');
const logForm = document.getElementById('log-form');
const logEntry = document.getElementById('log-entry');
const activityLog = document.getElementById('activity-log');

let selectedCustomer = null;
let logs = {};
let customersData = [];

fetch('data/customers.json')
  .then(res => res.json())
  .then(data => {
    customersData = data;
    renderCustomerList(customersData);
  });

function renderCustomerList(data) {
  customerList.innerHTML = '';
  data.forEach(customer => {
    const li = document.createElement('li');
    li.textContent = customer.name;
    li.onclick = () => showCustomerDetails(customer);
    customerList.appendChild(li);
  });
}

function showCustomerDetails(customer) {
  selectedCustomer = customer;
  detailsDiv.innerHTML = `
    <label>Name: <input id="edit-name" value="${customer.name}"></label><br>
    <label>Phone: <input id="edit-phone" value="${customer.phone}"></label><br>
    <label>Email: <input id="edit-email" value="${customer.email}"></label><br>
    <button id="save-btn">Save</button>
  `;

  document.getElementById('save-btn').onclick = () => {
    customer.name = document.getElementById('edit-name').value;
    customer.phone = document.getElementById('edit-phone').value;
    customer.email = document.getElementById('edit-email').value;
    renderCustomerList(customersData);
    showCustomerDetails(customer);
  };

  renderActivityLog(customer.id);
}

const searchInput = document.getElementById('search');
searchInput.addEventListener('input', () => {
  const term = searchInput.value.toLowerCase();
  const filtered = customersData.filter(c =>
    c.name.toLowerCase().includes(term)
  );
  renderCustomerList(filtered);
});

logForm.onsubmit = (e) => {
  e.preventDefault();
  if (!selectedCustomer || !logEntry.value.trim()) return;

  const id = selectedCustomer.id;
  if (!logs[id]) logs[id] = [];

  logs[id].push(logEntry.value.trim());
  logEntry.value = '';
  renderActivityLog(id);
};

function renderActivityLog(id) {
  activityLog.innerHTML = '';
  (logs[id] || []).forEach((entry, index) => {
    const li = document.createElement('li');
    li.textContent = entry;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.style.marginLeft = '10px';
    delBtn.onclick = () => {
      logs[id].splice(index, 1);
      renderActivityLog(id);
    };

    li.appendChild(delBtn);
    activityLog.appendChild(li);
  });
}

