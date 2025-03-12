import { ITweet } from "@/models/tweetModel";
import mongoose from 'mongoose';
import { fixtureIds } from "./userFixture";

// Garder les tweets originaux pour référence
const tweet1Id = new mongoose.Types.ObjectId();
const tweet2Id = new mongoose.Types.ObjectId();
const tweet3Id = new mongoose.Types.ObjectId();
const tweet4Id = new mongoose.Types.ObjectId();

export const tweetIds = {
  tweet1Id,
  tweet2Id,
  tweet3Id,
  tweet4Id
}

// Contenu varié par catégories thématiques
const tweetContentsByCategory = {
  tech: [
  "J'adore programmer en #TypeScript !",
  "Le développement web est fascinant #webdev",
  "Qui utilise encore #jQuery de nos jours ?",
  "React vs Angular vs Vue : le débat continue #frontend",
  "Node.js est incroyable pour le backend #nodejs",
  "MongoDB ou PostgreSQL ? #database",
  "Le cloud computing change tout #aws #azure",
  "L'intelligence artificielle va révolutionner notre façon de coder #AI",
  "Docker simplifie tellement le déploiement #devops",
  "Kubernetes est compliqué mais puissant #k8s",
  "GraphQL ou REST ? #api",
  "Le TDD améliore vraiment la qualité du code #testing",
  "Je viens de découvrir Deno, c'est prometteur ! #deno",
  "Les microservices ne sont pas toujours la solution #architecture",
  "Svelte est vraiment impressionnant #svelte",
  "Next.js simplifie tellement React #nextjs",
  "Tailwind CSS est devenu mon framework CSS préféré #css",
  "Les PWA sont l'avenir du mobile #pwa",
  "WebAssembly va changer le web #wasm",
  "TypeScript > JavaScript, change my mind #typescript"
  ],
  cinema: [
    "Je viens de voir le dernier Nolan, c'est incroyable ! #cinema",
    "Les films Marvel commencent à tous se ressembler #MCU",
    "Le cinéma français est sous-estimé à l'international #cinema",
    "Parasite méritait totalement son Oscar #BongJoonHo",
    "Les remakes de Disney manquent d'originalité #Disney",
    "Christopher Nolan est le meilleur réalisateur de sa génération #Nolan",
    "Le Seigneur des Anneaux reste la meilleure trilogie de tous les temps #LOTR",
    "Dune part 2 est visuellement époustouflant #Dune",
    "Les films d'horreur sont de plus en plus psychologiques #horreur",
    "Quentin Tarantino a révolutionné le cinéma des années 90 #Tarantino",
    "Le cinéma indépendant mérite plus d'attention #indiefilm",
    "Avatar 2 valait-il vraiment l'attente ? #Avatar",
    "Les Oscars sont-ils encore pertinents ? #Oscars",
    "Le streaming a changé notre façon de consommer les films #Netflix",
    "Miyazaki est un génie de l'animation #Ghibli"
  ],
  sport: [
    "Incroyable match hier soir ! #football",
    "Les JO de Paris s'annoncent spectaculaires #Paris2024",
    "Le PSG doit revoir sa stratégie en Ligue des Champions #PSG",
    "Mbappé est-il le meilleur joueur du monde actuellement ? #Mbappe",
    "La F1 devient de plus en plus passionnante #F1",
    "Le tennis français a besoin d'un nouveau souffle #RolandGarros",
    "Le rugby est sous-médiatisé en France #Rugby",
    "Les Warriors peuvent-ils retrouver leur niveau ? #NBA",
    "Le cyclisme est un sport qui mérite plus de respect #TourDeFrance",
    "La boxe moderne n'est plus ce qu'elle était #boxe",
    "Le handball français reste une référence mondiale #handball",
    "Les sports extrêmes gagnent en popularité #extreme",
    "L'e-sport est-il vraiment un sport ? #esport",
    "Le dopage reste un problème majeur dans le sport de haut niveau #dopage",
    "Les athlètes féminines méritent la même couverture médiatique #sportfeminin"
  ],
  architecture: [
    "L'architecture brutaliste est fascinante #brutalisme",
    "Les gratte-ciels de Dubaï défient les lois de la physique #Dubai",
    "L'architecture durable est l'avenir de la construction #ecologie",
    "Le Bauhaus a révolutionné notre vision du design #Bauhaus",
    "Les bâtiments de Gaudi sont des œuvres d'art #Gaudi",
    "L'architecture japonaise traditionnelle est d'une élégance rare #Japon",
    "La rénovation de Notre-Dame est un défi architectural majeur #NotreDame",
    "Les tiny houses sont-elles une solution à la crise du logement ? #tinyhouse",
    "Le minimalisme architectural gagne en popularité #minimalisme",
    "Les villes intelligentes vont transformer notre quotidien #smartcity",
    "L'architecture soviétique est sous-estimée #sovietique",
    "La Tour Eiffel reste un chef-d'œuvre d'ingénierie #Paris",
    "Les maisons passives sont l'avenir de l'habitat #passivhaus",
    "Le biomimétisme inspire de plus en plus d'architectes #biomimetisme",
    "La verticalisation des villes est-elle inévitable ? #urbanisme"
  ],
  graphisme: [
    "Le flat design a-t-il fait son temps ? #design",
    "L'illustration digitale offre des possibilités infinies #illustration",
    "Le retour des tendances rétro en design #retro",
    "La typographie est souvent négligée en design #typo",
    "Le neomorphisme est-il la prochaine grande tendance ? #neomorphisme",
    "Adobe est-il en train de perdre sa domination ? #Adobe",
    "Le motion design est devenu essentiel #motion",
    "Les NFT ont-ils vraiment révolutionné l'art digital ? #NFT",
    "Le minimalisme en design reste intemporel #minimal",
    "La 3D ajoute une nouvelle dimension au graphisme #3D",
    "Le design d'interface est un art subtil #UI",
    "Les palettes de couleurs définissent l'ambiance d'un design #couleur",
    "Figma a changé la façon dont nous collaborons #Figma",
    "L'accessibilité devrait être au cœur de tout design #a11y",
    "Le design génératif ouvre de nouvelles possibilités créatives #generatif"
  ],
  politique: [
    "Les élections approchent, quel sera le taux d'abstention ? #elections",
    "La montée des extrêmes en Europe est préoccupante #politique",
    "La démocratie est-elle en danger ? #democratie",
    "Le bipartisme américain est-il obsolète ? #USA",
    "La politique environnementale doit devenir prioritaire #climat",
    "Les réseaux sociaux ont transformé la communication politique #communication",
    "La transparence politique est-elle possible ? #transparence",
    "Le populisme gagne du terrain partout dans le monde #populisme",
    "La participation citoyenne est essentielle à la démocratie #citoyennete",
    "Les jeunes s'intéressent-ils encore à la politique ? #jeunesse",
    "La géopolitique mondiale est en pleine reconfiguration #geopolitique",
    "L'Union Européenne face à ses défis #UE",
    "La diplomatie à l'ère des réseaux sociaux #diplomatie",
    "Les lobbies ont-ils trop d'influence ? #lobbying",
    "La politique locale est souvent négligée #local"
  ],
  actualité: [
    "La crise climatique s'accélère, que faire ? #climat",
    "L'inflation impacte le pouvoir d'achat #economie",
    "La guerre en Ukraine entre dans une nouvelle phase #Ukraine",
    "Le marché immobilier connaît une crise sans précédent #immobilier",
    "Les nouvelles technologies de l'IA inquiètent et fascinent #IA",
    "La santé mentale devient enfin un sujet de société #santé",
    "Les pénuries de main-d'œuvre touchent de nombreux secteurs #emploi",
    "Le télétravail s'installe durablement dans les entreprises #télétravail",
    "La cybersécurité devient une priorité nationale #cyber",
    "Les inégalités sociales continuent de se creuser #inégalités",
    "La transition énergétique est plus urgente que jamais #energie",
    "Les réseaux sociaux face à leurs responsabilités #socialmedia",
    "L'éducation doit se réinventer pour le 21e siècle #education",
    "La crise migratoire pose des défis humanitaires majeurs #migration",
    "L'accès à l'eau devient un enjeu géopolitique #eau"
  ]
};

