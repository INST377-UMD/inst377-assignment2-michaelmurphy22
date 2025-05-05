let chart;

async function getData() {
    const ticker = document.getElementById('stockTicker').value.toUpperCase();
    const days = document.getElementById('stockTime').value;
    const apiKey = 'rF3XTYhYBqavv5a7B2BPNlLIOtwJChB4'; 

    const presentDay = new Date();
    const pastDay = new Date();
    pastDay.setDate(presentDay.getDate() - parseInt(days));

    const formatDate = (date) => date.toISOString().split('T')[0];
    const from = formatDate(pastDay);
    const to = formatDate(presentDay);

    const stockData = await fetch(`https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${from}/${to}?adjusted=true&sort=asc&limit=120&apiKey=${apiKey}`)
        .then((result) => result.json());
    console.log('Retrieved Data:', stockData);
    return stockData;
}

async function populateChart() {
    const stockData = await getData();
    const stockLabels = []; 
    const closingPrices = []; 

    stockData.results.forEach((day) => {
        const date = new Date(day.t);
        stockLabels.push(`${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`);
        closingPrices.push(day.c);
    });

    const ctx = document.getElementById('stockChart').getContext('2d');

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: stockLabels,
            datasets: [
                {
                    label: '($) Stock Price',
                    data: closingPrices,
                    borderColor: 'rgb(75, 192, 192)',
                    borderWidth: 1,
                    fill: false,
                },
            ],
        },
    });
}

async function populateRedditTable() {
    const response = await fetch('https://tradestie.com/api/v1/apps/reddit?date=2022-04-03');
    const redditStockData = await response.json();

    const filteredData = redditStockData.slice(0, 5); 

    const tableBody = document.querySelector('#redditTable tbody');
    tableBody.innerHTML = ''; 

    filteredData.forEach(stock => {
        const rows = document.createElement('tr');
        const tickerColumn = document.createElement('td');
        tickerColumn.innerHTML = stock.ticker
        const commentsColumn = document.createElement('td');
        commentsColumn.innerHTML = stock.no_of_comments;
        const sentimentColumn = document.createElement('td');
        const img = document.createElement('img');
        img.width = 200; 
        if (stock.sentiment === 'Bullish') {
            img.src = 'https://png.pngtree.com/png-clipart/20230514/original/pngtree-green-bullish-png-image_9161147.png'; 
        } else if (stock.sentiment === 'Bearish') {
            img.src = 'https://png.pngtree.com/png-clipart/20230514/original/pngtree-red-bearish-png-image_9161148.png';
        } 
        sentimentColumn.appendChild(img);

        rows.appendChild(tickerColumn);
        rows.appendChild(commentsColumn);
        rows.appendChild(sentimentColumn);
        tableBody.appendChild(rows);
    });
}
window.onload = populateRedditTable

if (annyang) {
    const commands = { 
        'lookup *ticker': function(ticker) {
            document.getElementById('stockTicker').value = ticker.trim();
            populateChart();
        },

        'navigate to *page': function(page) {
            page = page.toLowerCase().trim();
            window.location.href = page + '.html';
        },
    
        'change the color to *color': function(color) {
            document.body.style.backgroundColor = color.toLowerCase();
        },
    
        'hello': function() {
            alert('Hello');
        }
    };
  
    annyang.addCommands(commands);
  
    document.querySelector('.audio-button-on').onclick = function () {
        annyang.start();
    };
  
    document.querySelector('.audio-button-off').onclick = function () {
        annyang.abort();
    };
}


