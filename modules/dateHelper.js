
exports.dateToday = () => {
    const today = new Date();

    // 20 JAN 2021, 02:50 AM

    const months = ['January', 'Februar', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    let regHours = today.getHours();
    let marker = regHours > 12 ? "PM" : "AM";

    regHours %= 12; // if the hour is 0 or 12, it will result to 0
    regHours = regHours == 0 ? 12 : regHours; // if hour is zero, it is 12

    let date = today.getDate() + " " + months[today.getMonth()] + " " + today.getFullYear() + ", ";
    date += regHours + ":" + today.getMinutes() + " " + marker;

    return date;
};