// Tous les hashtags par catégorie
const hashtagsByCategory = {
  tech: ["#javascript", "#typescript", "#react", "#angular", "#vue", "#nodejs", "#mongodb", "#postgres", "#aws", "#azure", "#gcp", "#docker", "#kubernetes", "#devops", "#frontend", "#backend", "#fullstack", "#webdev", "#coding", "#programming", "#developer", "#softwareengineering", "#tech", "#ai", "#ml"],
  cinema: ["#film", "#cinema", "#movie", "#director", "#actor", "#actress", "#hollywood", "#blockbuster", "#indiefilm", "#oscars", "#netflix", "#streaming", "#marvel", "#dc", "#starwars", "#scifi", "#drama", "#comedy", "#thriller", "#horror"],
  sport: ["#football", "#soccer", "#nba", "#tennis", "#rugby", "#f1", "#running", "#fitness", "#olympics", "#worldcup", "#champion", "#athlete", "#sports", "#training", "#marathon", "#cycling", "#golf", "#skiing", "#climbing", "#swimming"],
  architecture: ["#architecture", "#design", "#building", "#urban", "#city", "#construction", "#interior", "#exterior", "#sustainable", "#modern", "#classic", "#brutalism", "#minimalist", "#skyscraper", "#house", "#apartment", "#renovation", "#heritage", "#landscape", "#urbanplanning"],
  graphisme: ["#design", "#graphic", "#illustration", "#art", "#creative", "#logo", "#branding", "#typography", "#color", "#vector", "#digital", "#print", "#poster", "#packaging", "#webdesign", "#ux", "#ui", "#userinterface", "#photoshop", "#illustrator"],
  politique: ["#politics", "#government", "#democracy", "#election", "#vote", "#policy", "#law", "#rights", "#freedom", "#justice", "#parliament", "#congress", "#president", "#minister", "#campaign", "#party", "#left", "#right", "#center", "#reform"],
  actualité: ["#news", "#current", "#today", "#breaking", "#headline", "#report", "#journalist", "#media", "#press", "#broadcast", "#live", "#update", "#world", "#national", "#local", "#global", "#crisis", "#event", "#analysis", "#investigation"]
};

