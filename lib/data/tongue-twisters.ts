export interface TongueTwister {
  id: string;
  title: string;
  text: string;
  focus: string;
  phonetics: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tip: string;
}

export const TONGUE_TWISTERS: TongueTwister[] = [
  {
    id: 'tt-1',
    title: 'Peter Piper',
    text: 'Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked. If Peter Piper picked a peck of pickled peppers, where’s the peck of pickled peppers Peter Piper picked?',
    focus: 'Plosive /p/ Lip Closure',
    phonetics: '/p/ aspiration',
    difficulty: 'Medium',
    tip: 'Focus on popping your lips cleanly on the /p/ sound without letting breath leak beforehand.',
  },
  {
    id: 'tt-2',
    title: 'She Sells Seashells',
    text: 'She sells seashells by the seashore, and the shells she sells are seashells, I’m sure. So if she sells seashells on the seashore, I’m sure she sells seashore shells.',
    focus: '/s/ vs /ʃ/ Sibilant Contrast',
    phonetics: '/s/ alveolar vs /ʃ/ post-alveolar',
    difficulty: 'Hard',
    tip: 'Keep tongue forward for "sea" (/s/) and pull it slightly back with rounded lips for "she" (/ʃ/).',
  },
  {
    id: 'tt-3',
    title: 'Betty Botter’s Butter',
    text: 'Betty Botter bought some butter, but she said the butter’s bitter. If I put it in my batter, it will make my batter bitter. So ’twas better Betty Botter bought a bit of better butter.',
    focus: 'American Flap T [ɾ] & /b/',
    phonetics: 'Intervocalic /t/ flapping',
    difficulty: 'Medium',
    tip: 'Practice tapping your tongue tip quickly against the roof of your mouth on "butter" and "batter".',
  },
  {
    id: 'tt-4',
    title: 'Woodchuck Wonder',
    text: 'How much wood would a woodchuck chuck if a woodchuck could chuck wood? He would chuck, he would, as much as he could, and chuck as much wood as a woodchuck would if a woodchuck could chuck wood.',
    focus: '/w/ Rounded Glide & /tʃ/ Affricate',
    phonetics: '/w/ vs /ʊ/ vs /tʃ/',
    difficulty: 'Easy',
    tip: 'Tighten your lips into a small circle for "wood" and release explosive air for "chuck".',
  },
  {
    id: 'tt-5',
    title: 'Red Lorry, Yellow Lorry',
    text: 'Red lorry, yellow lorry, red lorry, yellow lorry, red lorry, yellow lorry.',
    focus: '/r/ vs /l/ Liquid Consonant Shift',
    phonetics: 'Rhotic /r/ vs Lateral /l/',
    difficulty: 'Hard',
    tip: 'Ensure the tongue tip curls or bunches for "red" without touching, but touches the gum ridge for "yellow".',
  },
  {
    id: 'tt-6',
    title: 'Thirty-Three Feathers',
    text: 'Thirty-three thousand feathers on a thrush’s throat. Think through the thought before you utter thirty-three.',
    focus: 'Voiceless Dental Fricative /θ/',
    phonetics: '/θ/ tongue-between-teeth',
    difficulty: 'Hard',
    tip: 'Let your tongue tip peek between your upper and lower front teeth on every "th" sound.',
  },
  {
    id: 'tt-7',
    title: 'Unique New York',
    text: 'Unique New York, you know you need unique New York. New York’s unique, you know you need unique New York.',
    focus: '/j/ Semivowel Glide & /n/ Nasal',
    phonetics: '/juːˈniːk njuː jɔːrk/',
    difficulty: 'Medium',
    tip: 'Notice the glide /j/ moving directly into the open vowel /uː/.',
  },
  {
    id: 'tt-8',
    title: 'Fuzzy Wuzzy',
    text: 'Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair. Fuzzy Wuzzy wasn’t fuzzy, was he?',
    focus: 'Voiced /z/ Buzzing vs /w/',
    phonetics: '/z/ vocal cord vibration',
    difficulty: 'Easy',
    tip: 'Feel your throat vibrate with the buzzing /z/ sound in "fuzzy" and "was".',
  },
];
