import array
import io
import math
import wave

RECIPES = (
    ("quiet-pulse", "Тихий импульс", (130.81, 164.81, 196.0), 0.4),
    ("after-rain", "После дождя", (146.83, 174.61, 220.0), 0.3),
    ("northern-light", "Северный свет", (164.81, 196.0, 246.94), 0.5),
    ("evening-orbit", "Вечерняя орбита", (110.0, 130.81, 164.81), 0.25),
    ("warm-air", "Тёплый воздух", (174.61, 220.0, 261.63), 0.35),
    ("slow-tide", "Медленный прилив", (98.0, 123.47, 146.83), 0.2),
)


def synthesize(frequencies: tuple[float, ...], pulse: float, seconds: int = 60) -> bytes:
    rate = 8000
    samples = array.array("h")
    for index in range(rate * seconds):
        t = index / rate
        fade = min(1, t / 2, (seconds - t) / 2)
        envelope = 0.5 + 0.5 * math.sin(2 * math.pi * pulse * t) ** 2
        sound = sum(
            math.sin(2 * math.pi * f * t) + 0.15 * math.sin(4 * math.pi * f * t)
            for f in frequencies
        ) / len(frequencies)
        samples.append(round(5000 * sound * envelope * max(0, fade)))
    import sys

    if sys.byteorder != "little":
        samples.byteswap()
    buffer = io.BytesIO()
    with wave.open(buffer, "wb") as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(rate)
        output.writeframes(samples.tobytes())
    return buffer.getvalue()
