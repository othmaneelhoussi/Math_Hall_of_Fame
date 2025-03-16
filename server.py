# OTHMANE EL HOUSSI
import random
from flask import Flask
from flask import render_template
from flask import Response, request, jsonify
import re
app = Flask(__name__)

mathematicians = [
  {
    "id": "0",
    "name": "Euclid",
    "image": "images/euclid.jpg",
    "birth_year": "-300",
    "small_bio": "Greek mathematician known as the 'Father of Geometry'. His work 'Elements' laid the foundation for Euclidean geometry.",
    "contributions": ["Euclidean Geometry", "Parallel Postulate", "Prime Number Theorem Contributions"],
    "similar_maths_ids": ["1", "2", "3"]
  },
  {
    "id": "1",
    "name": "Isaac Newton",
    "image": "images/newton.jpg",
    "birth_year": "1643",
    "small_bio": "English mathematician and physicist, co-inventor of calculus and formulator of the laws of motion and universal gravitation.",
    "contributions": ["Laws of Motion", "Universal Gravitation", "Development of Calculus"],
    "similar_maths_ids": ["0", "2", "4"]
  },
  {
    "id": "2",
    "name": "Carl Friedrich Gauss",
    "image": "images/gauss.jpg",
    "birth_year": "1777",
    "small_bio": "German mathematician known as the 'Prince of Mathematicians', with major contributions to number theory and statistics.",
    "contributions": ["Gaussian Distribution", "Modular Arithmetic", "Prime Number Theorem"],
    "similar_maths_ids": ["0", "1", "5"]
  },
  {
    "id": "3",
    "name": "Leonhard Euler",
    "image": "images/euler.jpg",
    "birth_year": "1707",
    "small_bio": "Swiss mathematician who pioneered graph theory and introduced many modern mathematical notations, including 'e'.",
    "contributions": ["Euler's Formula", "Graph Theory", "Basel Problem Solution"],
    "similar_maths_ids": ["0", "4", "6"]
  },
  {
    "id": "4",
    "name": "Joseph Fourier",
    "image": "images/fourier.jpg",
    "birth_year": "1768",
    "small_bio": "French mathematician known for Fourier analysis, which transformed the study of heat transfer and signal processing.",
    "contributions": ["Fourier Transform", "Heat Equation", "Signal Processing Applications"],
    "similar_maths_ids": ["1", "3", "5"]
  },
  {
    "id": "5",
    "name": "Henri Poincaré",
    "image": "images/poincare.jpg",
    "birth_year": "1854",
    "small_bio": "French mathematician who laid the foundations of topology and dynamical systems, and formulated the Poincaré Conjecture.",
    "contributions": ["Poincaré Conjecture", "Celestial Mechanics", "Chaos Theory"],
    "similar_maths_ids": ["2", "4", "7"]
  },
  {
    "id": "6",
    "name": "Emmy Noether",
    "image": "images/noether.jpg",
    "birth_year": "1882",
    "small_bio": "German mathematician who made groundbreaking contributions to abstract algebra and formulated Noether's Theorem in physics.",
    "contributions": ["Noether's Theorem", "Abstract Algebra", "Ring Theory"],
    "similar_maths_ids": ["3", "7", "8"]
  },
  {
    "id": "7",
    "name": "Kurt Gödel",
    "image": "images/godel.jpg",
    "birth_year": "1906",
    "small_bio": "Austrian logician and mathematician, known for Gödel's Incompleteness Theorems, which revolutionized mathematical logic.",
    "contributions": ["Incompleteness Theorems", "Set Theory Contributions", "Gödel Numbering"],
    "similar_maths_ids": ["5", "6", "9"]
  },
  {
    "id": "8",
    "name": "John von Neumann",
    "image": "images/von_neumann.jpg",
    "birth_year": "1903",
    "small_bio": "Hungarian-American mathematician who contributed to game theory, quantum mechanics, and computer science.",
    "contributions": ["Minimax Theorem", "Von Neumann Architecture", "Cellular Automata"],
    "similar_maths_ids": ["6", "7", "9"]
  },
  {
    "id": "9",
    "name": "Andrew Wiles",
    "image": "images/wiles.jpg",
    "birth_year": "1953",
    "small_bio": "British mathematician who proved Fermat's Last Theorem, solving a 350-year-old problem in number theory.",
    "contributions": ["Fermat's Last Theorem Proof", "Elliptic Curves", "Modular Forms"],
    "similar_maths_ids": ["7", "8"]
  }
]


@app.route('/')
def index():
   return render_template('welcome.html')   

@app.route('/get_random_mathematicians', methods=['GET'])
def get_random_mathematicians():
    random_selection = random.sample(mathematicians, 3)
    return jsonify(random = random_selection)

import re

@app.route('/search/<keywords>', methods=['GET'])
def search(keywords):
    try:
        keywords = keywords.strip()
        if not keywords:
            return jsonify({"error": "Search term cannot be empty"}), 400

        #ensure that the search term is escaped to prevent issues in the regex
        escaped_keywords = re.escape(keywords.lower())

        #function to wrap matched keywords in <b> tags
        def highlight_text(text):
            return re.sub(r'(' + escaped_keywords + r')', r'[<b>\1</b>]', text, flags=re.IGNORECASE)

        matching_items = [
            item for item in mathematicians
            if (keywords.lower() in str(item.get("name", "")).lower() or
                keywords.lower() in str(item.get("small_bio", "")).lower() or
                any(keywords.lower() in str(contribution).lower() for contribution in item.get("contributions", [])))
        ]

        #highlight matched text in name, bio, and contributions
        for item in matching_items:
            item["new_name"] = highlight_text(item.get("name", ""))
            item["new_small_bio"] = highlight_text(item.get("small_bio", ""))
            item["new_contributions"] = [
                highlight_text(contribution) for contribution in item.get("contributions", [])
            ]

        return render_template('search_results.html', results=matching_items, keywords=keywords, number=len(matching_items))

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing the search."}), 500


@app.route('/view/<int:id>')
def math_details(id):
    try:
        mathematician = next((item for item in mathematicians if item['id'] == str(id)), None)
        
        if mathematician:
            similar_maths = [item for item in mathematicians if item['id'] in mathematician['similar_maths_ids']]
            return render_template('math-details.html', mathematician=mathematician, similar_maths=similar_maths)
        else:
            return "Mathematician not found", 404
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "An error occurred while processing the request."}), 500


if __name__ == '__main__':
   app.run(debug = True, port=5001)
