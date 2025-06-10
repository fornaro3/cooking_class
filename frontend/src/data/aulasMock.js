// src/data/aulasMock.js
export const placeholderImage =
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=400&h=250';

export const aulasMock = [
  {
    id: 1,
    chefId: 10,
    title: 'Taco Mexicano Autêntico',
    teacher: 'Luisa González',
    cuisine: 'Mexicana',
    price: 'R$ 80,00',
    image: placeholderImage,
    description:
      'Aprenda a fazer tacos autênticos, desde a massa da tortilla até os recheios clássicos mexicanos.',
    lessons: [
      { id: 101, title: 'Introdução', type: 'texto' },
      { id: 102, title: 'Preparando a massa', type: 'vídeo' },
      { id: 103, title: 'Recheios e montagem', type: 'texto' }
    ]
  },
  {
    id: 2,
    chefId: 10,
    title: 'Risotto Italiano Cremoso',
    teacher: 'Giovanni Rossi',
    cuisine: 'Italiana',
    price: 'R$ 120,00',
    image: placeholderImage,
    description:
      'Domine a arte do risotto, entendendo os pontos de cozimento do arroz arbóreo e combinações de queijos.',
    lessons: [
      { id: 201, title: 'Introdução ao arroz', type: 'texto' },
      { id: 202, title: 'Técnica de mexida', type: 'vídeo' },
      { id: 203, title: 'Finalização e sabores', type: 'texto' }
    ]
  },
  {
    id: 3,
    chefId: 11,
    title: 'Sushi Tradicional Japonês',
    teacher: 'Haruto Tanaka',
    cuisine: 'Japonesa',
    price: 'R$ 150,00',
    image: placeholderImage,
    description:
      'Aprenda cortes de peixe, tempero de arroz e enrolar sushi maki e nigiri tradicional.',
    lessons: [
      { id: 301, title: 'Escolha do peixe', type: 'texto' },
      { id: 302, title: 'Preparo do arroz', type: 'vídeo' },
      { id: 303, title: 'Montagem dos nigiris', type: 'vídeo' }
    ]
  },
  {
    id: 4,
    chefId: 11,
    title: 'Pad Thai Tailandês',
    teacher: 'Anong Chai',
    cuisine: 'Tailandesa',
    price: 'R$ 90,00',
    image: placeholderImage,
    description:
      'Descubra o genuíno Pad Thai, equilibrando tamarindo, amendoim, broto de feijão e camarão.',
    lessons: [
      { id: 401, title: 'Molho e temperos', type: 'vídeo' },
      { id: 402, title: 'Técnica de wok', type: 'vídeo' },
      { id: 403, title: 'Montagem final', type: 'texto' }
    ]
  },
  {
    id: 5,
    chefId: 10,
    title: 'Churros com Chocolate',
    teacher: 'María Pérez',
    cuisine: 'Espanhola',
    price: 'R$ 70,00',
    image: placeholderImage,
    description:
      'Prepare churros crocantes e aprenda uma ganache de chocolate perfeita para mergulhar.',
    lessons: [
      { id: 501, title: 'Massa tradicional', type: 'texto' },
      { id: 502, title: 'Fritura ideal', type: 'vídeo' },
      { id: 503, title: 'Chocolate quente', type: 'vídeo' }
    ]
  },
  {
    id: 6,
    chefId: 10,
    title: 'Curry Indiano Picante',
    teacher: 'Raj Singh',
    cuisine: 'Indiana',
    price: 'R$ 110,00',
    image: placeholderImage,
    description:
      'Misture especiarias tradicionais, como garam masala e cúrcuma, para criar um curry autêntico.',
    lessons: [
      { id: 601, title: 'Especiarias básicas', type: 'texto' },
      { id: 602, title: 'Faça seu curry paste', type: 'vídeo' },
      { id: 603, title: 'Cozimento e ajuste de pimenta', type: 'texto' }
    ]
  }
];
