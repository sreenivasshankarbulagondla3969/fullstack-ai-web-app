import os
from PIL import Image, UnidentifiedImageError

ALLOWED_FORMATS = {"JPEG", "PNG", "WEBP", "GIF"}

def analyze_image(stream):
    try:
        # Verify the uploaded bytes are a real image, then reopen for dimensions.
        image = Image.open(stream)
        image.verify()
        stream.seek(0)
        image = Image.open(stream)
        image_format = (image.format or "").upper()
        if image_format not in ALLOWED_FORMATS:
            raise ValueError("Supported image formats: JPEG, PNG, WEBP, and GIF.")
        width, height = image.size
        if width < 1 or height < 1 or width * height > 40_000_000:
            raise ValueError("Image dimensions are invalid or too large.")
    except (UnidentifiedImageError, OSError, ValueError) as exc:
        if isinstance(exc, ValueError) and str(exc).startswith("Supported"):
            raise
        raise ValueError("The uploaded file is not a valid supported image.") from exc

    enabled = os.getenv("ENABLE_IMAGE_MODEL", "false").lower() == "true"
    if enabled:
        try:
            from transformers import pipeline
            # Lazy cache to avoid loading the model on every request.
            global _classifier
            try:
                classifier = _classifier
            except NameError:
                _classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
                classifier = _classifier
            stream.seek(0)
            image = Image.open(stream).convert("RGB")
            prediction = classifier(image, top_k=1)[0]
            return {
                "width": width, "height": height, "format": image_format,
                "label": prediction["label"],
                "model_used": "google/vit-base-patch16-224"
            }
        except Exception as exc:
            raise ValueError(
                "The optional image model could not load. Check transformers/torch installation and network access, "
                "or set ENABLE_IMAGE_MODEL=false. Details: " + str(exc)[:180]
            ) from exc

    return {
        "width": width,
        "height": height,
        "format": image_format,
        "label": "Image analyzed (classifier disabled)",
        "model_used": "metadata-only"
    }
