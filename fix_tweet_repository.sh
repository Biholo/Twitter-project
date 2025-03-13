#!/bin/bash

# Sauvegarde du fichier original
cp /Users/bakayokomoussa/Desktop/Twitter-project/backend/src/repositories/tweetRepository.ts /Users/bakayokomoussa/Desktop/Twitter-project/backend/src/repositories/tweetRepository.ts.bak

# Remplacer interaction_type par action_type
sed -i '' 's/interaction_type/action_type/g' /Users/bakayokomoussa/Desktop/Twitter-project/backend/src/repositories/tweetRepository.ts

# Remplacer save par bookmark
sed -i '' 's/\"save\"/\"bookmark\"/g' /Users/bakayokomoussa/Desktop/Twitter-project/backend/src/repositories/tweetRepository.ts

# Ajouter is_retweeted dans la projection finale
sed -i '' 's/is_saved: 1,/is_saved: 1,\n        is_retweeted: 1,/g' /Users/bakayokomoussa/Desktop/Twitter-project/backend/src/repositories/tweetRepository.ts

echo "Modifications terminées. Vérifiez le fichier tweetRepository.ts"
