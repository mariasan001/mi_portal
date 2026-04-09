import { NextRequest, NextResponse } from 'next/server';

type RouteContext = {
  params: Promise<{
    requestId: string;
  }>;
};

export async function GET(
  request: NextRequest,
  { params }: RouteContext
): Promise<NextResponse> {
  try {
    const { requestId } = await params;

    /**
     * Ajusta esta variable según tu proyecto.
     * Debe apuntar al backend real en 8092.
     */
    const backendBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8092';

    /**
     * Endpoint real del backend para descargar el PDF firmado.
     */
    const targetUrl = `${backendBaseUrl}/signature/api/v1/signature-requests/${encodeURIComponent(
      requestId
    )}/signed-pdf`;

    console.log('Proxy signed PDF:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/pdf',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      let errorBody: unknown = null;

      try {
        errorBody = await response.json();
      } catch {
        errorBody = {
          codigo: 'SIGN-PROXY-DOWNLOAD-ERROR',
          descripcion: 'El backend respondió con error al descargar el PDF.',
          data: null,
        };
      }

      return NextResponse.json(errorBody, {
        status: response.status,
      });
    }

    const pdfBuffer = await response.arrayBuffer();

    const contentType =
      response.headers.get('content-type') ?? 'application/pdf';

    const contentDisposition =
      response.headers.get('content-disposition') ??
      `inline; filename="signed-document-${requestId}.pdf"`;

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error en proxy de descarga de PDF firmado:', error);

    return NextResponse.json(
      {
        codigo: 'SIGN-PROXY-500',
        descripcion: 'Error al descargar el PDF firmado',
        data: null,
      },
      { status: 500 }
    );
  }
}