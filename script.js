const authButton = document.getElementById('authButton');
const logoutIconButton = document.getElementById('logoutIconButton');
const authButtonContainer = document.getElementById('authButtonContainer');
const logoutButtonContainer = document.getElementById('logoutButtonContainer');
const passcodeModal = document.getElementById('passcodeModal');
const passcodeInputsContainer = document.getElementById('passcodeInputs');
const passcodeInputs = Array.from(passcodeInputsContainer.querySelectorAll('input'));
const mainContent = document.getElementById('mainContent');
const aggregationCenterSelect = document.getElementById('aggregationCenter');
const nameOfDocumentSelect = document.getElementById('nameOfDocument');

const docTypeSelect = document.getElementById('docType');
const tallyForm = document.getElementById('tallyForm');
const welcomeMessage = document.getElementById('welcomeMessage');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

let userData = [];
let docData = [];
let endDatePicker; // Declare endDatePicker here

function checkAuth() {
    const passcodeHash = localStorage.getItem('passcode');
    if (passcodeHash) {
        const user = userData.find(u => u['Passcode-Hashed1'] === passcodeHash || u['Passcode-Hashed2'] === passcodeHash);
        if (user) {
            if (user['Passcode-Hashed2'] === passcodeHash) {
                welcomeMessage.textContent = `Welcome ${user['Responsible MLS']}`;
            } else {
                welcomeMessage.textContent = `Welcome ${user['Responsible MF']}`;
            }
        }
        authButtonContainer.style.display = 'none';
        logoutButtonContainer.style.display = 'flex';
        logoutIconButton.innerHTML = '<i class="fas fa-sign-out-alt"></i>'; // Ensure only icon
        mainContent.classList.remove('hidden');
        populateAggregationCenters();
        populateDocTypes();
    } else {
        welcomeMessage.textContent = '';
        authButtonContainer.style.display = 'block';
        authButton.innerHTML = '<i class="fas fa-key"></i> Add Passcode'; // Ensure text and icon
        logoutButtonContainer.style.display = 'none';
        mainContent.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('passcode');
    welcomeMessage.textContent = '';
    aggregationCenterSelect.innerHTML = '<option>Select an Aggregation Center</option>';
    tallyForm.src = 'about:blank';
    checkAuth();
}

authButton.addEventListener('click', () => {
    passcodeModal.classList.remove('hidden');
    passcodeInputs[0].focus();
});

logoutIconButton.addEventListener('click', () => {
    logout();
});

passcodeInputs.forEach((input, index) => {
    input.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();

        if (e.target.value.length === 1 && index < passcodeInputs.length - 1) {
            passcodeInputs[index + 1].focus();
        }

        const allFilled = passcodeInputs.every(i => i.value.length === 1);
        if (allFilled) {
            const passcode = passcodeInputs.map(i => i.value).join('');
            const hashedPasscode = CryptoJS.SHA256(passcode).toString();

            const user = userData.find(u => u['Passcode-Hashed1'] === hashedPasscode || u['Passcode-Hashed2'] === hashedPasscode);

            if (user) {
                localStorage.setItem('passcode', hashedPasscode);
                passcodeModal.classList.add('hidden');
                passcodeInputs.forEach(i => i.value = '');
                checkAuth();
            } else {
                alert('Invalid Passcode');
                passcodeInputs.forEach(i => i.value = '');
                passcodeInputs[0].focus();
            }
        }
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value.length === 0) {
            passcodeInputs[index - 1].focus();
        }
    });
});

Promise.all([
    fetch('User-Hash.csv').then(response => response.text()),
    fetch('Doc-Type.csv').then(response => response.text())
]).then(([userCsv, docCsv]) => {
    userData = Papa.parse(userCsv, { header: true, skipEmptyLines: true }).data;
    docData = Papa.parse(docCsv, { header: true, skipEmptyLines: true }).data;

    checkAuth();

    flatpickr(startDateInput, {
        dateFormat: "d/m/Y",
        onChange: function(selectedDates, dateStr, instance) {
            endDatePicker.set("minDate", selectedDates[0]);
            updateTallyForm();
        }
    });

    endDatePicker = flatpickr(endDateInput, {
        dateFormat: "d/m/Y",
        minDate: startDateInput.value ? flatpickr.parseDate(startDateInput.value, "d/m/Y") : null,
    });
});

