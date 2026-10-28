from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

_analyzer = SentimentIntensityAnalyzer()

def analyze_sentiment(text: str) -> dict:
    scores = _analyzer.polarity_scores(text)
    compound = float(scores["compound"])
    if compound >= 0.05:
        label = "positive"
    elif compound <= -0.05:
        label = "negative"
    else:
        label = "neutral"
    return {
        "label": label,
        "score": round(abs(compound), 4),
        "scores": {key: round(float(value), 4) for key, value in scores.items()}
    }
