from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
import os

app = Flask(__name__)

# Render Environment Variable se key bypass karke fetch karega
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY") 

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-1.5-flash')
else:
    print("WARNING: API Key not found in environment!")

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/agent', methods=['POST'])
def agent():
    data = request.json
    prompt = data.get('prompt', '')
    
    try:
        response = model.generate_content(prompt)
        clean_text = response.text.replace('**', '').replace('*', '') 
        return jsonify({"success": True, "message": clean_text})
    except Exception as e:
        return jsonify({"success": False, "message": f"API Error: {str(e)}"})

if __name__ == '__main__':
    # Render ke liye port 10000 ya dynamic port assign karna padta hai
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
