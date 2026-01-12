import streamlit as st
import anthropic
from audio_recorder_streamlit import audio_recorder
import os
from datetime import datetime

# Page config
st.set_page_config(
    page_title="Deutsch Üben - Workplace Practice",
    page_icon="🇩🇪",
    layout="wide"
)

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

# Scenarios data
SCENARIOS = {
    "small_talk": {
        "title": "Small Talk mit Kollegen",
        "context": "Sie sind in der Kaffeepause. Ein Kollege spricht Sie an...",
        "difficulty": "Anfänger",
        "formality": "Du",
        "icon": "☕",
        "prompts": [
            "Wie war dein Wochenende?",
            "Hast du etwas Schönes gemacht?"
        ]
    },
    "explain_task": {
        "title": "Aufgabe erklären",
        "context": "Ihr Teamkollege fragt Sie nach den Details eines Projekts...",
        "difficulty": "Fortgeschritten",
        "formality": "Sie",
        "icon": "📋",
        "prompts": [
            "Können Sie mir erklären, wie dieser Prozess funktioniert?",
            "Welche Schritte sind am wichtigsten?"
        ]
    },
    "answer_question": {
        "title": "Frage beantworten",
        "context": "Ihr Manager fragt Sie nach dem Status Ihrer Arbeit...",
        "difficulty": "Fortgeschritten",
        "formality": "Sie",
        "icon": "💼",
        "prompts": [
            "Wie läuft das Projekt?",
            "Gibt es irgendwelche Probleme?"
        ]
    },
    "ask_help": {
        "title": "Um Hilfe bitten",
        "context": "Sie brauchen Unterstützung von einem Kollegen...",
        "difficulty": "Anfänger",
        "formality": "Du/Sie",
        "icon": "🤝",
        "prompts": [
            "Kannst du mir kurz helfen?",
            "Womit brauchst du Hilfe?"
        ]
    },
    "introduce": {
        "title": "Sich vorstellen",
        "context": "Es ist Ihr erster Tag im neuen Büro. Sie treffen Ihr Team...",
        "difficulty": "Anfänger",
        "formality": "Sie",
        "icon": "👋",
        "prompts": [
            "Hallo! Wie heißen Sie?",
            "Was ist Ihre Rolle hier?"
        ]
    }
}

def get_ai_feedback(scenario_key, prompt, user_response, conversation_history=[]):
    """Generate AI feedback using Claude API"""
    
    client = anthropic.Anthropic(api_key=os.environ.get("ANTHROPIC_API_KEY"))
    
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

    message = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1000,
        messages=[
            {"role": "user", "content": system_prompt}
        ]
    )
    
    # Parse response
    import json
    try:
        feedback = json.loads(message.content[0].text)
        return feedback
    except:
        # Fallback if JSON parsing fails
        return {
            "relevance_score": 3,
            "transcript": user_response,
            "what_worked": ["Sie haben geantwortet"],
            "improvement": "Versuchen Sie, mehr Details hinzuzufügen",
            "suggested_response": "Eine natürlichere Antwort wäre hilfreich",
            "score_explanation": "Feedback wird generiert..."
        }

def landing_page():
    """Landing page with app introduction"""
    st.markdown("""
        <h1 style='text-align: center; color: #1f77b4;'>🇩🇪 Deutsch Üben</h1>
        <h3 style='text-align: center; color: #666;'>Workplace Conversation Practice</h3>
    """, unsafe_allow_html=True)
    
    st.markdown("---")
    
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown("""
        ### Practice German workplace conversations with confidence
        
        ✅ **Low-pressure environment** - Practice without judgment  
        ✅ **Instant AI feedback** - Get specific improvement tips  
        ✅ **Real scenarios** - Work-relevant conversations  
        ✅ **Your pace** - Practice anytime, anywhere
        
        Perfect for professionals who can read German but want to improve speaking confidence.
        """)
        
        st.markdown("<br>", unsafe_allow_html=True)
        
        if st.button("🚀 Start Practice", type="primary", use_container_width=True):
            st.session_state.current_screen = 'scenarios'
            st.rerun()

def scenario_selection():
    """Scenario selection screen"""
    st.markdown("## 📚 Choose a Practice Scenario")
    st.markdown("Select a conversation scenario to practice:")
    
    cols = st.columns(3)
    
    for idx, (key, scenario) in enumerate(SCENARIOS.items()):
        with cols[idx % 3]:
            with st.container():
                st.markdown(f"### {scenario['icon']} {scenario['title']}")
                st.markdown(f"**Level:** {scenario['difficulty']}")
                st.markdown(f"**Formality:** {scenario['formality']}")
                st.markdown(f"*{scenario['context'][:60]}...*")
                
                if st.button(f"Practice", key=f"btn_{key}", use_container_width=True):
                    st.session_state.selected_scenario = key
                    st.session_state.current_screen = 'practice'
                    st.session_state.current_turn = 0
                    st.session_state.conversation_history = []
                    st.rerun()
    
    st.markdown("---")
    
    # Show progress
    if st.session_state.progress:
        st.markdown("### 📊 Your Progress")
        for entry in st.session_state.progress[-5:]:
            st.markdown(f"✓ {entry['scenario']} - Score: {entry['score']}/5 - {entry['date']}")

