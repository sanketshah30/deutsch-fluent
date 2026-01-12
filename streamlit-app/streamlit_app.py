import streamlit as st
import google.generativeai as genai
from audio_recorder_streamlit import audio_recorder
import os
from datetime import datetime
import json

# Page config
st.set_page_config(
    page_title="Deutsch Üben - Workplace Practice",
    page_icon="🇩🇪",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for chat interface
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Serif+4:wght@600;700&display=swap');
    
    /* Hide Streamlit default elements */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    
    /* Base styling */
    .stApp {
        background-color: #faf9f7;
        font-family: 'Inter', system-ui, sans-serif;
        color: #1e293b !important;
    }
    
    h1, h2, h3, h4 {
        font-family: 'Source Serif 4', Georgia, serif;
        color: #1e293b !important;
    }
    
    /* German Stripe */
    .german-stripe {
        width: 100%;
        height: 4px;
        background: linear-gradient(90deg, #000000 0%, #000000 33%, #DD0000 33%, #DD0000 66%, #FFCE00 66%, #FFCE00 100%);
        margin: 0;
        padding: 0;
    }
    
    /* Chat bubble styling */
    .chat-bubble {
        max-width: 85%;
        border-radius: 16px;
        padding: 12px 16px;
        margin-bottom: 16px;
        word-wrap: break-word;
    }
    
    .chat-bubble-user {
        background-color: #2563eb;
        color: white !important;
        margin-left: auto;
        border-bottom-right-radius: 4px;
        text-align: left;
    }
    
    .chat-bubble-assistant {
        background-color: #f1f5f9;
        color: #1e293b !important;
        margin-right: auto;
        border-bottom-left-radius: 4px;
    }
    
    .chat-translation {
        font-size: 12px;
        font-style: italic;
        margin-top: 8px;
        opacity: 0.7;
        color: #64748b !important;
    }
    
    /* Context banner */
    .context-banner {
        background-color: rgba(37, 99, 235, 0.05);
        border-bottom: 1px solid rgba(37, 99, 235, 0.1);
        padding: 12px 16px;
    }
    
    /* Practice header */
    .practice-header {
        background: white;
        border-bottom: 1px solid #e2e8f0;
        padding: 12px 16px;
        position: sticky;
        top: 0;
        z-index: 10;
    }
    
    /* Input container */
    .chat-input-container {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 9999px;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    }
    
    /* Text input */
    .stTextInput > div > div > input {
        background: transparent;
        border: none;
        outline: none;
        font-size: 14px;
        color: #1e293b !important;
    }
    
    .stTextInput > div > div > input::placeholder {
        color: #94a3b8;
    }
    
    /* Ensure ALL text is visible - comprehensive rules */
    body, .stApp {
        color: #1e293b !important;
    }
    
    /* All text elements */
    p, span, div, h1, h2, h3, h4, h5, h6, a, li, ul, ol, strong, em, b, i {
        color: #1e293b !important;
    }
    
    /* Streamlit markdown - very specific */
    .stMarkdown {
        color: #1e293b !important;
    }
    
    .stMarkdown p, .stMarkdown div, .stMarkdown h1, .stMarkdown h2, .stMarkdown h3, .stMarkdown h4, .stMarkdown span, .stMarkdown strong, .stMarkdown em {
        color: #1e293b !important;
    }
    
    /* Streamlit containers */
    .element-container, .stText, .stMarkdown, .stContainer, .block-container {
        color: #1e293b !important;
    }
    
    .element-container p, .element-container div, .element-container span, .element-container h1, .element-container h2, .element-container h3 {
        color: #1e293b !important;
    }
    
    /* Sidebar - white text on dark background */
    [data-testid="stSidebar"] {
        background-color: #1e293b !important;
        color: white !important;
    }
    
    [data-testid="stSidebar"] p, [data-testid="stSidebar"] div, [data-testid="stSidebar"] h1, [data-testid="stSidebar"] h2, [data-testid="stSidebar"] h3, [data-testid="stSidebar"] h4, [data-testid="stSidebar"] span, [data-testid="stSidebar"] strong, [data-testid="stSidebar"] em {
        color: white !important;
    }
    
    /* Sidebar buttons */
    [data-testid="stSidebar"] .stButton > button {
        color: white !important;
        background-color: rgba(255, 255, 255, 0.1) !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }
    
    [data-testid="stSidebar"] .stButton > button:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
        color: white !important;
    }
    
    /* Sidebar radio buttons */
    [data-testid="stSidebar"] .stRadio label, [data-testid="stSidebar"] .stRadio > label {
        color: white !important;
    }
    
    /* Sidebar markdown */
    [data-testid="stSidebar"] .stMarkdown, [data-testid="stSidebar"] .stMarkdown *, [data-testid="stSidebar"] .stMarkdown p, [data-testid="stSidebar"] .stMarkdown div, [data-testid="stSidebar"] .stMarkdown h1, [data-testid="stSidebar"] .stMarkdown h2, [data-testid="stSidebar"] .stMarkdown h3, [data-testid="stSidebar"] .stMarkdown h4 {
        color: white !important;
    }
    
    /* Sidebar separators */
    [data-testid="stSidebar"] hr {
        border-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    /* Sidebar containers and text elements */
    [data-testid="stSidebar"] .element-container, [data-testid="stSidebar"] .block-container {
        color: white !important;
    }
    
    [data-testid="stSidebar"] .element-container p, [data-testid="stSidebar"] .element-container div, [data-testid="stSidebar"] .element-container span, [data-testid="stSidebar"] .element-container h1, [data-testid="stSidebar"] .element-container h2, [data-testid="stSidebar"] .element-container h3 {
        color: white !important;
    }
    
    /* Button text - white text on all buttons */
    .stButton > button {
        color: white !important;
    }
    
    .stButton > button:not([kind="primary"]) {
        background-color: #1e293b !important;
        border: 1px solid rgba(255, 255, 255, 0.2) !important;
    }
    
    .stButton > button:not([kind="primary"]):hover {
        background-color: #334155 !important;
        color: white !important;
    }
    
    .stButton > button[kind="primary"] {
        color: white !important;
    }
    
    .stButton > button[kind="primary"]:hover {
        color: white !important;
    }
    
    /* Button text content */
    .stButton > button span, .stButton > button div, .stButton > button p {
        color: white !important;
    }
    
    /* Radio buttons */
    .stRadio > label, .stRadio label {
        color: #1e293b !important;
    }
    
    /* Text input labels and all labels */
    label, .stTextInput label, .stTextArea label, .stSelectbox label {
        color: #1e293b !important;
    }
    
    /* Info boxes */
    .stInfo, .stInfo p, .stInfo div, .stSuccess, .stSuccess p, .stWarning, .stWarning p, .stError, .stError p {
        color: #1e293b !important;
    }
    
    /* Expander */
    .streamlit-expanderHeader, .streamlit-expanderHeader p, .streamlit-expanderHeader div {
        color: #1e293b !important;
    }
    
    /* Metric */
    .stMetric, .stMetric label, .stMetric div {
        color: #1e293b !important;
    }
    
    /* Column content */
    [data-testid="column"] p, [data-testid="column"] div, [data-testid="column"] span, [data-testid="column"] h1, [data-testid="column"] h2, [data-testid="column"] h3 {
        color: #1e293b !important;
    }
    
    /* Exception: User chat bubbles should be white */
    .chat-bubble-user, .chat-bubble-user p, .chat-bubble-user div, .chat-bubble-user span {
        color: white !important;
    }
    
    /* Exception: Primary buttons should be white */
    .stButton > button[kind="primary"], .stButton > button[kind="primary"] span {
        color: white !important;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'current_screen' not in st.session_state:
    st.session_state.current_screen = 'landing'
if 'selected_scenario' not in st.session_state:
    st.session_state.selected_scenario = None
if 'user_response' not in st.session_state:
    st.session_state.user_response = ""
if 'feedback_data' not in st.session_state:
    st.session_state.feedback_data = None
if 'progress' not in st.session_state:
    st.session_state.progress = []
if 'current_turn' not in st.session_state:
    st.session_state.current_turn = 0
if 'conversation_history' not in st.session_state:
    st.session_state.conversation_history = []
if 'language' not in st.session_state:
    st.session_state.language = 'de'  # 'de' for German, 'en' for English
if 'chat_messages' not in st.session_state:
    st.session_state.chat_messages = []

# Configure Gemini
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Translations
TRANSLATIONS = {
    'de': {
        'app_title': '🇩🇪 Deutsch Üben',
        'subtitle': 'Workplace Conversation Practice',
        'start_practice': '🚀 Start Practice',
        'choose_scenario': '📚 Choose a Practice Scenario',
        'select_scenario': 'Select a conversation scenario to practice:',
        'level': 'Level',
        'formality': 'Formality',
        'practice': 'Practice',
        'back': 'Back',
        'skip': 'Skip',
        'your_response': 'Your Response',
        'type_response': 'Type your response...',
        'submit': 'Submit',
        'back_to_scenarios': 'Back to Scenarios',
        'continue_conversation': 'Continue Conversation',
        'new_scenario': 'New Scenario',
        'try_again': 'Try Again',
        'view_progress': 'View Progress',
        'feedback': 'Feedback',
        'what_worked': 'What Worked Well',
        'improve': 'Area to Improve',
        'suggested': 'Suggested Response',
        'your_progress': 'Your Practice Progress',
        'no_sessions': 'No practice sessions yet. Start practicing to see your progress!',
        'total_sessions': 'Total Sessions',
        'average_score': 'Average Score',
        'recent_sessions': 'Recent Practice Sessions',
        'sessions_today': 'Sessions Today',
        'home': 'Home',
        'scenarios': 'Scenarios',
        'progress': 'Progress',
    },
    'en': {
        'app_title': '🇩🇪 Practice German',
        'subtitle': 'Workplace Conversation Practice',
        'start_practice': '🚀 Start Practice',
        'choose_scenario': '📚 Choose a Practice Scenario',
        'select_scenario': 'Select a conversation scenario to practice:',
        'level': 'Level',
        'formality': 'Formality',
        'practice': 'Practice',
        'back': 'Back',
        'skip': 'Skip',
        'your_response': 'Your Response',
        'type_response': 'Type your response...',
        'submit': 'Submit',
        'back_to_scenarios': 'Back to Scenarios',
        'continue_conversation': 'Continue Conversation',
        'new_scenario': 'New Scenario',
        'try_again': 'Try Again',
        'view_progress': 'View Progress',
        'feedback': 'Feedback',
        'what_worked': 'What Worked Well',
        'improve': 'Area to Improve',
        'suggested': 'Suggested Response',
        'your_progress': 'Your Practice Progress',
        'no_sessions': 'No practice sessions yet. Start practicing to see your progress!',
        'total_sessions': 'Total Sessions',
        'average_score': 'Average Score',
        'recent_sessions': 'Recent Practice Sessions',
        'sessions_today': 'Sessions Today',
        'home': 'Home',
        'scenarios': 'Scenarios',
        'progress': 'Progress',
    }
}

def t(key: str) -> str:
    """Get translation for current language"""
    lang = st.session_state.language
    return TRANSLATIONS.get(lang, TRANSLATIONS['en']).get(key, key)

# Scenarios data with English translations
SCENARIOS = {
    "small_talk": {
        "title": "Small Talk mit Kollegen",
        "title_en": "Small talk with colleagues",
        "context": "Sie sind in der Kaffeepause. Ein Kollege spricht Sie an...",
        "context_en": "You are on a coffee break. A colleague speaks to you...",
        "difficulty": "Anfänger",
        "difficulty_en": "Beginner",
        "formality": "Du",
        "icon": "☕",
        "prompts": [
            {"german": "Wie war dein Wochenende?", "english": "How was your weekend?"},
            {"german": "Hast du etwas Schönes gemacht?", "english": "Did you do something nice?"}
        ]
    },
    "explain_task": {
        "title": "Aufgabe erklären",
        "title_en": "Explaining a task",
        "context": "Ihr Teamkollege fragt Sie nach den Details eines Projekts...",
        "context_en": "Your colleague asks you about the details of a project...",
        "difficulty": "Fortgeschritten",
        "difficulty_en": "Advanced",
        "formality": "Sie",
        "icon": "📋",
        "prompts": [
            {"german": "Können Sie mir erklären, wie dieser Prozess funktioniert?", "english": "Can you explain to me how this process works?"},
            {"german": "Welche Schritte sind am wichtigsten?", "english": "Which steps are most important?"}
        ]
    },
    "answer_question": {
        "title": "Frage beantworten",
        "title_en": "Answering questions",
        "context": "Ihr Manager fragt Sie nach dem Status Ihrer Arbeit...",
        "context_en": "Your manager asks you about the status of your work...",
        "difficulty": "Fortgeschritten",
        "difficulty_en": "Advanced",
        "formality": "Sie",
        "icon": "💼",
        "prompts": [
            {"german": "Wie läuft das Projekt?", "english": "How is the project going?"},
            {"german": "Gibt es irgendwelche Probleme?", "english": "Are there any problems?"}
        ]
    },
    "ask_help": {
        "title": "Um Hilfe bitten",
        "title_en": "Asking for help",
        "context": "Sie brauchen Unterstützung von einem Kollegen...",
        "context_en": "You need support from a colleague...",
        "difficulty": "Anfänger",
        "difficulty_en": "Beginner",
        "formality": "Du/Sie",
        "icon": "🤝",
        "prompts": [
            {"german": "Kannst du mir kurz helfen?", "english": "Can you help me briefly?"},
            {"german": "Womit brauchst du Hilfe?", "english": "What do you need help with?"}
        ]
    },
    "introduce": {
        "title": "Sich vorstellen",
        "title_en": "Introducing yourself",
        "context": "Es ist Ihr erster Tag im neuen Büro. Sie treffen Ihr Team...",
        "context_en": "It's your first day in the new office. You meet your team...",
        "difficulty": "Anfänger",
        "difficulty_en": "Beginner",
        "formality": "Sie",
        "icon": "👋",
        "prompts": [
            {"german": "Hallo! Wie heißen Sie?", "english": "Hello! What's your name?"},
            {"german": "Was ist Ihre Rolle hier?", "english": "What is your role here?"}
        ]
    }
}

def get_ai_feedback(scenario_key, prompt, user_response, conversation_history=[]):
    """Generate AI feedback using Gemini API"""
    
    try:
        scenario = SCENARIOS[scenario_key]
        
        # Build conversation context
        context_str = ""
        if conversation_history:
            context_str = "Previous conversation:\n"
            for turn in conversation_history:
                context_str += f"Prompt: {turn['prompt']}\nUser: {turn['response']}\n\n"
        
        system_prompt = f"""You are a German language tutor providing feedback on workplace conversation practice.

Scenario: {scenario['title']}
Context: {scenario['context']}
Formality: {scenario['formality']}
Difficulty: {scenario['difficulty']}

{context_str}

Current Prompt: "{prompt}"
User Response: "{user_response}"

Provide feedback in this exact JSON format:
{{
    "relevance_score": <1-5>,
    "transcript": "{user_response}",
    "what_worked": ["point 1", "point 2"],
    "improvement": "one specific improvement area",
    "suggested_response": "a better German response",
    "score_explanation": "brief explanation of score"
}}

Evaluate:
1. Relevance to the prompt (1-5)
2. Appropriateness of formality ({scenario['formality']})
3. Grammar and vocabulary
4. Cultural appropriateness for German workplace

Be encouraging but specific. Focus on practical improvements."""

        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(system_prompt)
        
        # Extract JSON from response
        response_text = response.text.strip()
        
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        response_text = response_text.strip()
        
        feedback = json.loads(response_text)
        return feedback
        
    except Exception as e:
        st.error(f"Error generating feedback: {str(e)}")
        # Fallback feedback
        return {
            "relevance_score": 3,
            "transcript": user_response,
            "what_worked": ["Sie haben geantwortet", "Die Antwort ist verständlich"],
            "improvement": "Versuchen Sie, mehr Details hinzuzufügen",
            "suggested_response": "Eine natürlichere Antwort wäre hilfreich",
            "score_explanation": "Gute Grundlage, aber es gibt Raum für Verbesserungen"
        }

def landing_page():
    """Landing page with app introduction"""
    lang = st.session_state.language
    
    title_text = t('app_title')
    subtitle_text = t('subtitle')
    
    st.markdown(f"""
        <h1 style='text-align: center; color: #1f77b4 !important;'>{title_text}</h1>
        <h3 style='text-align: center; color: #666 !important;'>{subtitle_text}</h3>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        if lang == 'en':
            content = """
            <div style='color: #1e293b !important;'>
            <h3 style='color: #1e293b !important;'>Practice German workplace conversations with confidence</h3>
            
            <p style='color: #1e293b !important;'>✅ <strong>Low-pressure environment</strong> - Practice without judgment</p>
            <p style='color: #1e293b !important;'>✅ <strong>Instant AI feedback</strong> - Get specific improvement tips</p>
            <p style='color: #1e293b !important;'>✅ <strong>Real scenarios</strong> - Work-relevant conversations</p>
            <p style='color: #1e293b !important;'>✅ <strong>Your pace</strong> - Practice anytime, anywhere</p>
            
            <p style='color: #1e293b !important;'>Perfect for professionals who can read German but want to improve speaking confidence.</p>
            </div>
            """
        else:
            content = """
            <div style='color: #1e293b !important;'>
            <h3 style='color: #1e293b !important;'>Üben Sie deutsche Gespräche am Arbeitsplatz mit Selbstvertrauen</h3>
            
            <p style='color: #1e293b !important;'>✅ <strong>Entspannte Umgebung</strong> - Üben Sie ohne Beurteilung</p>
            <p style='color: #1e293b !important;'>✅ <strong>Sofortiges KI-Feedback</strong> - Erhalten Sie spezifische Verbesserungstipps</p>
            <p style='color: #1e293b !important;'>✅ <strong>Echte Szenarien</strong> - Arbeitsrelevante Gespräche</p>
            <p style='color: #1e293b !important;'>✅ <strong>Ihr Tempo</strong> - Üben Sie jederzeit, überall</p>
            
            <p style='color: #1e293b !important;'>Perfekt für Fachkräfte, die Deutsch lesen können, aber ihr Sprechvertrauen verbessern möchten.</p>
            </div>
            """
        
        st.markdown(content, unsafe_allow_html=True)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        if st.button(t('start_practice'), type="primary", use_container_width=True):
            st.session_state.current_screen = 'scenarios'
            st.rerun()

def scenario_selection():
    """Scenario selection screen"""
    lang = st.session_state.language
    
    st.markdown(f"<h2 style='color: #1e293b !important;'>{t('choose_scenario')}</h2>", unsafe_allow_html=True)
    st.markdown(f"<p style='color: #1e293b !important;'>{t('select_scenario')}</p>", unsafe_allow_html=True)
    
    cols = st.columns(3)
    
    for idx, (key, scenario) in enumerate(SCENARIOS.items()):
        with cols[idx % 3]:
            with st.container():
                scenario_title = scenario.get('title_en' if lang == 'en' else 'title', scenario['title'])
                scenario_difficulty = scenario.get('difficulty_en' if lang == 'en' else 'difficulty', scenario['difficulty'])
                scenario_context = scenario.get('context_en' if lang == 'en' else 'context', scenario['context'])
                
                st.markdown(f"<h3 style='color: #1e293b !important;'>{scenario['icon']} {scenario_title}</h3>", unsafe_allow_html=True)
                st.markdown(f"<p style='color: #1e293b !important;'><strong>{t('level')}:</strong> {scenario_difficulty}</p>", unsafe_allow_html=True)
                st.markdown(f"<p style='color: #1e293b !important;'><strong>{t('formality')}:</strong> {scenario['formality']}</p>", unsafe_allow_html=True)
                st.markdown(f"<p style='color: #64748b !important; font-style: italic;'>{scenario_context[:60]}...</p>", unsafe_allow_html=True)
                
                if st.button(t('practice'), key=f"btn_{key}", use_container_width=True):
                    st.session_state.selected_scenario = key
                    st.session_state.current_screen = 'practice'
                    st.session_state.current_turn = 0
                    st.session_state.conversation_history = []
                    st.session_state.chat_messages = []
                    st.rerun()
    
    st.markdown("---")
    
    # Show progress
    if st.session_state.progress:
        st.markdown(f"<h3 style='color: #1e293b !important;'>📊 {t('your_progress')}</h3>", unsafe_allow_html=True)
        for entry in st.session_state.progress[-5:]:
            st.markdown(f"<p style='color: #1e293b !important;'>✓ {entry['scenario']} - Score: {entry['score']}/5 - {entry['date']}</p>", unsafe_allow_html=True)

def practice_screen():
    """Main practice screen with chat-like UI"""
    scenario_key = st.session_state.selected_scenario
    scenario = SCENARIOS[scenario_key]
    turn = st.session_state.current_turn
    lang = st.session_state.language
    
    # Get scenario text based on language
    scenario_title = scenario.get('title_en' if lang == 'en' else 'title', scenario['title'])
    scenario_context = scenario.get('context_en' if lang == 'en' else 'context', scenario['context'])
    
    # Initialize chat messages if starting new conversation
    if turn == 0 and len(st.session_state.chat_messages) == 0:
        prompts = scenario['prompts']
        current_prompt = prompts[0]
        st.session_state.chat_messages = [{
            'type': 'assistant',
            'german': current_prompt['german'],
            'english': current_prompt.get('english', '')
        }]
    
    # German Stripe
    st.markdown('<div class="german-stripe"></div>', unsafe_allow_html=True)
    
    # Header with navigation
    st.markdown("""
    <div class="practice-header">
        <div style="max-width: 672px; margin: 0 auto; padding: 0 16px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns([2, 4, 2])
    with col1:
        if st.button("← " + t('back'), key="back_btn", use_container_width=True):
            st.session_state.current_screen = 'scenarios'
            st.session_state.chat_messages = []
            st.rerun()
    with col2:
        st.markdown(f"<h2 style='text-align: center; margin: 0; font-family: \"Source Serif 4\", serif; font-size: 18px; font-weight: 600; color: #1e293b !important;'>{scenario_title}</h2>", unsafe_allow_html=True)
    with col3:
        prompts = scenario['prompts']
        if turn < len(prompts) - 1:
            if st.button("▷| " + t('skip'), key="skip_btn", use_container_width=True):
                st.session_state.current_turn += 1
                current_prompt = prompts[st.session_state.current_turn]
                st.session_state.chat_messages.append({
                    'type': 'assistant',
                    'german': current_prompt['german'],
                    'english': current_prompt.get('english', '')
                })
                st.rerun()
    
    st.markdown("</div></div></div>", unsafe_allow_html=True)
    
    # Context Banner
    st.markdown(f"""
    <div class="context-banner">
        <div style="max-width: 672px; margin: 0 auto; padding: 0 16px;">
            <div style="display: flex; align-items: center; gap: 8px; font-size: 14px;">
                <span style="font-size: 18px;">📍</span>
                <p style="margin: 0; color: rgba(30, 41, 59, 0.8);">{scenario_context}</p>
            </div>
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Chat area
    st.markdown("""
    <div style="flex: 1; overflow-y: auto; padding: 24px 0;">
        <div style="max-width: 672px; margin: 0 auto; padding: 0 16px;">
    """, unsafe_allow_html=True)
    
    # Display chat messages
    for msg in st.session_state.chat_messages:
        if msg['type'] == 'assistant':
            # Assistant bubble (left, muted background)
            german = msg.get('german', '')
            english = msg.get('english', '')
            display_text = english if lang == 'en' and english else german
            translation_text = german if lang == 'en' and english else english
            
            st.markdown(f"""
            <div style="display: flex; justify-content: flex-start; margin-bottom: 16px;">
                <div class="chat-bubble chat-bubble-assistant" style="max-width: 85%;">
                    <div style="display: flex; align-items: flex-start; gap: 8px;">
                        <div style="flex: 1;">
                            <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #1e293b !important;">{display_text}</p>
                            {f'<p class="chat-translation" style="margin: 8px 0 0 0; color: #64748b !important;">{translation_text}</p>' if translation_text else ''}
                        </div>
                        <button onclick="speakGerman('{german.replace("'", "\\'")}')" style="background: none; border: none; cursor: pointer; padding: 4px; flex-shrink: 0; opacity: 0.7;">🔊</button>
                    </div>
                </div>
            </div>
            """, unsafe_allow_html=True)
        elif msg['type'] == 'user':
            # User bubble (right, blue background)
            st.markdown(f"""
            <div style="display: flex; justify-content: flex-end; margin-bottom: 16px;">
                <div class="chat-bubble chat-bubble-user" style="max-width: 85%;">
                    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: white !important;">{msg['content']}</p>
                </div>
            </div>
            """, unsafe_allow_html=True)
    
    st.markdown("</div></div>", unsafe_allow_html=True)
    
    # Input area (sticky bottom)
    st.markdown("""
    <div style="background: white; border-top: 1px solid #e2e8f0; position: sticky; bottom: 0; padding: 16px 0;">
        <div style="max-width: 672px; margin: 0 auto; padding: 0 16px;">
            <div class="chat-input-container">
    """, unsafe_allow_html=True)
    
    # Chat input with mic and send
    input_col1, input_col2, input_col3 = st.columns([0.3, 7.4, 1.3])
    
    with input_col1:
        st.markdown("""
        <div style="display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            <span style="font-size: 20px; cursor: pointer;">🎤</span>
        </div>
        """, unsafe_allow_html=True)
    
    with input_col2:
        response_text = st.text_input(
            t('type_response'),
            placeholder=t('type_response'),
            key="chat_input",
            label_visibility="collapsed"
        )
    
    with input_col3:
        send_button = st.button("➤", key="send_btn", use_container_width=True, type="primary")
    
    st.markdown("</div></div></div>", unsafe_allow_html=True)
    
    # JavaScript for text-to-speech
    st.markdown("""
    <script>
    function speakGerman(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'de-DE';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }
    </script>
    """, unsafe_allow_html=True)
    
    # Handle message submission
    if send_button and response_text:
        prompts = scenario['prompts']
        current_prompt_obj = prompts[min(turn, len(prompts)-1)]
        current_prompt = current_prompt_obj['german'] if isinstance(current_prompt_obj, dict) else current_prompt_obj
        
        # Add user message
        st.session_state.chat_messages.append({
            'type': 'user',
            'content': response_text
        })
        
        # Generate feedback
        with st.spinner("Analyzing your response..." if lang == 'en' else "Analysiere Ihre Antwort..."):
            feedback = get_ai_feedback(
                scenario_key,
                current_prompt,
                response_text,
                st.session_state.conversation_history
            )
            st.session_state.feedback_data = feedback
            st.session_state.user_response = response_text
        
        # Add to conversation history
        st.session_state.conversation_history.append({
            'prompt': current_prompt,
            'response': response_text
        })
        
        # Save progress
        if len(st.session_state.progress) == 0 or st.session_state.progress[-1]['response'] != response_text:
            st.session_state.progress.append({
                'scenario': scenario_title,
                'score': feedback['relevance_score'],
                'date': datetime.now().strftime("%Y-%m-%d %H:%M"),
                'response': response_text
            })
        
        # Check if there are more prompts
        if turn < len(prompts) - 1:
            st.session_state.current_turn += 1
            next_prompt = prompts[st.session_state.current_turn]
            st.session_state.chat_messages.append({
                'type': 'assistant',
                'german': next_prompt['german'],
                'english': next_prompt.get('english', '')
            })
        else:
            # Show feedback screen
            st.session_state.current_screen = 'feedback'
        
        st.rerun()

def feedback_screen():
    """Feedback display screen"""
    feedback = st.session_state.feedback_data
    scenario_key = st.session_state.selected_scenario
    scenario = SCENARIOS[scenario_key]
    lang = st.session_state.language
    
    scenario_title = scenario.get('title_en' if lang == 'en' else 'title', scenario['title'])
    
    st.markdown(f"<h2 style='color: #1e293b !important;'>📊 {t('feedback')}: {scenario_title}</h2>", unsafe_allow_html=True)
    
    # Score display
    score = feedback['relevance_score']
    score_color = "#4caf50" if score >= 4 else "#ff9800" if score >= 3 else "#f44336"
    
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown(f"""
        <div style='text-align: center; padding: 30px; background-color: {score_color}; color: white; border-radius: 15px;'>
            <h1 style='margin: 0; font-size: 60px;'>{score}/5</h1>
            <p style='margin: 5px 0 0 0; font-size: 18px;'>{feedback.get('score_explanation', '')}</p>
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Your response
    st.markdown(f"<h3 style='color: #1e293b !important;'>📝 {t('your_response')}</h3>", unsafe_allow_html=True)
    st.info(feedback['transcript'])
    
    # Feedback sections
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown(f"<h3 style='color: #1e293b !important;'>✅ {t('what_worked')}</h3>", unsafe_allow_html=True)
        for point in feedback['what_worked']:
            st.success(f"• {point}")
    
    with col2:
        st.markdown(f"<h3 style='color: #1e293b !important;'>⚠️ {t('improve')}</h3>", unsafe_allow_html=True)
        st.warning(f"• {feedback['improvement']}")
    
    st.markdown(f"<h3 style='color: #1e293b !important;'>💡 {t('suggested')}</h3>", unsafe_allow_html=True)
    st.markdown(f"<div style='background-color: #f0f7ff; padding: 15px; border-radius: 10px; border-left: 4px solid #1f77b4; color: #1e293b !important;'>\"{feedback['suggested_response']}\"</div>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Save progress
    if len(st.session_state.progress) == 0 or st.session_state.progress[-1]['response'] != st.session_state.user_response:
        st.session_state.progress.append({
            'scenario': scenario_title,
            'score': score,
            'date': datetime.now().strftime("%Y-%m-%d %H:%M"),
            'response': st.session_state.user_response
        })
    
    # Action buttons
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🔄 " + t('try_again'), use_container_width=True):
            st.session_state.current_screen = 'practice'
            st.session_state.chat_messages = []
            st.session_state.current_turn = 0
            st.rerun()
    
    with col2:
        # Check if there are more turns
        scenario_prompts = scenario['prompts']
        if st.session_state.current_turn < len(scenario_prompts) - 1:
            if st.button("➡️ " + t('continue_conversation'), type="primary", use_container_width=True):
                st.session_state.current_turn += 1
                st.session_state.current_screen = 'practice'
                st.rerun()
        else:
            if st.button("🎯 " + t('new_scenario'), type="primary", use_container_width=True):
                st.session_state.current_screen = 'scenarios'
                st.session_state.chat_messages = []
                st.rerun()
    
    with col3:
        if st.button("📊 " + t('view_progress'), use_container_width=True):
            st.session_state.current_screen = 'progress'
            st.rerun()

def progress_screen():
    """Progress tracking screen"""
    st.markdown(f"<h2 style='color: #1e293b !important;'>📊 {t('your_progress')}</h2>", unsafe_allow_html=True)
    
    if not st.session_state.progress:
        st.info(t('no_sessions'))
    else:
        st.markdown(f"<h3 style='color: #1e293b !important;'>{t('total_sessions')}: {len(st.session_state.progress)}</h3>", unsafe_allow_html=True)
        
        # Calculate average score
        avg_score = sum([p['score'] for p in st.session_state.progress]) / len(st.session_state.progress)
        st.metric(t('average_score'), f"{avg_score:.1f}/5")
        
        st.markdown("---")
        st.markdown(f"<h3 style='color: #1e293b !important;'>{t('recent_sessions')}</h3>", unsafe_allow_html=True)
        
        for entry in reversed(st.session_state.progress):
            with st.expander(f"{entry['scenario']} - {entry['score']}/5 - {entry['date']}"):
                st.markdown(f"<p style='color: #1e293b !important;'><strong>{t('your_response')}:</strong> {entry['response']}</p>", unsafe_allow_html=True)
    
    if st.button("⬅️ " + t('back_to_scenarios'), use_container_width=True):
        st.session_state.current_screen = 'scenarios'
        st.rerun()

# Main app router
def main():
    # Sidebar
    with st.sidebar:
        st.markdown(f"<h3 style='color: white !important;'>{t('app_title')}</h3>", unsafe_allow_html=True)
        st.markdown(f"<p style='color: white !important;'>{t('subtitle')}</p>", unsafe_allow_html=True)
        st.markdown("---")
        
        # Language Toggle
        st.markdown("<h3 style='color: white !important;'>🌐 Language</h3>", unsafe_allow_html=True)
        lang_options = ['🇩🇪 Deutsch', '🇬🇧 English']
        current_lang_idx = 0 if st.session_state.language == 'de' else 1
        selected_lang = st.radio(
            "Select language:",
            lang_options,
            index=current_lang_idx,
            key="lang_selector",
            label_visibility="collapsed"
        )
        
        # Update language
        new_lang = 'de' if selected_lang == '🇩🇪 Deutsch' else 'en'
        if new_lang != st.session_state.language:
            st.session_state.language = new_lang
            st.rerun()
        
        st.markdown("---")
        
        if st.button("🏠 " + t('home')):
            st.session_state.current_screen = 'landing'
            st.rerun()
        
        if st.button("📚 " + t('scenarios')):
            st.session_state.current_screen = 'scenarios'
            st.rerun()
        
        if st.button("📊 " + t('progress')):
            st.session_state.current_screen = 'progress'
            st.rerun()
        
        st.markdown("---")
        st.markdown(f"<p style='color: white !important;'><strong>{t('sessions_today')}:</strong> {str(len(st.session_state.progress))}</p>", unsafe_allow_html=True)
    
    # Route to correct screen
    if st.session_state.current_screen == 'landing':
        landing_page()
    elif st.session_state.current_screen == 'scenarios':
        scenario_selection()
    elif st.session_state.current_screen == 'practice':
        practice_screen()
    elif st.session_state.current_screen == 'feedback':
        feedback_screen()
    elif st.session_state.current_screen == 'progress':
        progress_screen()

if __name__ == "__main__":
    main()