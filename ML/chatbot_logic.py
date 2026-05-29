import datetime
import random

try:
    from sklearn.feature_extraction.text import TfidfVectorizer
    from sklearn.linear_model import LogisticRegression
    from sklearn.pipeline import Pipeline
except ModuleNotFoundError:
    TfidfVectorizer = None
    LogisticRegression = None
    Pipeline = None


INTENT_EXAMPLES = {
    "greeting": [
        "hi",
        "hello",
        "hey",
        "good morning",
        "is anyone there",
        "can you help me",
    ],
    "farewell": [
        "bye",
        "goodbye",
        "see you later",
        "thanks bye",
        "take care",
    ],
    "booking": [
        "how do I book assistance",
        "book wheelchair support",
        "book luggage ferry",
        "reserve station help",
        "create a booking",
        "need help for my journey",
    ],
    "wheelchair": [
        "wheelchair help",
        "disabled passenger assistance",
        "differently abled support",
        "elderly passenger needs escort",
        "senior citizen assistance",
        "mobility support at station",
    ],
    "payment": [
        "payment failed",
        "can I pay by upi",
        "card payment",
        "pay at station",
        "transaction problem",
        "payment method",
    ],
    "refund": [
        "cancel my booking",
        "refund status",
        "cancellation request",
        "money back",
        "cancel assistance",
    ],
    "delay": [
        "train delayed",
        "arrival time changed",
        "late train",
        "schedule issue",
        "ferry delay",
    ],
    "route": [
        "route to platform",
        "where should driver come",
        "pickup point",
        "drop point",
        "station route",
        "destination station",
    ],
    "contact": [
        "contact support",
        "phone number",
        "email address",
        "help desk contact",
        "call railaid",
    ],
    "complaint": [
        "complaint",
        "feedback",
        "bad service",
        "staff did not arrive",
        "suggestion",
    ],
    "login": [
        "login issue",
        "staff login",
        "admin login",
        "cannot access account",
        "register account",
    ],
    "id_lookup": [
        "booking id",
        "pnr",
        "ticket number",
        "find my booking",
        "where is my request",
    ],
}

RESPONSES = {
    "greeting": [
        "Hello. How can RailAid help you today?",
        "Hi there. Do you need help with booking or station support?",
        "Welcome back. What can I help you with?",
    ],
    "farewell": [
        "Goodbye. Have a safe and comfortable journey.",
        "See you soon. Safe travels.",
        "Take care, and reach out again if you need station support.",
    ],
    "booking": [
        "Use Book Assistance, enter journey details, pickup and drop points, passenger type, luggage, and payment option.",
        "For a new request, open Book Assistance and confirm the booking after reviewing the fare.",
        "For special assistance, select senior citizen or differently abled in the booking form.",
    ],
    "wheelchair": [
        "RailAid supports wheelchair assistance, boarding help, luggage ferry, and station guidance at listed stations.",
        "Choose senior citizen or differently abled in the booking form so the request receives priority handling.",
        "Wheelchair and escort support can be requested from Book Assistance.",
    ],
    "payment": [
        "RailAid supports UPI, card, and pay-at-station options in the booking flow.",
        "If payment fails, wait a few minutes and contact support with your transaction details.",
        "Pay-at-station confirms the request first and collects payment on arrival.",
    ],
    "refund": [
        "Cancellation and refund requests are handled by support. Keep your booking ID ready.",
        "Refund review starts after cancellation details are shared with support.",
        "Please share your booking ID or PNR with support for cancellation help.",
    ],
    "delay": [
        "If your train or ferry is delayed, update support so the assistance slot can be adjusted.",
        "For official train delays, check live rail status and keep your booking ID ready.",
        "RailAid staff can adjust assistance timing when delay details are shared.",
    ],
    "route": [
        "Please provide your pickup and drop point. RailAid assigns an optimized station route after booking.",
        "The booking confirmation shows driver ETA, vehicle, and optimized route summary.",
        "Station availability can be checked before booking, then route guidance appears after assignment.",
    ],
    "contact": [
        "You can email support@railaid.com for help.",
        "Call +91 123 456 7890 for RailAid support.",
        "You can also use this chat for booking, service, and payment questions.",
    ],
    "complaint": [
        "I am sorry for the inconvenience. Please share what happened and include your booking ID if you have one.",
        "You can send feedback to support@railaid.com with booking or transaction details.",
        "Please describe the issue so the support team can review it properly.",
    ],
    "login": [
        "Passenger login is available from the menu. Staff and admin access have separate login pages.",
        "Use Staff Login only for RailAid operations accounts.",
        "Admins can sign in from Admin Login. Passenger users should use Login or Register.",
    ],
    "id_lookup": [
        "Please keep your PNR or booking ID ready when contacting support.",
        "Booking lookup inside chat is not enabled yet, but support can help if you share the ID.",
        "Use your ticket number, PNR, or registered email when asking support about a booking.",
    ],
    "fallback": [
        "I did not fully understand that. Try asking about booking, payment, refund, wheelchair support, route, or station availability.",
        "Could you rephrase that with a little more detail?",
        "I can help best with RailAid services, booking, payment, refund, route, or station assistance questions.",
    ],
}


def build_classifier():
    if Pipeline is None:
        return None

    texts = []
    labels = []

    for intent, examples in INTENT_EXAMPLES.items():
        texts.extend(examples)
        labels.extend([intent] * len(examples))

    classifier = Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1, 2), min_df=1)),
        ("model", LogisticRegression(max_iter=500)),
    ])
    classifier.fit(texts, labels)
    return classifier


CLASSIFIER = build_classifier()


def classify_intent(user_input):
    if CLASSIFIER is None:
        scores = {}
        words = set(user_input.split())

        for intent, examples in INTENT_EXAMPLES.items():
            scores[intent] = sum(
                len(words.intersection(example.split())) for example in examples
            )

        best_intent = max(scores, key=scores.get)
        return best_intent if scores[best_intent] > 0 else "fallback"

    probabilities = CLASSIFIER.predict_proba([user_input])[0]
    best_index = probabilities.argmax()
    confidence = probabilities[best_index]
    intent = CLASSIFIER.classes_[best_index]
    return intent if confidence >= 0.18 else "fallback"


def chatbot_response(user_input):
    user_input = str(user_input or "").lower().strip()

    if not user_input:
        return "Tell me what you need help with: booking, wheelchair support, payment, refund, route, or station assistance."

    if "time" in user_input:
        return f"The current time is {datetime.datetime.now().strftime('%I:%M %p')}."

    intent = classify_intent(user_input)
    return random.choice(RESPONSES.get(intent, RESPONSES["fallback"]))
