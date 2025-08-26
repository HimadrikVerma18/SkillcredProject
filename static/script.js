let confidenceChart;

async function predictPrice() {
  const data = {
    category: document.getElementById('category').value,
    brand_rating: parseFloat(document.getElementById('brand_rating').value),
    weight: parseFloat(document.getElementById('weight').value),
    dimensions: parseFloat(document.getElementById('dimensions').value),
    warranty: parseInt(document.getElementById('warranty').value),
    seller_rating: parseFloat(document.getElementById('seller_rating').value),
    competition: document.getElementById('competition').value
  };

  // Show loading state
  document.getElementById('result').style.display = 'block';
  document.getElementById('predicted_price').innerText = config.app.loadingMessage;
  
  try {
    // Create intelligent prompt for Perplexity AI
    const prompt = `You are an expert e-commerce price analyst. Based on the following product details, provide a realistic price prediction in Indian Rupees (₹):

Product Category: ${data.category}
Brand Rating: ${data.brand_rating}/5
Weight: ${data.weight} kg
Dimensions: ${data.dimensions} cm³
Warranty: ${data.warranty} months
Seller Rating: ${data.seller_rating}/5
Competition Level: ${data.competition}

Please provide your response in this exact JSON format:
{
  "predicted_price": "₹X,XXX",
  "confidence": 0.XX,
  "explanation": "Brief explanation of the price",
  "is_anomaly": false,
  "anomaly_reason": "If anomaly detected, explain why"
}

Consider market trends, brand value, competition, and product specifications. Be realistic and provide confidence based on data quality.`;

    // Call Perplexity AI API
    const response = await fetch(config.perplexity.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.perplexity.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: config.perplexity.model,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: config.perplexity.maxTokens,
        temperature: config.perplexity.temperature
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    const result = await response.json();
    
    // Parse the AI response
    let aiData;
    try {
      // Extract the content from the AI response
      const content = result.choices[0].message.content;
      aiData = JSON.parse(content);
    } catch (parseError) {
      // Fallback to demo logic if parsing fails
      console.warn('Failed to parse AI response, using fallback logic');
      aiData = generateFallbackPrediction(data);
    }

    // Display results
    document.getElementById('predicted_price').innerText = aiData.predicted_price || '₹0';
    
    const anomalyText = document.getElementById('anomaly_text');
    if (aiData.is_anomaly && aiData.anomaly_reason) {
      anomalyText.style.display = 'block';
      anomalyText.innerText = `⚠️ ${aiData.anomaly_reason}`;
    } else {
      anomalyText.style.display = 'none';
    }

    // Update confidence chart
    const confidence = aiData.confidence || config.app.defaultConfidence;
    updateConfidenceChart(confidence);

  } catch (error) {
    console.error('Error calling Perplexity API:', error);
    
    // Fallback to demo logic
    const fallbackData = generateFallbackPrediction(data);
    document.getElementById('predicted_price').innerText = fallbackData.predicted_price;
    
    const anomalyText = document.getElementById('anomaly_text');
    if (fallbackData.is_anomaly) {
      anomalyText.style.display = 'block';
      anomalyText.innerText = fallbackData.anomaly_reason;
    } else {
      anomalyText.style.display = 'none';
    }
    
    updateConfidenceChart(fallbackData.confidence);
  }
}

function generateFallbackPrediction(data) {
  // Fallback logic when API fails
  const basePrices = {
    'electronics': 15000,
    'clothing': 2500,
    'home': 8000,
    'books': 800,
    'sports': 5000
  };

  let predictedPrice = basePrices[data.category];
  
  // Adjust price based on features
  predictedPrice *= (data.brand_rating / 3);
  predictedPrice *= (data.weight * 0.8 + 0.6);
  predictedPrice *= (data.dimensions / 1000 * 0.5 + 0.8);
  predictedPrice *= (data.warranty / 12 * 0.3 + 0.9);
  predictedPrice *= (data.seller_rating / 3);
  
  if (data.competition === 'low') predictedPrice *= 1.2;
  else if (data.competition === 'high') predictedPrice *= 0.8;

  let confidence = config.app.defaultConfidence;
  if (data.brand_rating >= 4) confidence += 0.1;
  if (data.seller_rating >= 4) confidence += 0.1;
  if (data.warranty >= 12) confidence += 0.1;
  confidence = Math.min(confidence, 0.95);

  let isAnomaly = false;
  let anomalyReason = '';
  
  if (data.weight > 10 && data.category === 'clothing') {
    isAnomaly = true;
    anomalyReason = 'Unusually heavy clothing item detected';
  } else if (data.dimensions > 50000 && data.category === 'electronics') {
    isAnomaly = true;
    anomalyReason = 'Extremely large electronics item';
  } else if (data.brand_rating < 2 && data.seller_rating < 2) {
    isAnomaly = true;
    anomalyReason = 'Low ratings detected - consider alternatives';
  }

  return {
    predicted_price: `${config.app.currency}${Math.round(predictedPrice).toLocaleString()}`,
    confidence: confidence,
    is_anomaly: isAnomaly,
    anomaly_reason: anomalyReason
  };
}

function updateConfidenceChart(confidence) {
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
