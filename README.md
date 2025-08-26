# E-commerce Price Predictor

A beautiful web application for predicting e-commerce product prices based on various features like category, brand rating, weight, dimensions, warranty, seller rating, and competition level.

## Features

- 🎨 Modern, responsive UI with gradient backgrounds
- 📊 Interactive price prediction with confidence charts
- ⚠️ Anomaly detection for unusual product characteristics
- 📱 Mobile-friendly design
- 🚀 Ready for Netlify deployment

## Project Structure

```
project2/
├── index.html          # Main HTML file (moved to root for Netlify)
├── static/
│   ├── style.css      # Beautiful styling with gradients
│   └── script.js      # Demo prediction logic
├── _redirects          # Netlify routing configuration
├── netlify.toml        # Netlify build configuration
├── app.py              # Flask backend (not used on Netlify)
└── models/             # ML model files (not used on Netlify)
```

## Deployment

### Netlify (Recommended for static hosting)
1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy automatically - no build command needed
4. Netlify will serve the static files from the root directory

### Local Development
- Open `index.html` in your browser
- The app works with demo prediction logic
- No backend required for basic functionality

## How It Works

The application uses client-side JavaScript to:
- Collect user input for product features
- Calculate estimated prices based on category and feature weights
- Detect anomalies in product characteristics
- Display results with confidence charts
- Provide a responsive, interactive user experience

## Note

This is a demo version that works without a backend. For production use with real ML predictions, you would need to:
1. Deploy the Flask backend (`app.py`) to a Python hosting service
2. Update the JavaScript to make API calls to your hosted backend
3. Use the trained models in the `models/` directory
# SkillcredProject
