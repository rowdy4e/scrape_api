const express = require('express');
const cheerio = require('cheerio');
const app = express();
const port = 3000;

async function scrapeForex() {
    try {
        const response = await fetch('https://www.forexfactory.com/');
        const body = await response.text();
        
        $ = cheerio.load(body);

        const arr = [];

        const row = $(`.calendar__row[data-event-id]`);

        row.each((index, element) => {
            arr.push({
                'time': $(element).find(`td.calendar__cell.calendar__time`).text().trim(),
                'currency': $(element).find(`td.calendar__cell.calendar__currency`).text().trim(),
                'event': $(element).find(`td.calendar__cell.calendar__event`).text().trim(),
                'actual': $(element).find(`td.calendar__cell.calendar__actual`).text().trim(),
                'forecast': $(element).find(`td.calendar__cell.calendar__forecast`).text().trim(),
                'previous': $(element).find(`td.calendar__cell.calendar__previous`).text().trim(),
            });
        });

        return {'success': true, 'data': arr};
    } catch (error) {
        return {'success': false, 'message': error.message};
    }
};

app.get('/', async (req, res) => {
    const body = await scrapeForex();

    res.send(body);
});

app.listen(port, () => {
    console.log(`Application listening on port ${port}`);
});
