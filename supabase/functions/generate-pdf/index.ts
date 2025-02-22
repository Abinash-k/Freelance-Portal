
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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

    // Generate PDF content
    const pdfContent = `
      INVOICE

      ${businessDetails ? `
      ${businessDetails.business_name || ''}
      ${businessDetails.address || ''}
      ` : ''}

      Bill To:
      ${invoice.client_name}

      Invoice Details:
      Title: ${invoice.title}
      Amount: $${invoice.amount.toFixed(2)}
      Due Date: ${new Date(invoice.due_date).toLocaleDateString()}
      Status: ${invoice.status}

      Description:
      ${invoice.content}
    `;

    // Convert the text content to a PDF-like format
    const encoder = new TextEncoder();
    const pdfBytes = encoder.encode(pdfContent);

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
