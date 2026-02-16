import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import joblib

# ----------------------------
# STEP 1: Generate Synthetic Dataset
# ----------------------------

np.random.seed(42)

data_size = 1000

passenger_type = np.random.choice(
    ["adult", "senior", "differently_abled"], data_size
)

luggage_weight = np.random.randint(0, 50, data_size)
number_of_bags = np.random.randint(1, 6, data_size)
platform_change = np.random.choice([0, 1], data_size)
urgency_level = np.random.choice([0, 1], data_size)
is_peak_time = np.random.choice([0, 1], data_size)

# Rule-based labeling (for training data creation)
service_type = []

for i in range(data_size):
    if passenger_type[i] == "differently_abled":
        service_type.append("Wheelchair Ferry")
    elif luggage_weight[i] > 25 or number_of_bags[i] > 3:
        service_type.append("Heavy Luggage Ferry")
    elif urgency_level[i] == 1 and is_peak_time[i] == 1:
        service_type.append("Priority Ferry")
    else:
        service_type.append("Standard Ferry")

# Create DataFrame
df = pd.DataFrame({
    "passenger_type": passenger_type,
    "luggage_weight": luggage_weight,
    "number_of_bags": number_of_bags,
    "platform_change": platform_change,
    "urgency_level": urgency_level,
    "is_peak_time": is_peak_time,
    "service_type": service_type
})

# ----------------------------
# STEP 2: Encode Categorical Data
# ----------------------------

le_passenger = LabelEncoder()
le_service = LabelEncoder()

df["passenger_type"] = le_passenger.fit_transform(df["passenger_type"])
df["service_type"] = le_service.fit_transform(df["service_type"])

# ----------------------------
# STEP 3: Split Data
# ----------------------------

X = df.drop("service_type", axis=1)
y = df["service_type"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ----------------------------
# STEP 4: Train Random Forest Model
# ----------------------------
print(df.head())
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ----------------------------
# STEP 5: Evaluate Model
# ----------------------------

y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("Model Accuracy:", accuracy)

# ----------------------------
# STEP 6: Save Model & Encoders
# ----------------------------

joblib.dump(model, "ferry_recommendation_model.pkl")
joblib.dump(le_passenger, "passenger_encoder.pkl")
joblib.dump(le_service, "service_encoder.pkl")

print("Model and encoders saved successfully!")