// Fonction pour générer un tweet aléatoire avec des thématiques variées
function generateRandomTweet(index: number): Partial<ITweet> {
  const authorIds = [fixtureIds.kilianId, fixtureIds.adminId, fixtureIds.johnId];
  const tweetTypes = ["tweet", "reply", "retweet"];
  
  // Sélectionner une catégorie aléatoire
  const categories = Object.keys(tweetContentsByCategory);
  const randomCategory = categories[Math.floor(Math.random() * categories.length)];
  
  const randomAuthorId = authorIds[Math.floor(Math.random() * authorIds.length)];
  const randomTweetType = tweetTypes[Math.floor(Math.random() * tweetTypes.length)];
  
  // Sélectionner un contenu aléatoire de la catégorie choisie
  const categoryContents = tweetContentsByCategory[randomCategory as keyof typeof tweetContentsByCategory];
  const randomContent = categoryContents[Math.floor(Math.random() * categoryContents.length)];
  
  // Sélectionner des hashtags de la catégorie choisie
  const categoryHashtags = hashtagsByCategory[randomCategory as keyof typeof hashtagsByCategory];
  const randomHashtags = Array(Math.floor(Math.random() * 3) + 1)
    .fill(0)
    .map(() => categoryHashtags[Math.floor(Math.random() * categoryHashtags.length)])
    .join(" ");
  
  // Ajouter parfois un hashtag d'une autre catégorie pour plus de diversité
  const crossCategoryHashtag = Math.random() > 0.7 ? 
    ` ${hashtagsByCategory[categories[Math.floor(Math.random() * categories.length)] as keyof typeof hashtagsByCategory][Math.floor(Math.random() * 5)]}` : 
    '';
  
  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)); // Entre maintenant et 30 jours avant
  const likesCount = Math.floor(Math.random() * 100);
  const retweetsCount = Math.floor(Math.random() * 30);
  const bookmarksCount = Math.floor(Math.random() * 50);
  const isEdited = Math.random() > 0.8; // 20% de chance d'être édité
  
  const tweetId = new mongoose.Types.ObjectId();
  
  // Pour les réponses, on référence un tweet existant
  let parentTweetId = undefined;
  if (randomTweetType === "reply" && index > 0) {
    // Référence un tweet précédent (pour éviter les références circulaires)
    const randomPreviousTweetIndex = Math.floor(Math.random() * index);
    parentTweetId = generatedTweets[randomPreviousTweetIndex]?._id;
  }
  
  return {
    _id: tweetId,
    content: `${randomContent} ${randomHashtags}${crossCategoryHashtag}`,
    post_date: randomDate,
    author_id: randomAuthorId,
    parent_tweet_id: parentTweetId,
    tweet_type: randomTweetType as "tweet" | "reply" | "retweet",
    likes_count: likesCount,
    retweets_count: retweetsCount,
    bookmarks_count: bookmarksCount,
    media_url: Math.random() > 0.7 ? `https://example.com/image${randomCategory}_${index % 20}.jpg` : undefined,
    is_edited: isEdited,
    created_at: randomDate,
    updated_at: new Date(randomDate.getTime() + (isEdited ? 24 * 60 * 60 * 1000 : 0))
  };
}

