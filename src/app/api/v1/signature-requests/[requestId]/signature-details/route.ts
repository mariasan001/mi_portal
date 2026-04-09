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
     * Importante:
     * aquí SÍ debe llevar /signature-details
     */
    const targetUrl = `${backendBaseUrl}/signature/api/v1/signature-requests/${encodeURIComponent(
      requestId
    )}/signature-details`;

    console.log('Proxy detalle técnico firma:', targetUrl);

    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    const data = await response.json();

    console.log('Respuesta backend detalle técnico:', data);

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error(' Error en proxy de detalle técnico:', error);

    return NextResponse.json(
      {
        codigo: 'SIGN-PROXY-500',
        descripcion: 'Error al consultar el detalle técnico de la firma',
        data: null,
      },
      { status: 500 }
    );
  }
}