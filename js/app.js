const getRelativeTime = (today, birthDate) => {
    let ageYears = today.getFullYear() - birthDate.getFullYear();
    let ageMonths = today.getMonth() - birthDate.getMonth();
    let ageDays = today.getDate() - birthDate.getDate();

    // Adjust years if birthday hasn't occurred this year yet
    if (today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
        ageYears--;
    }

    // Adjust months if birthday day hasn't occurred this month yet
    if (today.getDate() < birthDate.getDate()) {
        ageMonths--;
    }

    // If ageDays is negative, get the number of days in the previous month
    if (ageDays < 0) {
        const prevMonthLastDate = new Date(today.getFullYear(), today.getMonth(), 0);
        ageDays += prevMonthLastDate.getDate();
    }

    return {
        day: ageDays,
        month: ageMonths,
        year: ageYears
    };
}

const displayNumbers = ({day, month, year}) => {
    const options = { duration: 2 };  // Duration is in seconds
    new countUp.CountUp('years', year, options).start();
    new countUp.CountUp('months', month, options).start();
    new countUp.CountUp('days', day, options).start();
}

// We load a function when the document is ready without jquery
document.addEventListener("DOMContentLoaded", function () {
    // Get references to the input elements
    const dayInput = document.getElementsByName('day')[0];
    const monthInput = document.getElementsByName('month')[0];
    const yearInput = document.getElementsByName('year')[0];

    // Add an input event listener to each input element
    [dayInput, monthInput, yearInput].forEach(function (input) {
        input.addEventListener('input', function () {
            // Clear any custom validation messages whenever the user modifies the input
            input.setCustomValidity('');
        });
    });

    document.getElementById("calculator-form").addEventListener('submit', function (e) {
        // needed to prevent the default behaviour of the form which reloads the page
        e.preventDefault();

        let form = e.target;
        let day = form['day'].value;
        let month = form['month'].value;
        let year = form['year'].value;

        let inputDate = new Date(year, month - 1, day); // month is 0-indexed in JavaScript Date object
        let today = new Date();
        today.setHours(0, 0, 0, 0);  // Reset time part to compare dates only

        if (inputDate > today) {
            // Set a custom validation message on one or all of the input elements
            form['year'].setCustomValidity('The date cannot be in the future.');
        } else {
            // Clear any previous custom validation messages
            form['year'].setCustomValidity('');
            // Proceed with your calculation logic +  display
            displayNumbers(getRelativeTime(today, inputDate));
        }

        // Trigger form validation and display the custom validation message (if any)
        form.reportValidity();

    });
});