function populateAggregationCenters() {
    const passcodeHash = localStorage.getItem('passcode');
    aggregationCenterSelect.innerHTML = '<option>Select an Aggregation Center</option>';
    if (passcodeHash) {
        const filteredData = userData.filter(user => {
            return user['Passcode-Hashed1'] === passcodeHash || user['Passcode-Hashed2'] === passcodeHash;
        });

        filteredData.forEach(user => {
            if (user['Aggregation Center']) {
                const option = document.createElement('option');
                option.value = user['Aggregation Center'];
                option.textContent = user['Aggregation Center'];
                aggregationCenterSelect.appendChild(option);
            }
        });
    }
}



function populateDocTypes() {
    docTypeSelect.innerHTML = '<option>Select a Document Type</option>';
    const documentTypes = [...new Set(docData.map(doc => doc['Document Type']))];
    documentTypes.forEach(type => {
        if (type) {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            docTypeSelect.appendChild(option);
        }
    });
}

function populateNameOfDocuments() {
    nameOfDocumentSelect.innerHTML = '<option>Select a Name of Document</option>';
    const selectedDocType = docTypeSelect.value;
    const filteredDocs = docData.filter(doc => doc['Document Type'] === selectedDocType);
    filteredDocs.forEach(doc => {
        if (doc['Name of Document']) {
            const option = document.createElement('option');
            option.value = doc['Name of Document'];
            option.textContent = doc['Name of Document'];
            nameOfDocumentSelect.appendChild(option);
        }
    });
}

function updateTallyForm() {
    const selectedCenter = aggregationCenterSelect.value;
    const selectedDocType = docTypeSelect.value;
    const selectedNameOfDoc = nameOfDocumentSelect.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const passcodeHash = localStorage.getItem('passcode');

    if (selectedCenter && selectedDocType && selectedNameOfDoc && startDate && endDate && selectedCenter !== 'Select an Aggregation Center' && selectedDocType !== 'Select a Document Type' && selectedNameOfDoc !== 'Select a Name of Document' && passcodeHash) {
        // Date validation
        const parseDate = (dateString) => {
            const parts = dateString.split('/');
            return new Date(parts[2], parts[1] - 1, parts[0]); // YYYY, MM (0-indexed), DD
        };

        const parsedStartDate = parseDate(startDate);
        const parsedEndDate = parseDate(endDate);

        if (parsedEndDate < parsedStartDate) {
            alert('End Date cannot be earlier than Start Date.');
            tallyForm.src = 'about:blank'; // Clear the form if validation fails
            return;
        }

        const user = userData.find(u => u['Aggregation Center'] === selectedCenter && (u['Passcode-Hashed1'] === passcodeHash || u['Passcode-Hashed2'] === passcodeHash));
        const doc = docData.find(d => d['Name of Document'] === selectedNameOfDoc && d['Document Type'] === selectedDocType);

        if (user && doc) {
            const tallyUrl = `https://tally.so/r/mBWX5R?AC%20Name=${encodeURIComponent(user['Aggregation Center'])}&Location=${encodeURIComponent(user['Location'])}&Submitted%20by=${encodeURIComponent(user['Responsible MF'])}&Responsible%20MLS=${encodeURIComponent(user['Responsible MLS'])}&Name%20of%20Document=${encodeURIComponent(doc['Name of Document'])}&Document%20Type=${encodeURIComponent(doc['Document Type'])}&Start%20Date=${encodeURIComponent(startDate)}&End%20Date=${encodeURIComponent(endDate)}&Frequency=${encodeURIComponent(doc['Frequency'])}`;
            tallyForm.src = tallyUrl;
            console.log("Generated Tally URL:", tallyUrl);
        }
    }
}

aggregationCenterSelect.addEventListener('change', updateTallyForm);
docTypeSelect.addEventListener('change', () => {
    populateNameOfDocuments();
    updateTallyForm();
});
nameOfDocumentSelect.addEventListener('change', updateTallyForm);
startDateInput.addEventListener('change', updateTallyForm);
endDateInput.addEventListener('change', updateTallyForm);

checkAuth();

// Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      }, (err) => {
        console.log('ServiceWorker registration failed: ', err);
      });
  });
}