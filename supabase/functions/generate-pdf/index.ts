
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { PDFDocument, StandardFonts, rgb } from "https://cdn.skypack.dev/pdf-lib@1.17.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const { documentType, documentData } = await req.json();

    if (documentType !== 'invoice') {
      throw new Error('Invalid document type');
    }

    // Fetch invoice data from the database
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', documentData.invoice_id)
      .single();

    if (invoiceError) throw invoiceError;

    // Get business details for the invoice
    const { data: businessDetails, error: businessError } = await supabase
      .from('business_details')
      .select('*')
      .eq('user_id', invoice.user_id)
      .single();

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add content to the PDF
    page.drawText('INVOICE', {
      x: 50,
      y: height - 50,
      size: 24,
      font,
      color: rgb(0, 0, 0),
    });

    // Add business details if available
    let currentY = height - 100;
    if (businessDetails) {
      page.drawText(businessDetails.business_name || '', {
        x: 50,
        y: currentY,
        size: 12,
        font,
      });
      currentY -= 20;
      page.drawText(businessDetails.address || '', {
        x: 50,
        y: currentY,
        size: 12,
        font,
      });
      currentY -= 40;
    }

    // Add invoice details
    page.drawText(`Bill To: ${invoice.client_name}`, {
      x: 50,
      y: currentY,
      size: 12,
      font,
    });
    currentY -= 40;

    page.drawText(`Invoice Title: ${invoice.title}`, {
      x: 50,
      y: currentY,
      size: 12,
      font,
    });
    currentY -= 20;

    page.drawText(`Amount: $${invoice.amount.toFixed(2)}`, {
      x: 50,
      y: currentY,
      size: 12,
      font,
    });
    currentY -= 20;

    page.drawText(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, {
      x: 50,
      y: currentY,
      size: 12,
      font,
    });
    currentY -= 40;

    page.drawText('Description:', {
      x: 50,
      y: currentY,
      size: 12,
      font,
    });
    currentY -= 20;

    // Split content into lines for better formatting
    const contentLines = invoice.content.split('\n');
    for (const line of contentLines) {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 12,
        font,
      });
      currentY -= 15;
    }

    // Serialize the PDF document
    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${invoice.id}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
      }
    );
  }
});
