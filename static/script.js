let confidenceChart;

function predictPrice() {
  const data = {
    category: document.getElementById('category').value,
    brand_rating: parseFloat(document.getElementById('brand_rating').value),
    weight: parseFloat(document.getElementById('weight').value),
    dimensions: parseFloat(document.getElementById('dimensions').value),
    warranty: parseInt(document.getElementById('warranty').value),
    seller_rating: parseFloat(document.getElementById('seller_rating').value),
    competition: document.getElementById('competition').value
  };

  // Demo prediction logic since no backend on Netlify
  const basePrices = {
    'electronics': 15000,
    'clothing': 2500,
    'home': 8000,
    'books': 800,
    'sports': 5000
  };

  let predictedPrice = basePrices[data.category];
  
  // Adjust price based on features
  predictedPrice *= (data.brand_rating / 3); // Brand rating factor
  predictedPrice *= (data.weight * 0.8 + 0.6); // Weight factor
  predictedPrice *= (data.dimensions / 1000 * 0.5 + 0.8); // Dimensions factor
  predictedPrice *= (data.warranty / 12 * 0.3 + 0.9); // Warranty factor
  predictedPrice *= (data.seller_rating / 3); // Seller rating factor
  
  // Competition factor
  if (data.competition === 'low') predictedPrice *= 1.2;
  else if (data.competition === 'high') predictedPrice *= 0.8;

  // Calculate confidence based on data quality
  let confidence = 0.7; // Base confidence
  if (data.brand_rating >= 4) confidence += 0.1;
  if (data.seller_rating >= 4) confidence += 0.1;
  if (data.warranty >= 12) confidence += 0.1;
  confidence = Math.min(confidence, 0.95);

  // Check for anomalies
  let isAnomaly = false;
  let explanation = '';
  
  if (data.weight > 10 && data.category === 'clothing') {
    isAnomaly = true;
    explanation = '⚠️ Unusually heavy clothing item detected';
  } else if (data.dimensions > 50000 && data.category === 'electronics') {
    isAnomaly = true;
    explanation = '⚠️ Extremely large electronics item';
  } else if (data.brand_rating < 2 && data.seller_rating < 2) {
    isAnomaly = true;
    explanation = '⚠️ Low ratings detected - consider alternatives';
  }

  // Display results
  document.getElementById('result').style.display = 'block';
  document.getElementById('predicted_price').innerText = `₹${Math.round(predictedPrice).toLocaleString()}`;

  const anomalyText = document.getElementById('anomaly_text');
  if (isAnomaly) {
    anomalyText.style.display = 'block';
    anomalyText.innerText = explanation;
  } else {
    anomalyText.style.display = 'none';
  }

  // Update chart
  if (confidenceChart) confidenceChart.destroy();

  const ctx = document.getElementById('confidenceChart').getContext('2d');
  confidenceChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Confidence', 'Uncertainty'],
      datasets: [{
        data: [confidence * 100, (1 - confidence) * 100],
        backgroundColor: ['#ff6f61', '#f0f0f0'],
        borderWidth: 1
      }]
    },
    options: {
      plugins: {
        title: { display: true, text: `Confidence: ${(confidence * 100).toFixed(1)}%` }
      }
    }
  });
}
