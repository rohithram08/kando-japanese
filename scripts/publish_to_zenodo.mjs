import fs from 'node:fs';
import path from 'node:path';

// Usage:
// node scripts/publish_to_zenodo.mjs <ZENODO_TOKEN> [--sandbox] [--publish]
// Or set process.env.ZENODO_TOKEN

const args = process.argv.slice(2);
const token = args.find(a => !a.startsWith('--')) || process.env.ZENODO_TOKEN;
const isSandbox = args.includes('--sandbox');
const shouldPublish = args.includes('--publish');

const baseUrl = isSandbox 
  ? 'https://sandbox.zenodo.org/api' 
  : 'https://zenodo.org/api';

if (!token) {
  console.log('----------------------------------------------------------------');
  console.log(' ZENODO AUTOMATED DOI PUBLISHER & ARCHIVER');
  console.log('----------------------------------------------------------------');
  console.log('No Zenodo personal access token provided.');
  console.log('\nTo publish directly from the command line:');
  console.log('1. Go to https://zenodo.org/account/settings/applications/tokens/new');
  console.log('2. Check scopes: "deposit:actions" and "deposit:write"');
  console.log('3. Copy your token and run:');
  console.log('   node scripts/publish_to_zenodo.mjs YOUR_TOKEN --publish');
  console.log('\n(Use --sandbox to test against sandbox.zenodo.org first)');
  console.log('----------------------------------------------------------------');
  process.exit(1);
}

const pdfPath = path.resolve('docs/kando_japanese_research_paper.pdf');
const mdPath = path.resolve('docs/RESEARCH_PAPER.md');

if (!fs.existsSync(pdfPath)) {
  console.error('Error: PDF file not found at', pdfPath);
  console.log('Run "node scripts/generate_paper_pdf.mjs" first.');
  process.exit(1);
}

const metadata = {
  metadata: {
    title: 'Kando (感動): A Cognitive-Load-Aware, Multilingual Architecture for Spaced Retrieval and Immersion-Driven Japanese Language Acquisition',
    upload_type: 'publication',
    publication_type: 'article',
    description: 'Second-language acquisition (SLA) for non-cognate logographic languages—specifically Japanese across JLPT N5 through N1—suffers from historically high learner attrition. Kando Japanese (感動) introduces a full-stack, distributed pedagogical architecture synthesizing Krashen\'s Comprehensible Input (i+1) with a 250-story tiered Graded Reader (Tadoku), an interactive SVG vector-decomposition Kanji stroke engine (831 Joyo Kanji), a timezone-normalized SuperMemo SM-2 spaced repetition algorithm with intensity scheduling, and a contextual multi-LLM pedagogical companion (Sensei 3D) with deterministic semantic guardrails across 12 UI locales including Tamil and Hindi.',
    creators: [
      {
        name: 'Rohith Ram H',
        affiliation: 'Kando Japanese Project'
      }
    ],
    access_right: 'open',
    license: 'MIT',
    keywords: [
      'Japanese Language Acquisition',
      'JLPT',
      'Spaced Repetition System',
      'SuperMemo SM-2',
      'Graded Reader',
      'Tadoku',
      'Kanji Stroke Vector Decomposition',
      'Cognitive Load Theory',
      'Comprehensible Input',
      'Multilingual CALL',
      'Tamil-Japanese Syntactic Transfer',
      'Hindi-Japanese Syntactic Transfer'
    ],
    related_identifiers: [
      {
        identifier: 'https://kando-japanese.vercel.app',
        relation: 'isDocumentedBy',
        scheme: 'url'
      },
      {
        identifier: 'https://github.com/rohithram08/kando-japanese',
        relation: 'isSupplementTo',
        scheme: 'url'
      }
    ]
  }
};

async function run() {
  console.log(`Connecting to Zenodo (${isSandbox ? 'Sandbox' : 'Production'})...`);

  // 1. Create Deposition
  const createRes = await fetch(`${baseUrl}/deposit/depositions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create deposition: ${createRes.status} ${errText}`);
  }

  const deposition = await createRes.json();
  const depositionId = deposition.id;
  const bucketUrl = deposition.links.bucket;
  console.log(`✓ Deposition created with ID: ${depositionId}`);
  console.log(`  Bucket: ${bucketUrl}`);

  // 2. Upload PDF
  console.log('Uploading academic PDF...');
  const pdfBytes = fs.readFileSync(pdfPath);
  const uploadPdfRes = await fetch(`${bucketUrl}/kando_japanese_research_paper.pdf`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/pdf'
    },
    body: pdfBytes
  });

  if (!uploadPdfRes.ok) {
    throw new Error(`Failed to upload PDF: ${uploadPdfRes.status} ${await uploadPdfRes.text()}`);
  }
  console.log('✓ kando_japanese_research_paper.pdf uploaded successfully.');

  // 3. Upload Markdown
  console.log('Uploading Markdown source...');
  const mdBytes = fs.readFileSync(mdPath);
  const uploadMdRes = await fetch(`${bucketUrl}/RESEARCH_PAPER.md`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/markdown'
    },
    body: mdBytes
  });

  if (!uploadMdRes.ok) {
    throw new Error(`Failed to upload Markdown: ${uploadMdRes.status} ${await uploadMdRes.text()}`);
  }
  console.log('✓ RESEARCH_PAPER.md uploaded successfully.');

  // 4. Update Metadata
  console.log('Setting bibliographic metadata...');
  const metaRes = await fetch(`${baseUrl}/deposit/depositions/${depositionId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(metadata)
  });

  if (!metaRes.ok) {
    throw new Error(`Failed to update metadata: ${metaRes.status} ${await metaRes.text()}`);
  }
  console.log('✓ Metadata successfully synchronized.');

  // 5. Publish if flag is passed
  if (shouldPublish) {
    console.log('Publishing deposition and minting permanent DOI...');
    const pubRes = await fetch(`${baseUrl}/deposit/depositions/${depositionId}/actions/publish`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!pubRes.ok) {
      throw new Error(`Failed to publish: ${pubRes.status} ${await pubRes.text()}`);
    }

    const publishedRecord = await pubRes.json();
    console.log('\n================================================================');
    console.log(' SUCCESS! YOUR RESEARCH PAPER IS OFFICIALLY PUBLISHED ON ZENODO!');
    console.log('================================================================');
    console.log(`Permanent DOI:    ${publishedRecord.doi}`);
    console.log(`DOI URL:          ${publishedRecord.doi_url}`);
    console.log(`Record URL:       ${publishedRecord.links.record_html}`);
    console.log(`DataCite Badge:   https://zenodo.org/badge/DOI/${publishedRecord.doi}.svg`);
    console.log('================================================================\n');
  } else {
    console.log('\n================================================================');
    console.log(' DRAFT DEPOSITION READY ON ZENODO');
    console.log('================================================================');
    console.log(`Deposition ID:    ${depositionId}`);
    console.log(`Preview URL:      ${deposition.links.html}`);
    console.log('To publish and mint the permanent DOI, run with --publish flag,');
    console.log('or visit the Preview URL above and click "Publish".');
    console.log('================================================================\n');
  }
}

run().catch(err => {
  console.error('\nZenodo operation failed:', err.message);
  process.exit(1);
});
