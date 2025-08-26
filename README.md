# E-commerce Price Predictor with AI

A beautiful, intelligent web application for predicting e-commerce product prices using **Perplexity AI**. The app analyzes product features and provides realistic price predictions with confidence scores and anomaly detection.

## ✨ Features

- 🧠 **AI-Powered Predictions** - Uses Perplexity AI for intelligent price analysis
- 🎨 Modern, responsive UI with gradient backgrounds
- 📊 Interactive confidence charts and visualizations
- ⚠️ Smart anomaly detection for unusual products
- 📱 Mobile-friendly design
- 🚀 Ready for Netlify deployment
- 🔒 Secure API key management

## 🤖 AI Integration

The app now uses **Perplexity AI** to provide:
- **Realistic price predictions** based on market trends
- **Intelligent analysis** of product characteristics
- **Confidence scoring** based on data quality
- **Anomaly detection** for unusual product combinations
- **Market-aware pricing** considering competition and brand value

## 🏗️ Project Structure

```
project2/
├── index.html          # Main HTML file (moved to root for Netlify)
├── config.js           # API configuration (⚠️ contains API keys)
├── static/
│   ├── style.css      # Beautiful styling with gradients
│   └── script.js      # AI-powered prediction logic
├── _redirects          # Netlify routing configuration
├── netlify.toml        # Netlify build configuration
├── .gitignore          # Prevents sensitive files from being committed
├── app.py              # Flask backend (not used on Netlify)
└── models/             # ML model files (not used on Netlify)
```

## 🔐 Security & Configuration

### API Key Management
- **Never commit API keys to version control**
- The `config.js` file contains your Perplexity API key
- Add `config.js` to `.gitignore` for production use
- Use environment variables in production deployments

### Current Setup
The app is configured to work immediately with your Perplexity API key, but for production:
1. Move API keys to environment variables
2. Use a backend service to proxy API calls
3. Implement rate limiting and usage monitoring

## 🚀 Deployment

### Netlify (Recommended)
1. Push your code to GitHub (excluding `config.js`)
2. Connect your repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy automatically

### Local Development
- Open `index.html` in your browser
- The app works with real AI predictions
- Requires valid Perplexity API key

## 🧪 How It Works

1. **User Input** - Collects product features (category, ratings, dimensions, etc.)
2. **AI Analysis** - Sends data to Perplexity AI for intelligent analysis
3. **Price Prediction** - Receives realistic price estimates with confidence scores
4. **Anomaly Detection** - Identifies unusual product characteristics
5. **Visual Results** - Displays predictions with interactive charts

## 📊 AI Model Details

- **Model**: `llama-3.1-sonar-small-128k-online`
- **Temperature**: 0.3 (balanced creativity and consistency)
- **Max Tokens**: 500 (sufficient for detailed responses)
- **Fallback Logic**: Demo predictions if API fails

## ⚠️ Important Notes

1. **API Key Security**: Keep your Perplexity API key private
2. **Rate Limits**: Be aware of Perplexity API usage limits
3. **Cost Management**: Monitor API usage to control costs
4. **Fallback System**: App gracefully degrades if AI service is unavailable

## 🔧 Customization

- **Categories**: Add/modify product categories in the HTML
- **Features**: Extend the prediction model with additional parameters
- **Styling**: Customize colors and layout in `style.css`
- **AI Prompts**: Modify the prompt engineering in `script.js`

## 📈 Future Enhancements

- [ ] User authentication and prediction history
- [ ] Advanced analytics and trend analysis
- [ ] Multi-currency support
- [ ] Product image analysis
- [ ] Market comparison features
- [ ] Export and reporting capabilities
