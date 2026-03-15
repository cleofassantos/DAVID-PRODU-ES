export type Subject = 'math' | 'portuguese' | 'science' | 'history';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Question {
  id: string;
  subject: Subject;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctAnswerIndex: number;
}

export const questions: Question[] = [
  // Math - Easy
  { id: 'm1', subject: 'math', difficulty: 'easy', text: 'Quanto é 5 + 7?', options: ['10', '11', '12', '13'], correctAnswerIndex: 2 },
  { id: 'm2', subject: 'math', difficulty: 'easy', text: 'Qual é o dobro de 8?', options: ['14', '16', '18', '20'], correctAnswerIndex: 1 },
  { id: 'm7', subject: 'math', difficulty: 'easy', text: 'Quanto é 10 - 4?', options: ['4', '5', '6', '7'], correctAnswerIndex: 2 },
  { id: 'm8', subject: 'math', difficulty: 'easy', text: 'Qual é a metade de 20?', options: ['5', '10', '15', '20'], correctAnswerIndex: 1 },
  { id: 'm9', subject: 'math', difficulty: 'easy', text: 'Quanto é 3 x 3?', options: ['6', '9', '12', '15'], correctAnswerIndex: 1 },
  // Math - Medium
  { id: 'm3', subject: 'math', difficulty: 'medium', text: 'Quanto é 6 x 7?', options: ['42', '36', '48', '40'], correctAnswerIndex: 0 },
  { id: 'm4', subject: 'math', difficulty: 'medium', text: 'Qual é a raiz quadrada de 81?', options: ['7', '8', '9', '10'], correctAnswerIndex: 2 },
  { id: 'm10', subject: 'math', difficulty: 'medium', text: 'Quanto é 15% de 100?', options: ['10', '15', '20', '25'], correctAnswerIndex: 1 },
  { id: 'm11', subject: 'math', difficulty: 'medium', text: 'Se um triângulo tem base 4 e altura 5, qual é a área?', options: ['10', '20', '9', '18'], correctAnswerIndex: 0 },
  { id: 'm12', subject: 'math', difficulty: 'medium', text: 'Quanto é 5 ao cubo (5³)?', options: ['15', '25', '125', '625'], correctAnswerIndex: 2 },
  // Math - Hard
  { id: 'm5', subject: 'math', difficulty: 'hard', text: 'Qual é o resultado de 15 x 12?', options: ['150', '165', '180', '195'], correctAnswerIndex: 2 },
  { id: 'm6', subject: 'math', difficulty: 'hard', text: 'Se 3x = 27, qual é o valor de x?', options: ['7', '8', '9', '10'], correctAnswerIndex: 2 },
  { id: 'm13', subject: 'math', difficulty: 'hard', text: 'Qual é o valor de Pi (aproximado a duas casas)?', options: ['3.12', '3.14', '3.16', '3.18'], correctAnswerIndex: 1 },
  { id: 'm14', subject: 'math', difficulty: 'hard', text: 'Resolva: 2 + 5 x 3', options: ['21', '17', '15', '10'], correctAnswerIndex: 1 },
  { id: 'm15', subject: 'math', difficulty: 'hard', text: 'Qual é a raiz quadrada de 144?', options: ['10', '12', '14', '16'], correctAnswerIndex: 1 },

  // Portuguese - Easy
  { id: 'p1', subject: 'portuguese', difficulty: 'easy', text: 'Qual é o plural de "cão"?', options: ['cãos', 'cães', 'cões', 'cãozes'], correctAnswerIndex: 1 },
  { id: 'p2', subject: 'portuguese', difficulty: 'easy', text: 'Qual palavra é um substantivo?', options: ['Correr', 'Feliz', 'Gato', 'Muito'], correctAnswerIndex: 2 },
  { id: 'p5', subject: 'portuguese', difficulty: 'easy', text: 'Qual é o antônimo de "Bom"?', options: ['Ótimo', 'Mau', 'Feliz', 'Claro'], correctAnswerIndex: 1 },
  { id: 'p6', subject: 'portuguese', difficulty: 'easy', text: 'Quantas sílabas tem a palavra "Cachorro"?', options: ['2', '3', '4', '5'], correctAnswerIndex: 1 },
  // Portuguese - Medium
  { id: 'p7', subject: 'portuguese', difficulty: 'medium', text: 'Qual palavra é proparoxítona?', options: ['Café', 'Mesa', 'Lâmpada', 'Coração'], correctAnswerIndex: 2 },
  { id: 'p8', subject: 'portuguese', difficulty: 'medium', text: 'Qual é o sinônimo de "Alegre"?', options: ['Triste', 'Contente', 'Bravo', 'Cansado'], correctAnswerIndex: 1 },
  { id: 'p9', subject: 'portuguese', difficulty: 'medium', text: 'Onde está o erro: "Nós vai ao cinema"?', options: ['Nós', 'vai', 'ao', 'cinema'], correctAnswerIndex: 1 },
  // Portuguese - Hard
  { id: 'p3', subject: 'portuguese', difficulty: 'hard', text: 'Qual é a figura de linguagem em "Chorou rios de lágrimas"?', options: ['Metáfora', 'Hipérbole', 'Eufemismo', 'Ironia'], correctAnswerIndex: 1 },
  { id: 'p4', subject: 'portuguese', difficulty: 'hard', text: 'Classifique o sujeito: "Choveu muito ontem."', options: ['Simples', 'Oculto', 'Indeterminado', 'Inexistente'], correctAnswerIndex: 3 },
  { id: 'p10', subject: 'portuguese', difficulty: 'hard', text: 'O que é um verbo intransitivo?', options: ['Precisa de objeto direto', 'Precisa de objeto indireto', 'Não precisa de complemento', 'Liga o sujeito ao predicativo'], correctAnswerIndex: 2 },

  // Science - Easy
  { id: 's1', subject: 'science', difficulty: 'easy', text: 'Qual planeta é conhecido como o Planeta Vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Saturno'], correctAnswerIndex: 1 },
  { id: 's2', subject: 'science', difficulty: 'easy', text: 'O que as plantas precisam para fazer fotossíntese?', options: ['Luz solar', 'Açúcar', 'Sal', 'Óleo'], correctAnswerIndex: 0 },
  { id: 's5', subject: 'science', difficulty: 'easy', text: 'Qual é o maior mamífero do mundo?', options: ['Elefante', 'Girafa', 'Baleia Azul', 'Rinoceronte'], correctAnswerIndex: 2 },
  { id: 's6', subject: 'science', difficulty: 'easy', text: 'A água ferve a quantos graus Celsius?', options: ['50', '90', '100', '120'], correctAnswerIndex: 2 },
  // Science - Medium
  { id: 's7', subject: 'science', difficulty: 'medium', text: 'Quantos ossos tem o corpo humano adulto?', options: ['206', '250', '180', '300'], correctAnswerIndex: 0 },
  { id: 's8', subject: 'science', difficulty: 'medium', text: 'Qual é o gás mais abundante na atmosfera terrestre?', options: ['Oxigênio', 'Gás Carbônico', 'Nitrogênio', 'Hidrogênio'], correctAnswerIndex: 2 },
  { id: 's9', subject: 'science', difficulty: 'medium', text: 'O que é a Via Láctea?', options: ['Um planeta', 'Uma estrela', 'Uma galáxia', 'Um cometa'], correctAnswerIndex: 2 },
  // Science - Hard
  { id: 's3', subject: 'science', difficulty: 'hard', text: 'Qual é a fórmula química do gás carbônico?', options: ['CO2', 'H2O', 'O2', 'NaCl'], correctAnswerIndex: 0 },
  { id: 's4', subject: 'science', difficulty: 'hard', text: 'Qual organela é responsável pela respiração celular?', options: ['Ribossomo', 'Mitocôndria', 'Lisossomo', 'Núcleo'], correctAnswerIndex: 1 },
  { id: 's10', subject: 'science', difficulty: 'hard', text: 'Qual é o elemento químico com o símbolo "Au"?', options: ['Prata', 'Ferro', 'Ouro', 'Cobre'], correctAnswerIndex: 2 },

  // History - Easy
  { id: 'h1', subject: 'history', difficulty: 'easy', text: 'Quem descobriu o Brasil?', options: ['Cristóvão Colombo', 'Pedro Álvares Cabral', 'Vasco da Gama', 'Dom Pedro I'], correctAnswerIndex: 1 },
  { id: 'h4', subject: 'history', difficulty: 'easy', text: 'Qual foi o primeiro presidente do Brasil?', options: ['Getúlio Vargas', 'Deodoro da Fonseca', 'Juscelino Kubitschek', 'Dom Pedro II'], correctAnswerIndex: 1 },
  { id: 'h5', subject: 'history', difficulty: 'easy', text: 'Em que país surgiram as Olimpíadas?', options: ['Itália', 'Grécia', 'Egito', 'China'], correctAnswerIndex: 1 },
  // History - Medium
  { id: 'h2', subject: 'history', difficulty: 'medium', text: 'Em que ano ocorreu a Independência do Brasil?', options: ['1500', '1822', '1889', '1930'], correctAnswerIndex: 1 },
  { id: 'h6', subject: 'history', difficulty: 'medium', text: 'Quem pintou a Mona Lisa?', options: ['Van Gogh', 'Picasso', 'Leonardo da Vinci', 'Michelangelo'], correctAnswerIndex: 2 },
  { id: 'h7', subject: 'history', difficulty: 'medium', text: 'Qual civilização construiu as pirâmides de Gizé?', options: ['Romanos', 'Maias', 'Egípcios', 'Incas'], correctAnswerIndex: 2 },
  // History - Hard
  { id: 'h3', subject: 'history', difficulty: 'hard', text: 'Qual foi o estopim da Primeira Guerra Mundial?', options: ['Invasão da Polônia', 'Queda da Bastilha', 'Assassinato do Arquiduque Francisco Ferdinando', 'Ataque a Pearl Harbor'], correctAnswerIndex: 2 },
  { id: 'h8', subject: 'history', difficulty: 'hard', text: 'Em que ano caiu o Muro de Berlim?', options: ['1985', '1989', '1991', '1993'], correctAnswerIndex: 1 },
  { id: 'h9', subject: 'history', difficulty: 'hard', text: 'Quem foi o líder da Revolução Russa de 1917?', options: ['Stalin', 'Trotsky', 'Lenin', 'Gorbachev'], correctAnswerIndex: 2 },
];

