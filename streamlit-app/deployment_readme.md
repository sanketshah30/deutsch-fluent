# German Workplace Conversation Practice App

A Streamlit-based AI-powered conversation practice tool for professionals learning German.

## Quick Start

### 1. Local Development

```bash
# Clone or create project directory
mkdir german-practice-app
cd german-practice-app

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variable
export ANTHROPIC_API_KEY='your-api-key-here'  # Windows: set ANTHROPIC_API_KEY=your-api-key-here

# Run the app
streamlit run app.py
```

### 2. Deploy to Streamlit Cloud (Free & Easy)

**Step-by-step:**

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/german-practice-app.git
   git push -u origin main
   ```

2. **Deploy on Streamlit Cloud:**
   - Go to https://share.streamlit.io/
   - Sign in with GitHub
   - Click "New app"
   - Select your repository: `yourusername/german-practice-app`
   - Main file path: `app.py`
   - Click "Advanced settings"
   - Add secrets:
     ```toml
     ANTHROPIC_API_KEY = "your-api-key-here"
     ```
   - Click "Deploy"

3. **Your app will be live at:** `https://yourusername-german-practice-app.streamlit.app`

### 3. Alternative: Deploy to Heroku

**Create `Procfile`:**
```
web: streamlit run app.py --server.port=$PORT --server.address=0.0.0.0
```

**Deploy:**
```bash
heroku create your-app-name
heroku config:set ANTHROPIC_API_KEY='your-api-key-here'
git push heroku main
```

### 4. Alternative: Deploy to Railway

1. Go to https://railway.app/
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variable: `ANTHROPIC_API_KEY`
5. Railway auto-detects Streamlit and deploys

## Project Structure

```
german-practice-app/
├── app.py                 # Main Streamlit application
├── requirements.txt       # Python dependencies
├── README.md             # This file
└── .gitignore            # Git ignore file
```

## Key Features

✅ **5 Workplace Scenarios** - Small talk, explaining tasks, answering questions, asking for help, introductions
✅ **Dual Input Mode** - Text or voice recording
✅ **AI-Powered Feedback** - Powered by Claude API
✅ **Multi-Turn Conversations** - Practice realistic back-and-forth exchanges
✅ **Progress Tracking** - See your improvement over time
✅ **Formality Awareness** - Practice both "Sie" and "du" contexts

## Configuration

### Environment Variables

- `ANTHROPIC_API_KEY` (required) - Your Anthropic API key from https://console.anthropic.com/

### Getting an Anthropic API Key

1. Go to https://console.anthropic.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new key
5. Copy and use in your environment

## Cost Estimates

Using Claude Sonnet 4:
- ~500 tokens per feedback request
- ~$0.003 per practice session
- 1000 practice sessions = ~$3

## Customization

### Adding New Scenarios

Edit the `SCENARIOS` dictionary in `app.py`:

```python
SCENARIOS = {
    "your_scenario_key": {
        "title": "Your Scenario Title",
        "context": "Scenario context in German...",
        "difficulty": "Anfänger or Fortgeschritten",
        "formality": "Du, Sie, or Du/Sie",
        "icon": "🎯",
        "prompts": [
            "First prompt in German",
            "Second prompt for multi-turn"
        ]
    }
}
```

### Adjusting Feedback Criteria

Modify the `system_prompt` in the `get_ai_feedback()` function to emphasize:
- Grammar focus
- Cultural appropriateness
- Vocabulary level
- Pronunciation tips (if using voice)

## Troubleshooting

### Voice Recording Not Working
- Audio recording requires HTTPS in production
- Use text input as fallback
- For local dev, use `streamlit run app.py --server.enableXsrfProtection false`

### API Rate Limits
- Free tier: 50 requests/day
- Paid tier: Check your Anthropic console
- Add error handling for rate limit responses

### Deployment Issues
- Ensure `requirements.txt` includes all dependencies
- Check Python version compatibility (3.8+)
- Verify environment variables are set correctly

## Demo Video Checklist

When recording your Loom demo (2-3 minutes):

1. **Introduction (30s)**
   - "This is a German conversation practice tool for workplace scenarios"
   - Show landing page

2. **User Flow (90s)**
   - Select a scenario (e.g., "Small talk with colleagues")
   - Type/record a response
   - Show AI feedback with score, improvements, suggestions
   - Demonstrate retry feature
   - Show multi-turn conversation

3. **Value Proposition (30s)**
   - "Users get instant, specific feedback"
   - "Low-pressure practice environment"
   - "Workplace-relevant scenarios"

4. **Next Steps (30s)**
   - "Would add pronunciation feedback"
   - "Adaptive difficulty based on performance"
   - "More scenarios based on user industry"

## Tech Stack

- **Frontend:** Streamlit (Python web framework)
- **AI:** Anthropic Claude API (feedback generation)
- **Audio:** audio-recorder-streamlit (voice recording)
- **Deployment:** Streamlit Cloud (free hosting)

## License

MIT License - Feel free to use for your demo and extend as needed.

## Support

For issues or questions about this prototype, contact your development team or refer to:
- Streamlit docs: https://docs.streamlit.io/
- Anthropic docs: https://docs.anthropic.com/
