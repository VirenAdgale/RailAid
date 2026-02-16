import random # for random responses
import datetime # to get current time

def chatbot_response(user_input):   
    user_input = user_input.lower().strip() # normalize input

    greetings = ["hi", "hello", "hey", "good morning", "good evening"] 
    farewells = ["bye", "goodbye", "see you", "take care"]

    # Common keywords
    help_words = ["help", "support", "problem", "issue", "train", "booking", "ticket"]
    cancellation_words = ["cancel", "cancellation", "refund"]
    delay_words = ["delay", "late", "timing", "schedule"]
    facilities_words = ["wheelchair", "assistance", "disabled", "support staff", "help desk"]
    payment_words = ["payment", "upi", "card", "failed", "transaction"]
    complaint_words = ["complaint", "feedback", "suggestion"]
    contact_words = ["contact", "email", "phone", "number"]
    id_words = ["id", "pnr", "ticket number"]
    route_words = ["route", "destination", "station", "train number"]
    login_words = ["login", "staff login", "admin login", "account"]

    # Time-based greeting
    current_hour = datetime.datetime.now().hour # get current hour
    if "time" in user_input:
        return f"The current time is {datetime.datetime.now().strftime('%I:%M %p')}."

    # GREETINGS
    if any(word in user_input for word in greetings):
        return random.choice([
            "Hello! 👋 How can I assist you today?",
            "Hi there! Need help with something?",
            "Hey! What can I do for you?",
            "Good to see you again! How can RailAid support you today?"
        ])
    
    # FAREWELLS
    elif any(word in user_input for word in farewells):
        return random.choice([
            "Goodbye! Have a safe and pleasant journey! 🚆",
            "See you soon! Safe travels!",
            "Take care and travel safe with RailAid!"
        ])
    
    # HELP REQUEST
    elif any(word in user_input for word in help_words):
        return random.choice([
            "I can help with booking, cancellations, refunds, or support requests.",
            "Please describe your problem — for example: ‘I want to cancel my booking’ or ‘train delay info’.",
            "Sure! Tell me if your issue is with ticket booking, payment, or something else."
        ])

    # BOOKING
    elif "book" in user_input or "booking" in user_input:
        return random.choice([
            "You can book assistance through the 'Book Assistance' page in the menu.",
            "To book special assistance, go to the Booking section and fill in your travel details.",
            "Sure! Click on 'Book Assistance' from the navbar to proceed with your booking."
        ])
    
    # CANCELLATION / REFUND
    elif any(word in user_input for word in cancellation_words):
        return random.choice([
            "You can cancel your assistance booking through your account dashboard.",
            "Refunds are processed within 3–5 business days after cancellation.",
            "Need to cancel? Please provide your booking ID or PNR to proceed."
        ])
    
    # TRAIN DELAYS OR STATUS
    elif any(word in user_input for word in delay_words):
        return random.choice([
            "Train delays can be checked on the official Indian Railways website or RailAid's live status section.",
            "If your train is delayed, RailAid will automatically update your assistance timing.",
            "You can check train timing updates using your PNR or train number."
        ])
    
    # FACILITIES / ACCESSIBILITY
    elif any(word in user_input for word in facilities_words):
        return random.choice([
            "We provide wheelchair assistance, boarding support, and help desk guidance at major stations.",
            "Yes, RailAid supports disabled passengers with on-ground staff help.",
            "Please specify your assistance type — wheelchair, boarding, or escort support?"
        ])
    
    # PAYMENT ISSUES
    elif any(word in user_input for word in payment_words):
        return random.choice([
            "If your payment failed, please wait 10–15 minutes. It usually auto-reflects.",
            "You can raise a refund request through the 'Support' section with your transaction ID.",
            "RailAid supports UPI, credit/debit cards, and net banking for payments."
        ])

    # LOGIN / ACCOUNT
    elif any(word in user_input for word in login_words):
        return random.choice([
            "For staff login, go to the 'Staff Login' page in the menu.",
            "Admins can log in using the 'Admin Login' page.",
            "If you forgot your password, click on 'Forgot Password' on the login page."
        ])
    
    # CONTACT / COMPLAINTS
    elif any(word in user_input for word in contact_words):
        return random.choice([
            "You can contact our support team at support@railaid.in.",
            "Reach us on our helpline: +91-1800-111-222 (24/7).",
            "Our help desk is available at all major railway stations for in-person support."
        ])
    
    elif any(word in user_input for word in complaint_words):
        return random.choice([
            "We’re sorry for the inconvenience. Please describe your issue and we’ll help resolve it.",
            "You can submit feedback or complaints on the Support page or email support@railaid.in.",
            "Please share details of your complaint so our support team can investigate."
        ])
    
    # PNR / ID Queries
    elif any(word in user_input for word in id_words):
        return random.choice([
            "Please provide your PNR or Booking ID to check your booking details.",
            "PNR lookup feature is coming soon in RailAid! Stay tuned.",
            "You can view booking status using your ticket number or registered email."
        ])
    
    # ROUTE / STATION INFO
    elif any(word in user_input for word in route_words):
        return random.choice([
            "You can check routes and stations on the Indian Railways website.",
            "Please provide your source and destination stations for accurate route details.",
            "Route tracking is available under the Services section."
        ])

    # DEFAULT FALLBACK
    else:
        return random.choice([
            "I'm sorry, I didn’t understand that. Could you rephrase or give more details?",
            "Can you clarify your question? I’ll do my best to help.",
            "Hmm... I’m not sure about that. Try asking about booking, refund, or delay."
        ])
