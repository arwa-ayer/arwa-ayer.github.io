# Instructions pour Claude Code

Ce dépôt contient deux projets indépendants :
- la racine (`index.html`, `assets/`) : l'app Planning Poker compilée, à ne pas toucher sauf demande explicite ;
- `studio/` : la création de vidéos TikTok avec Nano Banana.

## Vidéos TikTok avec Nano Banana

L'utilisatrice veut que Claude Code fasse tout lui-même, sans page web ni connexion TikTok :

1. Quand elle demande un scénario, écrire un scénario TikTok (accroche dans les 2 premières secondes ;
   pour chaque scène : `image_prompt` en anglais, `text` court en français, `duration` en secondes ;
   plus une `caption` avec hashtags). Le montrer **dans le chat** et attendre sa validation.
2. Une fois le scénario validé, l'enregistrer en JSON et lancer :
   `python3 studio/make_video.py scenario.json --out <dossier>/video.mp4 [--ref felix-happy.jpg] [--music son.mp3]`
   (images générées par Nano Banana = `gemini-2.5-flash-image`, montage ffmpeg 1080x1920).
3. Envoyer la vidéo dans la discussion (SendUserFile) avec la légende à copier. Elle la publie elle-même sur TikTok.

Contraintes :
- 100 % gratuit : utiliser uniquement `gemini-2.5-flash-image` (pas le modèle Pro payant), pas de Veo.
- La clé Gemini est enregistrée comme secret réseau de l'environnement pour
  `generativelanguage.googleapis.com` (en-tête `x-goog-api-key`) ; le proxy l'injecte. Ne jamais la demander dans le chat.
- Répondre en français.
