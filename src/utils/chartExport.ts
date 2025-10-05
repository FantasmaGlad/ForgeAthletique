/**
 * Utilitaires pour l'export des graphiques
 */

export function downloadChartAsPNG(chartElement: HTMLElement, filename: string = 'chart') {
  // Créer un canvas temporaire
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error('Canvas context not available');
    return;
  }

  // Définir la taille du canvas (haute résolution)
  canvas.width = chartElement.offsetWidth * 2;
  canvas.height = chartElement.offsetHeight * 2;

  // Fond sombre comme l'application
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Créer une image du graphique
  const svg = chartElement.querySelector('svg');
  if (svg) {
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Dessiner l'image SVG sur le canvas avec scale 2x
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Télécharger l'image
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      // Nettoyer
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  } else {
    // Fallback si pas de SVG (dessiner du texte)
    ctx.fillStyle = '#F5F5F5';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Graphique non disponible', canvas.width / 2, canvas.height / 2);

    // Télécharger quand même
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }
}

export function downloadChartAsSVG(chartElement: HTMLElement, filename: string = 'chart') {
  const svg = chartElement.querySelector('svg');
  if (!svg) {
    console.error('No SVG found in chart element');
    return;
  }

  // Ajouter les styles CSS nécessaires
  const style = document.createElement('style');
  style.textContent = `
    .recharts-cartesian-axis-tick-value { fill: #A0A0A0 !important; }
    .recharts-cartesian-axis-line { stroke: #252525 !important; }
    .recharts-cartesian-grid line { stroke: #252525 !important; }
    .recharts-tooltip-wrapper { display: none !important; }
  `;

  // Cloner le SVG et ajouter les styles
  const clonedSvg = svg.cloneNode(true) as SVGElement;
  clonedSvg.insertBefore(style, clonedSvg.firstChild);

  // Définir un fond
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('width', '100%');
  rect.setAttribute('height', '100%');
  rect.setAttribute('fill', '#1A1A1A');
  if (clonedSvg.firstChild) {
    clonedSvg.insertBefore(rect, clonedSvg.firstChild.nextSibling);
  } else {
    clonedSvg.appendChild(rect);
  }

  const svgData = new XMLSerializer().serializeToString(clonedSvg);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });

  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = URL.createObjectURL(svgBlob);
  link.click();
}
