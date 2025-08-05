export async function autoTranslate(text, targetLang = 'id', sourceLang = 'en') {
  const res = await fetch('https://libretranslate.de/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      q: text,
      source: sourceLang,
      target: targetLang,
      format: 'text'
    })
  });

  const data = await res.json();
  return data.translatedText;
}