export type PowerType = 'doubleJump' | 'shield' | 'magnet' | 'scoreMultiplier' | 'invincibility' | 'skipQuestion' | 'extraLife';

export interface Character {
  id: string;
  name: string;
  theme: string;
  color: string;
  emoji: string;
  power: PowerType;
  powerDescription: string;
  cost: number;
  unlockedByDefault: boolean;
}

export const characters: Character[] = [
  {
    id: 'ladybug',
    name: 'Joaninha Heroína',
    theme: 'Inseto',
    color: '#ef4444', // red-500
    emoji: '🐞',
    power: 'doubleJump',
    powerDescription: 'Pulo Duplo: Pode pular novamente no ar!',
    cost: 0,
    unlockedByDefault: true,
  },
  {
    id: 'cat',
    name: 'Gato Noturno',
    theme: 'Felino',
    color: '#10b981', // emerald-500 (green eyes/accents)
    emoji: '🐈',
    power: 'shield',
    powerDescription: 'Escudo: Sobrevive a uma batida!',
    cost: 100,
    unlockedByDefault: false,
  },
  {
    id: 'fox',
    name: 'Raposa Ilusão',
    theme: 'Canídeo',
    color: '#f97316', // orange-500
    emoji: '🦊',
    power: 'magnet',
    powerDescription: 'Ímã: Atrai moedas próximas!',
    cost: 250,
    unlockedByDefault: false,
  },
  {
    id: 'turtle',
    name: 'Tartaruga Casco',
    theme: 'Réptil',
    color: '#84cc16', // lime-500
    emoji: '🐢',
    power: 'invincibility',
    powerDescription: 'Invencível: Destrói obstáculos ao usar o poder!',
    cost: 500,
    unlockedByDefault: false,
  },
  {
    id: 'bee',
    name: 'Abelha Rainha',
    theme: 'Inseto',
    color: '#eab308', // yellow-500
    emoji: '🐝',
    power: 'scoreMultiplier',
    powerDescription: 'Multiplicador: Ganha o dobro de pontos!',
    cost: 1000,
    unlockedByDefault: false,
  },
  {
    id: 'peacock',
    name: 'Pavão Misterioso',
    theme: 'Ave',
    color: '#3b82f6', // blue-500
    emoji: '🦚',
    power: 'magnet',
    powerDescription: 'Super Ímã: Atrai moedas de muito longe!',
    cost: 1500,
    unlockedByDefault: false,
  },
  {
    id: 'butterfly',
    name: 'Borboleta Mágica',
    theme: 'Inseto',
    color: '#a855f7', // purple-500
    emoji: '🦋',
    power: 'doubleJump',
    powerDescription: 'Pulo Duplo: Salto extra para evitar perigos!',
    cost: 2000,
    unlockedByDefault: false,
  },
  {
    id: 'snake',
    name: 'Cobra Rastejante',
    theme: 'Réptil',
    color: '#06b6d4', // cyan-500
    emoji: '🐍',
    power: 'shield',
    powerDescription: 'Escudo: Sobrevive a uma batida extra!',
    cost: 3000,
    unlockedByDefault: false,
  },
  {
    id: 'dragon',
    name: 'Dragão Ancestral',
    theme: 'Mítico',
    color: '#dc2626', // red-600
    emoji: '🐉',
    power: 'invincibility',
    powerDescription: 'Invencível: Destrói obstáculos ao usar o poder!',
    cost: 5000,
    unlockedByDefault: false,
  },
  {
    id: 'dog',
    name: 'Cachorro Caramelo',
    theme: 'Canídeo',
    color: '#d97706', // amber-600
    emoji: '🐕',
    power: 'scoreMultiplier',
    powerDescription: 'Carisma: Multiplica seus pontos por 2!',
    cost: 0,
    unlockedByDefault: true,
  },
  {
    id: 'pig',
    name: 'Porco Preguiçoso',
    theme: 'Suíno',
    color: '#f472b6', // pink-400
    emoji: '🐖',
    power: 'skipQuestion',
    powerDescription: 'Preguiça: Pula as perguntas e ganha os pontos direto!',
    cost: 1200,
    unlockedByDefault: false,
  },
  {
    id: 'tiger',
    name: 'Tigre Saltador',
    theme: 'Felino',
    color: '#f59e0b', // amber-500
    emoji: '🐅',
    power: 'doubleJump',
    powerDescription: 'Acrobata: Pode pular duas vezes no ar!',
    cost: 1800,
    unlockedByDefault: false,
  },
  {
    id: 'monkey',
    name: 'Macaco Ágil',
    theme: 'Primata',
    color: '#b45309', // amber-700
    emoji: '🐒',
    power: 'magnet',
    powerDescription: 'Agilidade: Pega moedas de longe com seu rabo!',
    cost: 600,
    unlockedByDefault: false,
  },
  {
    id: 'goat',
    name: 'Cabra da Peste',
    theme: 'Caprino',
    color: '#94a3b8', // slate-400
    emoji: '🐐',
    power: 'shield',
    powerDescription: 'Cabeçada: Resiste a um impacto com seus chifres!',
    cost: 800,
    unlockedByDefault: false,
  },
  {
    id: 'rooster',
    name: 'Galo Cantador',
    theme: 'Ave',
    color: '#b91c1c', // red-700
    emoji: '🐓',
    power: 'scoreMultiplier',
    powerDescription: 'Canto Matinal: Acorda cedo e ganha o dobro de pontos!',
    cost: 400,
    unlockedByDefault: false,
  },
  {
    id: 'bull',
    name: 'Touro Furioso',
    theme: 'Bovino',
    color: '#451a03', // amber-950
    emoji: '🐂',
    power: 'invincibility',
    powerDescription: 'Fúria: Destrói tudo pela frente!',
    cost: 1500,
    unlockedByDefault: false,
  },
  {
    id: 'rabbit',
    name: 'Coelho da Sorte',
    theme: 'Leporídeo',
    color: '#f8fafc', // slate-50
    emoji: '🐇',
    power: 'extraLife',
    powerDescription: 'Sorte: Tem uma segunda chance se perder!',
    cost: 2000,
    unlockedByDefault: false,
  }
];
