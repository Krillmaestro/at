import supabase from '../../lib/supabaseClient'

export default async function handler(req, res) {
  // Tillåt CORS för n8n webhook
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Metoden är inte tillåten' })
  }

  try {
    const data = req.body

    // Validera inkommande data
    if (!data.analysis_id || !data.url || !data.results) {
      return res.status(400).json({ error: 'Ogiltig data - saknar obligatoriska fält' })
    }

    // Spara till Supabase
    const { data: savedAudit, error } = await supabase
      .from('landing_page_audits')
      .insert([
        {
          analysis_id: data.analysis_id,
          url: data.url,
          email: data.email,
          industry: data.industry,
          primary_goal: data.primary_goal,
          current_conversion: data.current_conversion,
          biggest_frustration: data.biggest_frustration,
          page_title: data.page_data?.title,
          meta_description: data.page_data?.meta_description,
          h1_headings: data.page_data?.h1_headings,
          h2_headings: data.page_data?.h2_headings,
          cta_buttons: data.page_data?.cta_buttons,
          form_count: data.page_data?.form_count,
          word_count: data.page_data?.word_count,
          image_count: data.page_data?.image_count,
          images_with_alt: data.page_data?.images_with_alt,
          has_mobile_viewport: data.page_data?.has_mobile_viewport,
          detected_tech: data.page_data?.detected_tech,
          grade: data.results?.grade,
          score: data.results?.score,
          design_analysis: data.results?.design_analysis,
          copy_analysis: data.results?.copy_analysis,
          seo_analysis: data.results?.seo_analysis,
          strategy_analysis: data.results?.strategy_analysis,
          created_at: data.timestamp || new Date().toISOString()
        }
      ])
      .select()

    if (error) {
      console.error('Supabase fel:', error)
      return res.status(500).json({ error: 'Kunde inte spara analys', details: error.message })
    }

    return res.status(200).json({
      success: true,
      message: 'Analys sparad',
      id: savedAudit?.[0]?.id
    })
  } catch (error) {
    console.error('Serverfel:', error)
    return res.status(500).json({ error: 'Internt serverfel' })
  }
}