def practice_screen():
    """Main practice screen"""
    scenario_key = st.session_state.selected_scenario
    scenario = SCENARIOS[scenario_key]
    turn = st.session_state.current_turn
    
    # Show context
    st.info(f"**Context:** {scenario['context']}")
    
    # Get current prompt
    prompts = scenario['prompts']
    current_prompt = prompts[min(turn, len(prompts)-1)]
    
    # Display prompt
    st.markdown(f"### 💬 Prompt {turn + 1}/{len(prompts)}")
    st.markdown(f"<div style='background-color: #e3f2fd; padding: 20px; border-radius: 10px; font-size: 20px;'>\"{current_prompt}\"</div>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Input method selection
    st.markdown("### Your Response:")
    input_method = st.radio("Choose input method:", ["Text Input", "Voice Recording"], horizontal=True)
    
    response_text = ""
    
    if input_method == "Text Input":
        response_text = st.text_area(
            "Type your response in German:",
            height=100,
            placeholder="Geben Sie hier Ihre Antwort ein..."
        )
    else:
        st.info("🎤 Voice recording feature - Click record and speak your response")
        audio_bytes = audio_recorder(text="Click to record", icon_size="2x")
        
        if audio_bytes:
            st.audio(audio_bytes, format="audio/wav")
            st.warning("⚠️ For demo: Voice transcription requires Whisper API. Using text input instead.")
            response_text = st.text_input("Or type your response:", placeholder="Geben Sie hier Ihre Antwort ein...")
        else:
            response_text = st.text_input("Or type your response:", placeholder="Geben Sie hier Ihre Antwort ein...")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        if st.button("⬅️ Back to Scenarios", use_container_width=True):
            st.session_state.current_screen = 'scenarios'
            st.rerun()
    
    with col2:
        if st.button("Submit Response ➡️", type="primary", disabled=not response_text, use_container_width=True):
            st.session_state.user_response = response_text
            
            # Generate feedback
            with st.spinner("Analyzing your response..."):
                feedback = get_ai_feedback(
                    scenario_key,
                    current_prompt,
                    response_text,
                    st.session_state.conversation_history
                )
                st.session_state.feedback_data = feedback
            
            # Add to conversation history
            st.session_state.conversation_history.append({
                'prompt': current_prompt,
                'response': response_text
            })
            
            st.session_state.current_screen = 'feedback'
            st.rerun()

def feedback_screen():
    """Feedback display screen"""
    feedback = st.session_state.feedback_data
    scenario_key = st.session_state.selected_scenario
    scenario = SCENARIOS[scenario_key]
    
    st.markdown(f"## 📊 Feedback: {scenario['title']}")
    
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
    st.markdown("### 📝 Your Response")
    st.info(feedback['transcript'])
    
    # Feedback sections
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### ✅ What Worked Well")
        for point in feedback['what_worked']:
            st.success(f"• {point}")
    
    with col2:
        st.markdown("### ⚠️ Area to Improve")
        st.warning(f"• {feedback['improvement']}")
    
    st.markdown("### 💡 Suggested Response")
    st.markdown(f"<div style='background-color: #f0f7ff; padding: 15px; border-radius: 10px; border-left: 4px solid #1f77b4;'>\"{feedback['suggested_response']}\"</div>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Save progress
    if len(st.session_state.progress) == 0 or st.session_state.progress[-1]['response'] != st.session_state.user_response:
        st.session_state.progress.append({
            'scenario': scenario['title'],
            'score': score,
            'date': datetime.now().strftime("%Y-%m-%d %H:%M"),
            'response': st.session_state.user_response
        })
    
    # Action buttons
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🔄 Try Again", use_container_width=True):
            st.session_state.current_screen = 'practice'
            st.rerun()
    
    with col2:
        # Check if there are more turns
        scenario_prompts = scenario['prompts']
        if st.session_state.current_turn < len(scenario_prompts) - 1:
            if st.button("➡️ Continue Conversation", type="primary", use_container_width=True):
                st.session_state.current_turn += 1
                st.session_state.current_screen = 'practice'
                st.rerun()
        else:
            if st.button("🎯 New Scenario", type="primary", use_container_width=True):
                st.session_state.current_screen = 'scenarios'
                st.rerun()
    
    with col3:
        if st.button("📊 View Progress", use_container_width=True):
            st.session_state.current_screen = 'progress'
            st.rerun()

def progress_screen():
    """Progress tracking screen"""
    st.markdown("## 📊 Your Practice Progress")
    
    if not st.session_state.progress:
        st.info("No practice sessions yet. Start practicing to see your progress!")
    else:
        st.markdown(f"### Total Sessions: {len(st.session_state.progress)}")
        
        # Calculate average score
        avg_score = sum([p['score'] for p in st.session_state.progress]) / len(st.session_state.progress)
        st.metric("Average Score", f"{avg_score:.1f}/5")
        
        st.markdown("---")
        st.markdown("### Recent Practice Sessions")
        
        for entry in reversed(st.session_state.progress):
            with st.expander(f"{entry['scenario']} - {entry['score']}/5 - {entry['date']}"):
                st.markdown(f"**Your response:** {entry['response']}")
    
    if st.button("⬅️ Back to Scenarios", use_container_width=True):
        st.session_state.current_screen = 'scenarios'
        st.rerun()

# Main app router
def main():
    # Sidebar
    with st.sidebar:
        st.markdown("### 🇩🇪 Deutsch Üben")
        st.markdown("Practice German workplace conversations")
        st.markdown("---")
        
        if st.button("🏠 Home"):
            st.session_state.current_screen = 'landing'
            st.rerun()
        
        if st.button("📚 Scenarios"):
            st.session_state.current_screen = 'scenarios'
            st.rerun()
        
        if st.button("📊 Progress"):
            st.session_state.current_screen = 'progress'
            st.rerun()
        
        st.markdown("---")
        st.markdown("**Sessions Today:** " + str(len(st.session_state.progress)))
    
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
