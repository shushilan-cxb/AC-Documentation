# Project Plan: Form with Prefilled Tally.so Link

## 1. Initial Application Setup

-   **HTML Structure:** Created `index.html` with basic HTML5 boilerplate.
-   **Styling:** Integrated Tailwind CSS via CDN for responsive and modern UI.
-   **CSV Parsing:** Included PapaParse library via CDN for efficient CSV data handling.
-   **Hashing:** Integrated CryptoJS library via CDN for SHA256 hashing.
-   **Core Form Elements:** Implemented dropdowns for "Aggregation Center" and "Document Type".
-   **Tally.so Integration:** Embedded the Tally.so form using an `iframe` with a dynamic `src` attribute for pre-filling.
-   **Data Loading:** Implemented JavaScript to fetch and parse `User-Hash.csv` and `Doc-Type.csv` upon page load.
-   **Dropdown Population:** Developed functions to populate the "Aggregation Center" and "Document Type" dropdowns with data from the respective CSV files.
-   **Dynamic URL Generation:** Created a function to construct the Tally.so pre-filled URL based on selected dropdown values.

## 2. Passcode Authentication System

-   **Authentication Button:** Implemented a dynamic button (`authButton`) in the top-left corner:
    -   Displays "Add Passcode" with a key icon when logged out.
    -   Displays "Logout" with a logout icon when logged in.
-   **Passcode Input Modal:** Created a modal (`passcodeModal`) that appears when "Add Passcode" is clicked.
    -   Features a 6-digit pin-style input field (`passcodeInputs`) for entering the passcode.
    -   Each digit is in a separate input box for a better user experience.
-   **Input Validation & Formatting:**
    -   Ensures only alphanumeric characters are accepted in the passcode input.
    -   Automatically converts all entered characters to uppercase.
    -   Automatically moves focus to the next input field after a digit is entered.
    -   Allows backspace to move focus to the previous input field.
-   **SHA256 Hashing:** The entered 6-digit passcode is converted to a SHA256 hash.
-   **Passcode Verification:**
    -   The generated SHA256 hash is compared against two specific columns in `User-Hash.csv`: `Passcode-Hashed1` and `Passcode-Hashed2`.
    -   If a match is found in either column, the user is considered authenticated.
    -   If no match is found, an "Invalid Passcode" alert is displayed, and the input fields are cleared.
-   **Local Storage Integration:** The successfully matched hashed passcode is stored in the browser's local storage for session persistence.
-   **Content Visibility Control:** The main application content (dropdowns and Tally form) is hidden (`hidden` class) until a valid passcode is entered and authenticated.
-   **Welcome Message:** Upon successful authentication, a "Welcome *Username*" message is displayed.
    -   The *Username* is dynamically determined:
        -   If the passcode matches `Passcode-Hashed2`, the `Responsible MLS` value from `User-Hash.csv` is used.
        -   Otherwise (if it matches `Passcode-Hashed1`), the `Responsible MF` value from `User-Hash.csv` is used.
-   **Logout Functionality:** Clicking the "Logout" button:
    -   Clears the stored passcode from local storage.
    -   Resets the welcome message.
    -   Hides the main application content.
    -   Resets the "Aggregation Center" dropdown and Tally form `src`.

## 3. Data Filtering and Dynamic Updates

-   **Filtered Aggregation Centers:** The "Aggregation Center" dropdown is dynamically populated only with entries from `User-Hash.csv` that correspond to the currently logged-in user's hashed passcode.
-   **Cascade Selection for Name of Document:** Implemented dynamic options for "Name of Document" dropdown based on the selected "Document Type" from `Doc-Type.csv`.
-   **Tally Form Pre-filling:** The Tally.so `iframe`'s `src` is updated dynamically with pre-filled data from the selected dropdown values.

## 4. Date Field Implementation and Validation

-   **Date Input Fields:** Added "Start Date" and "End Date" input fields with `DD/MM/YYYY` format.
-   **Date Pickers:** Integrated Flatpickr library for interactive date selection.
-   **Date Duration Validation:** Implemented logic to ensure "End Date" cannot be earlier than "Start Date". The "End Date" date picker visually greys out dates prior to the selected "Start Date".

## 5. Enhanced Data Mapping and Tally URL Construction

-   **Location Mapping:** Mapped 'Location' from `User-Hash.csv` based on the selected 'Aggregation Center'.
-   **Frequency Mapping:** Mapped 'Frequency' from `Doc-Type.csv` based on the selected 'Name of Document'.
-   **Custom Tally Prefill Parameters:** Renamed prefill parameters in the Tally.so URL for improved clarity (e.g., `prefill_1` to `AC%20Name`, `prefill_2` to `Location`, `prefill_3` to `Submitted%20by`, `prefill_4` to `Responsible%20MLS`, `prefill_5` to `Name%20of%20Document`, `prefill_6` to `Document%20Type`, `prefill_7` to `Start%20Date`, `prefill_8` to `End%20Date`, and `prefill_10` to `Frequency`).
-   **Console Logging:** The generated Tally URL is logged to the browser console for verification.

## 6. Styling and Responsiveness

-   **External Stylesheet:** Added `style.css` for custom styling.
-   **Mobile Responsiveness:** Enhanced the form's appearance and mobile-friendliness using a combination of Tailwind CSS and custom CSS in `style.css`.

## 7. Testing

-   **Comprehensive Testing:** Thoroughly tested all implemented features to ensure:
    -   Correct parsing and loading of CSV data.
    -   Accurate passcode hashing and matching against `User-Hash.csv`.
    -   Proper display of welcome messages and button states.
    -   Correct filtering and population of dropdowns.
    -   Accurate generation and pre-filling of the Tally.so URL.
    -   Correct date picker functionality and date duration validation.
    -   Responsive design and functionality across different devices.