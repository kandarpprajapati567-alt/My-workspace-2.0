from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

# ---------------------------------------------------------
# 1. GEMINI AI CONFIGURATION 
# ---------------------------------------------------------
# Tumhari di hui API key yahan set kar di gayi hai:
GEMINI_API_KEY = "AQ.Ab8RN6L1boYHUIihQ4f643ebFjwoVx8_zwB0nfxqXWuTLSi3Fw" 
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# ---------------------------------------------------------
# 2. RENDER THE UI
# ---------------------------------------------------------
@app.route('/')
def home():
    # Yeh templates folder se tumhara index.html load karega
    return render_template('index.html')

# ---------------------------------------------------------
# 3. AI CHAT ENDPOINT
# ---------------------------------------------------------
@app.route('/api/agent', methods=['POST'])
def agent():
    data = request.json
    prompt = data.get('prompt', '')
    
    try:
        # Call Gemini AI
        response = model.generate_content(prompt)
        # Extract text and remove bolding for voice synthesizer
        clean_text = response.text.replace('**', '').replace('*', '') 
        return jsonify({"success": True, "message": clean_text})
    except Exception as e:
        return jsonify({"success": False, "message": f"API Error: {str(e)}"})

# ---------------------------------------------------------
# 4. SYSTEM CONTROL ENDPOINT (OS / Manual Control)
# ---------------------------------------------------------
@app.route('/api/system', methods=['POST'])
def system_control():
    data = request.json
    command = data.get('command', '')

    try:
        if command == 'open_notepad':
            os.system('notepad.exe')
            return jsonify({"success": True, "message": "Notepad opened successfully, sir."})
        
        elif command == 'open_calculator':
            os.system('calc.exe')
            return jsonify({"success": True, "message": "Calculator is live on your screen."})
            
        elif command == 'open_youtube':
            os.system('start https://www.youtube.com') 
            return jsonify({"success": True, "message": "Opening YouTube mainframe."})

        else:
            return jsonify({"success": False, "message": "System command not recognized."})
            
    except Exception as e:
        return jsonify({"success": False, "message": f"Error executing system command: {str(e)}"})

if __name__ == '__main__':
    print("⚡ JARVIS SERVER ONLINE: http://127.0.0.1:5000")
    app.run(debug=True, port=5000)
