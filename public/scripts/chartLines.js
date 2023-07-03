window.addEventListener('DOMContentLoaded', () => {
    const ctx = document.getElementById('myChart').getContext('2d');
    var s = '#{stuff}';
    console.log(s);
    const myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'], //dates
            datasets: [{
                label: s,
                data: [12, 19, 3, 5, 2, 3], //Temp
                backgroundColor: 'rgba(192, 50, 50, 0.2)',
                borderColor: 'rgba(192, 25, 25, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
