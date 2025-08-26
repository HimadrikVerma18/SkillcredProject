let confidenceChart;

async function predictPrice() {
  const category = document.getElementById('category').value;
  
  if (!category) {
    alert('Please select a product category first!');
    return;
  }

  // Collect common fields
  const commonData = {
    category: category,
    brand_rating: parseFloat(document.getElementById('brand_rating').value),
    seller_rating: parseFloat(document.getElementById('seller_rating').value),
    competition: document.getElementById('competition').value
  };

  // Collect category-specific fields
  const categoryData = {};
  const dynamicFields = document.getElementById('dynamic-fields');
  const inputs = dynamicFields.querySelectorAll('input, select');
  
  inputs.forEach(input => {
    if (input.value) {
      categoryData[input.id] = input.value;
    }
  });

  // Show loading state
  document.getElementById('result').style.display = 'block';
  document.getElementById('predicted_price').innerText = config.app.loadingMessage;
  
  try {
    // Create intelligent, category-specific prompt for Perplexity AI
    const prompt = createCategorySpecificPrompt(category, commonData, categoryData);

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
      const content = result.choices[0].message.content;
      aiData = JSON.parse(content);
    } catch (parseError) {
      console.warn('Failed to parse AI response, using fallback logic');
      aiData = generateFallbackPrediction(category, commonData, categoryData);
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
    const fallbackData = generateFallbackPrediction(category, commonData, categoryData);
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

function createCategorySpecificPrompt(category, commonData, categoryData) {
  const categoryDescriptions = {
    electronics: 'electronic devices and gadgets',
    clothing: 'clothing, fashion items, and accessories',
    home: 'home decor, furniture, and garden items',
    books: 'books, magazines, and media content',
    sports: 'sports equipment, fitness gear, and athletic wear',
    automotive: 'automotive parts, accessories, and vehicles',
    beauty: 'beauty products, skincare, and health items',
    toys: 'toys, games, and children\'s entertainment'
  };

  let prompt = `You are an expert e-commerce price analyst specializing in ${categoryDescriptions[category]}. 

Based on the following product details, provide a realistic price prediction in Indian Rupees (₹):

**Product Category:** ${category}
**Brand Rating:** ${commonData.brand_rating}/5
**Seller Rating:** ${commonData.seller_rating}/5
**Market Competition:** ${commonData.competition}

**Category-Specific Details:**
`;

  // Add category-specific fields to the prompt
  Object.entries(categoryData).forEach(([key, value]) => {
    prompt += `- ${key.replace(/_/g, ' ').toUpperCase()}: ${value}\n`;
  });

  prompt += `

Please provide your response in this exact JSON format:
{
  "predicted_price": "₹X,XXX",
  "confidence": 0.XX,
  "explanation": "Brief explanation considering ${category} market factors",
  "is_anomaly": false,
  "anomaly_reason": "If anomaly detected, explain why"
}

Consider:
- Current market trends for ${category} in India
- Brand value and reputation impact
- Category-specific factors (${Object.keys(categoryData).join(', ')})
- Competition level effects
- Seasonal or market timing factors
- Quality indicators and condition

Be realistic and provide confidence based on data completeness and market knowledge.`;

  return prompt;
}

function generateFallbackPrediction(category, commonData, categoryData) {
  // Category-specific base prices and logic
  const categoryConfigs = {
    electronics: {
      basePrice: 15000,
      factors: ['weight', 'dimensions', 'warranty', 'condition'],
      anomalyChecks: [
        { condition: categoryData.weight > 20, reason: 'Unusually heavy electronics item' },
        { condition: categoryData.dimensions > 100000, reason: 'Extremely large electronics' },
        { condition: commonData.brand_rating < 2, reason: 'Very low brand rating' }
      ]
    },
    clothing: {
      basePrice: 2500,
      factors: ['size', 'material', 'season', 'brand_tier'],
      anomalyChecks: [
        { condition: categoryData.material === 'silk' && commonData.brand_rating < 3, reason: 'Premium material with low brand rating' },
        { condition: categoryData.brand_tier === 'luxury' && commonData.seller_rating < 3, reason: 'Luxury item from low-rated seller' }
      ]
    },
    home: {
      basePrice: 8000,
      factors: ['weight', 'dimensions', 'material', 'room_type'],
      anomalyChecks: [
        { condition: categoryData.weight > 50, reason: 'Very heavy home item' },
        { condition: categoryData.material === 'glass' && categoryData.weight > 10, reason: 'Heavy glass item - safety concern' }
      ]
    },
    books: {
      basePrice: 800,
      factors: ['pages', 'format', 'genre', 'publication_year'],
      anomalyChecks: [
        { condition: categoryData.pages > 1500, reason: 'Extremely long book' },
        { condition: categoryData.publication_year < 1950, reason: 'Very old publication' }
      ]
    },
    sports: {
      basePrice: 5000,
      factors: ['weight', 'sport_type', 'skill_level', 'age_group'],
      anomalyChecks: [
        { condition: categoryData.weight > 15, reason: 'Very heavy sports equipment' },
        { condition: categoryData.skill_level === 'professional' && commonData.brand_rating < 4, reason: 'Professional equipment from low-rated brand' }
      ]
    },
    automotive: {
      basePrice: 25000,
      factors: ['year', 'mileage', 'fuel_type', 'transmission'],
      anomalyChecks: [
        { condition: categoryData.year < 2000, reason: 'Very old vehicle' },
        { condition: categoryData.mileage > 300000, reason: 'Very high mileage' }
      ]
    },
    beauty: {
      basePrice: 1500,
      factors: ['volume', 'skin_type', 'brand_tier', 'cruelty_free'],
      anomalyChecks: [
        { condition: categoryData.volume > 500, reason: 'Very large volume beauty product' },
        { condition: categoryData.brand_tier === 'luxury' && categoryData.volume < 30, reason: 'Very small luxury beauty product' }
      ]
    },
    toys: {
      basePrice: 1200,
      factors: ['age_range', 'battery_required', 'educational', 'brand_tier'],
      anomalyChecks: [
        { condition: categoryData.age_range === '0-2' && categoryData.battery_required === 'yes', reason: 'Battery-operated toy for very young children' },
        { condition: categoryData.educational === 'high' && categoryData.brand_tier === 'budget', reason: 'High educational value from budget brand' }
      ]
    }
  };

  const config = categoryConfigs[category] || categoryConfigs.electronics;
  let predictedPrice = config.basePrice;
  
  // Apply common factors
  predictedPrice *= (commonData.brand_rating / 3);
  predictedPrice *= (commonData.seller_rating / 3);
  
  if (commonData.competition === 'low') predictedPrice *= 1.2;
  else if (commonData.competition === 'high') predictedPrice *= 0.8;

  // Apply category-specific factors
  config.factors.forEach(factor => {
    if (categoryData[factor]) {
      switch (factor) {
        case 'weight':
          predictedPrice *= (parseFloat(categoryData[factor]) * 0.8 + 0.6);
          break;
        case 'dimensions':
          predictedPrice *= (parseFloat(categoryData[factor]) / 1000 * 0.5 + 0.8);
          break;
        case 'warranty':
          predictedPrice *= (parseInt(categoryData[factor]) / 12 * 0.3 + 0.9);
          break;
        case 'brand_tier':
          const tierMultipliers = { 'budget': 0.7, 'mid-range': 1.0, 'premium': 1.5, 'luxury': 2.5 };
          predictedPrice *= (tierMultipliers[categoryData[factor]] || 1.0);
          break;
        case 'material':
          const materialMultipliers = { 'silk': 1.8, 'leather': 1.6, 'wool': 1.4, 'cotton': 1.0, 'polyester': 0.8 };
          predictedPrice *= (materialMultipliers[categoryData[factor]] || 1.0);
          break;
        case 'format':
          const formatMultipliers = { 'hardcover': 1.4, 'paperback': 1.0, 'ebook': 0.6, 'audiobook': 1.2 };
          predictedPrice *= (formatMultipliers[categoryData[factor]] || 1.0);
          break;
      }
    }
  });

  // Check for anomalies
  let isAnomaly = false;
  let anomalyReason = '';
  
  for (const check of config.anomalyChecks) {
    if (check.condition) {
      isAnomaly = true;
      anomalyReason = check.reason;
      break;
    }
  }

  // Additional general anomaly checks
  if (commonData.brand_rating < 2 && commonData.seller_rating < 2) {
    isAnomaly = true;
    anomalyReason = 'Very low ratings - consider alternatives';
  }

  let confidence = config.app.defaultConfidence;
  if (commonData.brand_rating >= 4) confidence += 0.1;
  if (commonData.seller_rating >= 4) confidence += 0.1;
  confidence = Math.min(confidence, 0.95);

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
