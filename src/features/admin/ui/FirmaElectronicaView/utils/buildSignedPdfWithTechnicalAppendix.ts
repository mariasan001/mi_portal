import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFPage,
  type PDFFont,
} from 'pdf-lib';
import type { FirmaDetalleTecnicoDto } from '../../../types/firma-electronica.types';

type BuildSignedPdfParams = {
  pdfBytes: ArrayBuffer;
  detalleTecnico: FirmaDetalleTecnicoDto;
};

type TableRow = {
  label: string;
  value: string;
};

const COLORS = {
  border: rgb(0.72, 0.72, 0.72),
  headerFill: rgb(0.9, 0.9, 0.9),
  labelFill: rgb(0.965, 0.965, 0.965),
  text: rgb(0.08, 0.08, 0.08),
  muted: rgb(0.38, 0.38, 0.38),
  vino: rgb(0.58, 0.11, 0.23),
};

function normalize(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return 'No disponible';
  const text = String(value).trim();
  return text || 'No disponible';
}

function breakLongWordByWidth(
  word: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const chunks: string[] = [];
  let current = '';

  for (const char of word) {
    const candidate = current + char;
    const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);

    if (candidateWidth <= maxWidth) {
      current = candidate;
    } else {
      if (current) {
        chunks.push(current);
      }
      current = char;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length ? chunks : [word];
}

function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const safeText = text.trim() || 'No disponible';

  if (!safeText.includes(' ')) {
    return breakLongWordByWidth(safeText, font, fontSize, maxWidth);
  }

  const words = safeText.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    const candidateWidth = font.widthOfTextAtSize(candidate, fontSize);

    if (candidateWidth <= maxWidth) {
      current = candidate;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    const wordWidth = font.widthOfTextAtSize(word, fontSize);

    if (wordWidth <= maxWidth) {
      current = word;
    } else {
      const chunks = breakLongWordByWidth(word, font, fontSize, maxWidth);

      if (chunks.length > 1) {
        lines.push(...chunks.slice(0, -1));
        current = chunks[chunks.length - 1] ?? '';
      } else {
        current = word;
      }
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines.length ? lines : ['No disponible'];
}

function drawPageHeader(
  page: PDFPage,
  regular: PDFFont,
  bold: PDFFont,
  margin: number,
  y: number
): number {
  page.drawText('ANEXO TÉCNICO DE FIRMA ELECTRÓNICA', {
    x: margin,
    y,
    size: 12,
    font: bold,
    color: COLORS.vino,
  });

  const subtitleY = y - 18;

  page.drawText(
    'Documento complementario con evidencia técnica de validación',
    {
      x: margin,
      y: subtitleY,
      size: 8.5,
      font: regular,
      color: COLORS.muted,
    }
  );

  return subtitleY - 18;
}

function drawSectionTitle(
  page: PDFPage,
  title: string,
  x: number,
  y: number,
  width: number,
  bold: PDFFont
): number {
  const height = 18;

  page.drawRectangle({
    x,
    y: y - height,
    width,
    height,
    color: COLORS.headerFill,
    borderColor: COLORS.border,
    borderWidth: 1,
  });

  page.drawText(title, {
    x: x + 6,
    y: y - 12,
    size: 9,
    font: bold,
    color: COLORS.text,
  });

  return y - height;
}

function drawAdaptiveRow(
  page: PDFPage,
  row: TableRow,
  x: number,
  y: number,
  width: number,
  regular: PDFFont,
  bold: PDFFont
): number {
  const labelWidth = width * 0.35;
  const valueWidth = width - labelWidth;

  const labelFontSize = 8.2;
  const valueFontSize = 8.2;
  const cellPaddingX = 6;
  const cellPaddingTop = 5;
  const lineHeight = 10;

  const labelLines = wrapText(
    row.label,
    bold,
    labelFontSize,
    labelWidth - cellPaddingX * 2
  );

  const valueLines = wrapText(
    row.value,
    regular,
    valueFontSize,
    valueWidth - cellPaddingX * 2
  );

  const contentLineCount = Math.max(labelLines.length, valueLines.length);
  const rowHeight = Math.max(
    16,
    cellPaddingTop * 2 + contentLineCount * lineHeight
  );

  page.drawRectangle({
    x,
    y: y - rowHeight,
    width: labelWidth,
    height: rowHeight,
    color: COLORS.labelFill,
    borderColor: COLORS.border,
    borderWidth: 1,
  });

  page.drawRectangle({
    x: x + labelWidth,
    y: y - rowHeight,
    width: valueWidth,
    height: rowHeight,
    borderColor: COLORS.border,
    borderWidth: 1,
  });

  let labelY = y - cellPaddingTop - labelFontSize;
  for (const line of labelLines) {
    page.drawText(line, {
      x: x + cellPaddingX,
      y: labelY,
      size: labelFontSize,
      font: bold,
      color: COLORS.text,
    });
    labelY -= lineHeight;
  }

  let valueY = y - cellPaddingTop - valueFontSize;
  for (const line of valueLines) {
    page.drawText(line, {
      x: x + labelWidth + cellPaddingX,
      y: valueY,
      size: valueFontSize,
      font: regular,
      color: COLORS.text,
    });
    valueY -= lineHeight;
  }

  return y - rowHeight;
}

function estimateRowHeight(
  row: TableRow,
  width: number,
  regular: PDFFont,
  bold: PDFFont
): number {
  const labelWidth = width * 0.35;
  const valueWidth = width - labelWidth;

  const labelFontSize = 8.2;
  const valueFontSize = 8.2;
  const cellPaddingX = 6;
  const cellPaddingTop = 5;
  const lineHeight = 10;

  const labelLines = wrapText(
    row.label,
    bold,
    labelFontSize,
    labelWidth - cellPaddingX * 2
  );

  const valueLines = wrapText(
    row.value,
    regular,
    valueFontSize,
    valueWidth - cellPaddingX * 2
  );

  const contentLineCount = Math.max(labelLines.length, valueLines.length);

  return Math.max(16, cellPaddingTop * 2 + contentLineCount * lineHeight);
}

function estimateSectionHeight(
  rows: TableRow[],
  width: number,
  regular: PDFFont,
  bold: PDFFont
): number {
  let total = 18 + 8;

  for (const row of rows) {
    total += estimateRowHeight(row, width, regular, bold);
  }

  return total + 12;
}

function buildSections(detalleTecnico: FirmaDetalleTecnicoDto): Array<{
  title: string;
  rows: TableRow[];
}> {
  return [
    {
      title: 'Resumen',
      rows: [
        {
          label: 'Identificador',
          value: normalize(detalleTecnico.identificadorFirma),
        },
        {
          label: 'Archivo',
          value: normalize(detalleTecnico.archivo?.nombreArchivo),
        },
        {
          label: 'Mime Type',
          value: normalize(detalleTecnico.archivo?.mimeType),
        },
        {
          label: 'Contenido Base64',
          value: detalleTecnico.archivo?.contenidoBase64
            ? 'Disponible'
            : 'No disponible',
        },
      ],
    },
    {
      title: 'Firmante',
      rows: [
        {
          label: 'Nombre',
          value: normalize(detalleTecnico.firmante?.nombre),
        },
        {
          label: 'Correo',
          value: normalize(detalleTecnico.firmante?.correo),
        },
        {
          label: 'Organización',
          value: normalize(detalleTecnico.firmante?.organizacion),
        },
        {
          label: 'Serie',
          value: normalize(detalleTecnico.firmante?.serieCertificado),
        },
        {
          label: 'Inicio vigencia',
          value: normalize(detalleTecnico.firmante?.vigenciaInicio),
        },
        {
          label: 'Fin vigencia',
          value: normalize(detalleTecnico.firmante?.vigenciaFin),
        },
      ],
    },
    {
      title: 'Autoridad certificadora',
      rows: [
        {
          label: 'Nombre',
          value: normalize(detalleTecnico.autoridadCertificadora?.nombre),
        },
        {
          label: 'Unidad',
          value: normalize(
            detalleTecnico.autoridadCertificadora?.unidadOrganizacional
          ),
        },
        {
          label: 'Organización',
          value: normalize(
            detalleTecnico.autoridadCertificadora?.organizacion
          ),
        },
      ],
    },
    {
      title: 'Firma criptográfica',
      rows: [
        {
          label: 'Hash',
          value: normalize(
            detalleTecnico.firmaCriptografica?.hashAlgoritmoDetectado
          ),
        },
        {
          label: 'Algoritmo',
          value: normalize(
            detalleTecnico.firmaCriptografica?.algoritmoFirma
          ),
        },
        {
          label: 'Firma bytes',
          value: normalize(
            detalleTecnico.firmaCriptografica?.firmaCrudaBytes
          ),
        },
        {
          label: 'Hex',
          value: normalize(detalleTecnico.firmaCriptografica?.firmaHex),
        },
      ],
    },
    {
      title: 'OCSP',
      rows: [
        {
          label: 'Tipo detectado',
          value: normalize(detalleTecnico.ocsp?.tipoDetectado),
        },
        {
          label: 'Fecha producción',
          value: normalize(detalleTecnico.ocsp?.fechaProduccion),
        },
        {
          label: 'Hash cert. consultado',
          value: normalize(detalleTecnico.ocsp?.hashCertConsultado),
        },
        {
          label: 'Serie consultada',
          value: normalize(detalleTecnico.ocsp?.serieConsultada),
        },
        {
          label: 'Issuer Name Hash',
          value: normalize(detalleTecnico.ocsp?.issuerNameHash),
        },
        {
          label: 'Issuer Key Hash',
          value: normalize(detalleTecnico.ocsp?.issuerKeyHash),
        },
        {
          label: 'This Update',
          value: normalize(detalleTecnico.ocsp?.thisUpdate),
        },
        {
          label: 'Nonce',
          value: normalize(detalleTecnico.ocsp?.nonce),
        },
      ],
    },
    {
      title: 'TSP',
      rows: [
        {
          label: 'Tipo detectado',
          value: normalize(detalleTecnico.tsp?.tipoDetectado),
        },
        {
          label: 'Estado',
          value: normalize(detalleTecnico.tsp?.estado),
        },
        {
          label: 'Hash algorithm',
          value: normalize(detalleTecnico.tsp?.hashAlgorithm),
        },
        {
          label: 'Message imprint',
          value: normalize(detalleTecnico.tsp?.messageImprint),
        },
        {
          label: 'Número serie sello',
          value: normalize(detalleTecnico.tsp?.numeroSerieSello),
        },
        {
          label: 'Fecha sello',
          value: normalize(detalleTecnico.tsp?.fechaSello),
        },
        {
          label: 'TSA',
          value: normalize(detalleTecnico.tsp?.tsa),
        },
      ],
    },
  ];
}

export async function buildSignedPdfWithTechnicalAppendix({
  pdfBytes,
  detalleTecnico,
}: BuildSignedPdfParams): Promise<Uint8Array> {
  const originalPdf = await PDFDocument.load(pdfBytes);
  const finalPdf = await PDFDocument.create();

  const copiedPages = await finalPdf.copyPages(
    originalPdf,
    originalPdf.getPageIndices()
  );

  copiedPages.forEach((page) => finalPdf.addPage(page));

  const regular = await finalPdf.embedFont(StandardFonts.Helvetica);
  const bold = await finalPdf.embedFont(StandardFonts.HelveticaBold);

  const pageWidth = 595;
  const pageHeight = 842;
  const margin = 35;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = 48;

  const sections = buildSections(detalleTecnico);

  let page = finalPdf.addPage([pageWidth, pageHeight]);
  let y = drawPageHeader(page, regular, bold, margin, 800);

  for (const section of sections) {
    const sectionHeight = estimateSectionHeight(
      section.rows,
      contentWidth,
      regular,
      bold
    );

    if (y - sectionHeight < bottomLimit) {
      page = finalPdf.addPage([pageWidth, pageHeight]);
      y = drawPageHeader(page, regular, bold, margin, 800);
    }

    y = drawSectionTitle(page, section.title, margin, y, contentWidth, bold);
    y -= 8;

    for (const row of section.rows) {
      const rowHeight = estimateRowHeight(row, contentWidth, regular, bold);

      if (y - rowHeight < bottomLimit) {
        page = finalPdf.addPage([pageWidth, pageHeight]);
        y = drawPageHeader(page, regular, bold, margin, 800);
        y = drawSectionTitle(
          page,
          `${section.title} (continuación)`,
          margin,
          y,
          contentWidth,
          bold
        );
        y -= 8;
      }

      y = drawAdaptiveRow(page, row, margin, y, contentWidth, regular, bold);
    }

    y -= 14;
  }

  return finalPdf.save();
}