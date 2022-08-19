import { random } from "./functions";

export const  clueTypeGenerator = (clueType?: string | null): string => {
  if(!clueType) return '';

  switch(clueType.toLowerCase()){
    case 'color':
      return ' ' + generateClueColor();
  }
  return '';
}

export const generateClueColor = (): string => {
  // list of colors in portuguese
  const colors = ['azul', 'verde', 'vermelho', 'amarelo', 'laranja', 'roxo', 'preto', 'branco'];
  const randomIndex = random(colors.length);
  return colors[randomIndex];
}