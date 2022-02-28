const data = {
  labels: [
    'Ecstacy',
    'Admiration',
    'Terror',
    'Amazement',
    'Grief',
    'Loathing',
    'Rage',
    'Vigilance',
  ],
  datasets: [{
    label: 'Emotions',
    data: [50, 50, 50, 50, 50, 50, 50, 50],
    fill: true,
    borderWidth: 1,
    pointRadius: 20,
    pointHitRadius: 25,
    pointHoverRadius: 15,
    backgroundColor: 'rgba(255, 99, 132, 0.2)',
    borderColor: 'rgb(255, 99, 132)',
    pointBackgroundColor: 'rgb(255, 99, 132)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgb(255, 99, 132)'
  }]
};
const config = {
  type: 'radar',
  data: data,
  options: {
    responsive: true,
    plugins: {
      dragData: {
        round: 1, // rounds the values to n decimal places 
                  // in this case 1, e.g 0.1234 => 0.1)
        showTooltip: true, // show the tooltip while dragging [default = true]
        // dragX: true // also enable dragging along the x-axis.
                       // this solely works for continous, numerical x-axis scales (no categories or dates)!
        onDragStart: function(e, element) {
          /*
          // e = event, element = datapoint that was dragged
          // you may use this callback to prohibit dragging certain datapoints
          // by returning false in this callback
          if (element.datasetIndex === 0 && element.index === 0) {
            // this would prohibit dragging the first datapoint in the first
            // dataset entirely
            return false
          }
          */
        },
        onDrag: function(e, datasetIndex, index, value) {         
          /*     
          // you may control the range in which datapoints are allowed to be
          // dragged by returning `false` in this callback
          if (value < 0) return false // this only allows positive values
          if (datasetIndex === 0 && index === 0 && value > 20) return false 
          */
        },
        onDragEnd: function(e, datasetIndex, index, value) {
          // you may use this callback to store the final datapoint value
          // (after dragging) in a database, or update other UI elements that
          // dependent on it
          console.log(data.datasets[0].data)
        },
      }
    },    
    elements: {
      line: {
        borderWidth: 3
      }
    },
    scales: {
      r: {
          suggestedMin: 0,
          suggestedMax: 100
      }
    }
  },
};

const myChart = new Chart(
  document.getElementById('myChart'),
  config
);

console.log(document.getElementById('sentence'))
document.addEventListener('visibilitychange', function logData() {
  if (first_load){
    if (document.visibilityState === 'hidden') {
      var data = JSON.stringify ({sentence: document.getElementById('sentence').innerHTML});
      navigator.sendBeacon('/disconnect',data);
    }
  }else{
    first_load = true
  }  
  if (document.visibilityState === 'visible') {
    location.reload(); 
  }
});

var first_load = false

function submit() {
  var label = JSON.stringify ({sentence: document.getElementById('sentence').innerHTML, values: data.datasets[0].data});
  navigator.sendBeacon('/save',label);
  location.reload(); 
}

// function download(){
//   var xmlHttp = new XMLHttpRequest();
//   xmlHttp.open( "GET", '/download', true ); // false for synchronous request
//   xmlHttp.send( null );
// }