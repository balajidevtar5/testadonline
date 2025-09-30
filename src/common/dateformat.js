export const dateFormat = (date) => {
    const moment = require('moment');

    // Current date and time
    const currentDate = moment();

    // Given date
    const inputDate = moment(date);

    // Calculate the difference in minutes
    const diffMinutes = currentDate.diff(inputDate, 'minutes');

    // If the difference is less than 60 minutes, display in minutes
    if (diffMinutes < 60) {
        return `${diffMinutes}m `;
    }

    // Otherwise, display in hours
    const diffHours = Math.floor(diffMinutes / 60);
    return `${diffHours}h`;
}
