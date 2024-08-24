const inputs = document.querySelectorAll('input');
const form = document.getElementById('form');
const labels = document.querySelectorAll('label');

const date = new Date();
const currentDay = date.getDate();
const currentMonth = date.getMonth() + 1;
const currentYear = date.getFullYear();

inputs.forEach(input => {
    input.addEventListener('input', function () {
        const day = parseInt(document.getElementById('day').value);
        const month = parseInt(document.getElementById('month').value);
        const year = parseInt(document.getElementById('year').value);
        const errorText = this.parentElement.querySelector('.errorMessage');

        const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        const invalidDay = 
            (day <= 0 || day > 31) ||
            (month === 2 && (day > 29 || (day === 29 && !isLeapYear))) ||
            ([4, 6, 9, 11].includes(month) && day > 30);

        const invalidMonth = month <= 0 || month > 12;

        if (this.id === 'day' && invalidDay) {
            showError(errorText, true);
        } else if (this.id === 'month' && (invalidMonth || invalidDay)) {
            showError(errorText, true);
        } else if (this.id === 'year' && year > currentYear) {
            showError(errorText, true);
        } else {
            showError(errorText, false);
            if (this.id === 'month') {
                showError(document.getElementById('dayLabel').querySelector('.errorMessage'), false);
            }
        }
    });
});

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const day = parseInt(document.getElementById('day').value);
    const month = parseInt(document.getElementById('month').value);
    const year = parseInt(document.getElementById('year').value);

    const invalidDay = 
    (day <= 0 || day > 31) ||
    (month === 2 && (day > 29 || (day === 29 && !isLeapYear))) ||
    ([4, 6, 9, 11].includes(month) && day > 30);

    const invalidMonth = month <= 0 || month > 12;

    if ([day, month, year].includes(NaN) || invalidDay || invalidMonth || year > currentYear) {
        handleEmptyInputs();
        return;
    }
 
    let yearsDifference = currentYear - year;
    let monthsDifference = currentMonth - month;
    let daysDifference = currentDay - day;

    if (monthsDifference < 0 || (monthsDifference === 0 && daysDifference < 0)) {
        yearsDifference--;
        monthsDifference += 12;
    }

    if (daysDifference < 0) {
        monthsDifference--;
        daysDifference += new Date(year, month, 0).getDate();
    }

    animateCount(yearsDifference, monthsDifference, daysDifference);
});

function showError(element, show) {
    element.style.display = show ? 'inline' : 'none';
    toggleRedBorderAndLabel(show);
}

function handleEmptyInputs() {
    inputs.forEach(input => {
        if (input.value === '') {
            const requiredText = input.parentElement.querySelector('.required');
            showError(requiredText, true);
            setTimeout(() => showError(requiredText, false), 3000);
        }
    });
}

function animateCount(yearsDifference, monthsDifference, daysDifference) {
    const years = document.getElementById('years');
    const months = document.getElementById('months');
    const days = document.getElementById('days');

    let currentYears = 0;
    let currentMonths = 0;
    let currentDays = 0;

    const interval = 20;
    const incrementYears = Math.ceil(yearsDifference / (3000 / interval));
    const incrementMonths = Math.ceil(monthsDifference / (3000 / interval));
    const incrementDays = Math.ceil(daysDifference / (3000 / interval));

    const intervalId = setInterval(() => {
        currentYears += incrementYears;
        currentMonths += incrementMonths;
        currentDays += incrementDays;

        if (currentYears >= yearsDifference) currentYears = yearsDifference;
        if (currentMonths >= monthsDifference) currentMonths = monthsDifference;
        if (currentDays >= daysDifference) currentDays = daysDifference;

        years.innerText = currentYears;
        months.innerText = currentMonths;
        days.innerText = currentDays;

        if (currentYears === yearsDifference && currentMonths === monthsDifference && currentDays === daysDifference) {
            clearInterval(intervalId);
        }
    }, interval);   
}

function toggleRedBorderAndLabel(turnOn) {
    const color = turnOn ? 'hsl(0, 100%, 67%)' : 'hsl(0, 1%, 44%)';
    inputs.forEach(input => input.style.borderColor = color);
    labels.forEach(label => label.style.color = color);
}