// Générer 15000 tweets
const generatedTweets: Partial<ITweet>[] = [];

// D'abord ajouter les 4 tweets originaux pour garder les références
generatedTweets.push(
  {
    _id: tweetIds.tweet1Id,
    content: "Premier tweet de test ! #javascript #typescript",
    post_date: new Date(),
    author_id: fixtureIds.kilianId,
    tweet_type: "tweet",
    likes_count: 5,
    retweets_count: 2,
    bookmarks_count: 3,
    media_url: "https://example.com/image1.jpg",
    is_edited: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: tweetIds.tweet2Id,
    content: "Réponse au premier tweet",
    post_date: new Date(),
    author_id: fixtureIds.adminId,
    parent_tweet_id: tweetIds.tweet1Id,
    tweet_type: "reply",
    likes_count: 2,
    retweets_count: 0,
    bookmarks_count: 1,
    is_edited: false,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    _id: tweetIds.tweet3Id,
    content: "Tweet avec du code #coding",
    post_date: new Date(),
    author_id: fixtureIds.kilianId,
    tweet_type: "tweet",
    likes_count: 10,
    retweets_count: 5,
    bookmarks_count: 7,
    media_url: "https://example.com/code-snippet.png",
    is_edited: true,
    created_at: new Date(Date.now() - 86400000), // 1 jour avant
    updated_at: new Date()
  },
  {
    _id: tweetIds.tweet4Id,
    content: "Retweet important !",
    post_date: new Date(),
    author_id: fixtureIds.adminId,
    tweet_type: "retweet",
    likes_count: 0,
    retweets_count: 1,
    bookmarks_count: 0,
    is_edited: false,
    created_at: new Date(),
    updated_at: new Date()
  }
);

// Ensuite générer le reste des tweets
for (let i = 4; i < 15000; i++) {
  generatedTweets.push(generateRandomTweet(i));
}

export const tweetFixtures = generatedTweets;

