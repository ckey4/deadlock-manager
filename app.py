from flask import Flask, jsonify
import subprocess

app = Flask(__name__)

@app.route("/simulate")
def simulate():
    # Compile C++ program (optional: compile once on deploy)
    subprocess.run(["g++", "-std=c++14", "deadlock.cpp", "-o", "deadlock"], check=True)
    # Run C++ program
    result = subprocess.run(["./deadlock"], capture_output=True, text=True)
    return result.stdout

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
