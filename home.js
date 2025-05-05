function fetchQuote() {
    fetch('https://zenquotes.io/api/random')
        .then(response => response.json())
        .then(data => {
            const quote = data[0];
            document.getElementById('quote').innerHTML = `“${quote.q}”`;
            document.getElementById('author').innerHTML = `— ${quote.a}`;
        });
    }
  
window.onload = fetchQuote;

if (annyang) {
    const commands = {
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
  