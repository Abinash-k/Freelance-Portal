
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { PDFDocument, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { format } from "https://esm.sh/date-fns@2.30.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { documentType, documentData } = await req.json();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const fontSize = 12;

    // Get the standard Helvetica font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    // Draw header
    page.drawText(documentType === 'invoice' ? 'INVOICE' : 'CONTRACT', {
      x: 50,
      y: height - 50,
      size: 30,
      font: boldFont,
    });

    // Draw business info
    page.drawText(documentData.businessDetails.business_name, {
      x: width - 200,
      y: height - 50,
      size: 16,
      font: boldFont,
    });

    page.drawText(documentData.businessDetails.address || '', {
      x: width - 200,
      y: height - 70,
      size: fontSize,
      font,
    });

    // Draw client info
    page.drawText('Client:', {
      x: 50,
      y: height - 120,
      size: fontSize,
      font: boldFont,
    });

    page.drawText(documentData.client_name, {
      x: 50,
      y: height - 140,
      size: fontSize,
      font,
    });

    // Draw document details
    let yPosition = height - 200;

    if (documentType === 'invoice') {
      const details = [
        { label: 'Invoice Number:', value: documentData.invoice_number },
        { label: 'Issue Date:', value: format(new Date(documentData.issue_date), 'MMMM dd, yyyy') },
        { label: 'Due Date:', value: format(new Date(documentData.due_date), 'MMMM dd, yyyy') },
        { label: 'Status:', value: documentData.status },
        { label: 'Amount:', value: `$${documentData.amount.toFixed(2)}` },
      ];

      details.forEach(({ label, value }) => {
        page.drawText(label, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: boldFont,
        });

        page.drawText(value.toString(), {
          x: 150,
          y: yPosition,
          size: fontSize,
          font,
        });

        yPosition -= 25;
      });
    } else {
      // Contract details
      const details = [
        { label: 'Project Name:', value: documentData.project_name },
        { label: 'Start Date:', value: documentData.start_date ? format(new Date(documentData.start_date), 'MMMM dd, yyyy') : 'TBD' },
        { label: 'End Date:', value: documentData.end_date ? format(new Date(documentData.end_date), 'MMMM dd, yyyy') : 'TBD' },
        { label: 'Contract Value:', value: documentData.value ? `$${documentData.value.toFixed(2)}` : 'TBD' },
        { label: 'Status:', value: documentData.status },
      ];

      details.forEach(({ label, value }) => {
        page.drawText(label, {
          x: 50,
          y: yPosition,
          size: fontSize,
          font: boldFont,
        });

        page.drawText(value.toString(), {
          x: 150,
          y: yPosition,
          size: fontSize,
          font,
        });

        yPosition -= 25;
      });
    }

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    return new Response(pdfBytes, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${documentType}-${documentData.client_name}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
