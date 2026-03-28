import { pageWrapper } from './shared.js';

const COMPANY = 'AdClaw';
const DOMAIN = 'adclaw-ruddy.vercel.app';
const CONTACT_EMAIL = 'support@adclaw.ai';
const EFFECTIVE_DATE = 'March 27, 2026';

function legalStyles() {
  return `
  <style>
    .legal-wrap {
      padding: 102px 0 124px;
      max-width: 720px;
      margin: 0 auto;
    }
    .legal-wrap h1 {
      font-family: var(--font-display);
      font-size: clamp(28px, 4vw, 36px);
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.15;
      color: var(--text);
      margin-bottom: 8px;
    }
    .legal-wrap .legal-date {
      font-size: 13px;
      color: var(--text-dim);
      font-family: var(--font-mono);
      margin-bottom: 40px;
    }
    .legal-wrap h2 {
      font-family: var(--font-display);
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text);
      margin-top: 36px;
      margin-bottom: 12px;
    }
    .legal-wrap h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--text);
      margin-top: 24px;
      margin-bottom: 8px;
    }
    .legal-wrap p, .legal-wrap li {
      font-size: 14px;
      color: var(--text-secondary);
      line-height: 1.75;
      margin-bottom: 12px;
    }
    .legal-wrap ul {
      padding-left: 20px;
      margin-bottom: 16px;
    }
    .legal-wrap ul li {
      margin-bottom: 6px;
    }
    .legal-wrap a {
      color: var(--primary);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
    .legal-back {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13px;
      color: var(--text-dim);
      margin-bottom: 24px;
      text-decoration: none;
    }
    .legal-back:hover { color: var(--text-secondary); }
  </style>`;
}

export function privacyPage() {
  return pageWrapper({
    title: 'Privacy Policy',
    publicNav: true,
    body: `
  ${legalStyles()}
  <section class="legal-wrap container">
    <a href="/" class="legal-back">&larr; Back to home</a>
    <h1>Privacy Policy</h1>
    <div class="legal-date">Effective: ${EFFECTIVE_DATE}</div>

    <p>${COMPANY} ("we", "us", "our") operates the website at <strong>https://${DOMAIN}</strong> (the "Service"). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service.</p>

    <h2>1. Information We Collect</h2>
    <h3>Account Information</h3>
    <p>When you create an account, we collect your email address and password (hashed). If you sign in through a third-party provider, we receive your name and email from that provider.</p>
    <h3>Third-Party Platform Data</h3>
    <p>When you connect your Facebook (Meta) account, we access:</p>
    <ul>
      <li>Your Facebook user ID and name</li>
      <li>A list of ad accounts you manage (account ID, name, status, currency, timezone)</li>
      <li>Campaign, ad set, and ad performance data (impressions, clicks, spend, conversions) for the ad account you select</li>
    </ul>
    <p>We access this data solely to manage and optimize advertising campaigns on your behalf. We do not access your personal Facebook posts, photos, friends list, or messages.</p>
    <h3>Usage Data</h3>
    <p>We automatically collect standard server logs including IP address, browser type, pages visited, and timestamps.</p>

    <h2>2. How We Use Your Information</h2>
    <ul>
      <li>To provide, operate, and maintain the Service</li>
      <li>To create and manage advertising campaigns on platforms you connect</li>
      <li>To analyze ad performance and optimize campaign spend</li>
      <li>To communicate with you about your account or the Service</li>
      <li>To detect and prevent fraud or abuse</li>
    </ul>

    <h2>3. Data Sharing</h2>
    <p>We do not sell your personal data. We may share data with:</p>
    <ul>
      <li><strong>Advertising platforms</strong> (Meta, Google) — only the data required to manage campaigns on your behalf, using the access you explicitly granted</li>
      <li><strong>Infrastructure providers</strong> (hosting, database) — under strict data processing agreements</li>
      <li><strong>Legal requirements</strong> — if required by law, regulation, or legal process</li>
    </ul>

    <h2>4. Data Retention</h2>
    <p>We retain your data for as long as your account is active. Campaign performance data is retained for up to 24 months for historical reporting. You may request deletion at any time (see Section 7).</p>

    <h2>5. Data Security</h2>
    <p>We use industry-standard measures including encrypted connections (TLS), encrypted storage of access tokens, and secure cookie handling. No method of transmission over the Internet is 100% secure, but we strive to protect your data.</p>

    <h2>6. Cookies</h2>
    <p>We use essential cookies for authentication (session tokens) and to remember your connected ad accounts. We do not use tracking or advertising cookies.</p>

    <h2>7. Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li><strong>Access</strong> — request a copy of the data we hold about you</li>
      <li><strong>Correct</strong> — update inaccurate information</li>
      <li><strong>Delete</strong> — request deletion of your account and all associated data</li>
      <li><strong>Disconnect</strong> — revoke platform access at any time from within the app or directly from Facebook's app settings</li>
      <li><strong>Portability</strong> — receive your data in a structured, machine-readable format</li>
    </ul>
    <p>To exercise any of these rights, contact us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> or use the <a href="/data-deletion">data deletion</a> page.</p>

    <h2>8. Facebook Data Deletion</h2>
    <p>You can request deletion of all data we received from Facebook by visiting our <a href="/data-deletion">Data Deletion</a> page or by removing ${COMPANY} from your <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener">Facebook App Settings</a>. We process deletion requests within 30 days.</p>

    <h2>9. Children's Privacy</h2>
    <p>The Service is not directed to individuals under 18. We do not knowingly collect data from minors.</p>

    <h2>10. Changes to This Policy</h2>
    <p>We may update this policy from time to time. We will notify you of material changes by posting the new policy on this page with an updated effective date.</p>

    <h2>11. Contact Us</h2>
    <p>If you have questions about this Privacy Policy, contact us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
  </section>
`
  });
}

export function termsPage() {
  return pageWrapper({
    title: 'Terms of Service',
    publicNav: true,
    body: `
  ${legalStyles()}
  <section class="legal-wrap container">
    <a href="/" class="legal-back">&larr; Back to home</a>
    <h1>Terms of Service</h1>
    <div class="legal-date">Effective: ${EFFECTIVE_DATE}</div>

    <p>These Terms of Service ("Terms") govern your use of ${COMPANY} ("we", "us", "our") at <strong>https://${DOMAIN}</strong> (the "Service"). By using the Service, you agree to these Terms.</p>

    <h2>1. Eligibility</h2>
    <p>You must be at least 18 years old and have the legal authority to bind yourself or your organization to these Terms. By connecting an advertising account, you represent that you are authorized to manage that account.</p>

    <h2>2. Account Responsibilities</h2>
    <ul>
      <li>You are responsible for maintaining the security of your account credentials</li>
      <li>You are responsible for all activity that occurs under your account</li>
      <li>You must provide accurate and complete information when creating an account</li>
      <li>You must promptly notify us of any unauthorized use of your account</li>
    </ul>

    <h2>3. The Service</h2>
    <p>${COMPANY} provides AI-powered advertising campaign management. When you connect your advertising accounts, we may:</p>
    <ul>
      <li>Read campaign performance data and account information</li>
      <li>Create, modify, pause, or stop advertising campaigns</li>
      <li>Adjust budgets, targeting, and creative within parameters you set</li>
      <li>Generate reports and recommendations</li>
    </ul>
    <p>You acknowledge that ad campaigns involve real spending. While we optimize for performance, we do not guarantee specific results, return on ad spend, or outcomes.</p>

    <h2>4. Advertising Platform Compliance</h2>
    <p>You are responsible for ensuring your use of ${COMPANY} complies with the advertising policies of connected platforms (e.g., Meta Advertising Standards, Google Ads policies). We make reasonable efforts to comply, but ultimate responsibility for ad content and targeting rests with you.</p>

    <h2>5. Acceptable Use</h2>
    <p>You agree not to:</p>
    <ul>
      <li>Use the Service for illegal, deceptive, or fraudulent purposes</li>
      <li>Violate any advertising platform's terms of service</li>
      <li>Attempt to reverse engineer, hack, or disrupt the Service</li>
      <li>Share your account credentials with unauthorized parties</li>
      <li>Use the Service to promote prohibited content (weapons, drugs, hate speech, etc.)</li>
    </ul>

    <h2>6. Intellectual Property</h2>
    <p>The Service, including its design, code, and AI models, is owned by ${COMPANY}. Ad creatives and campaign data you provide remain yours. You grant us a limited license to use your content solely to provide the Service.</p>

    <h2>7. Limitation of Liability</h2>
    <p>To the maximum extent permitted by law, ${COMPANY} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, data, or business opportunities, arising from your use of the Service. Our total liability shall not exceed the fees you paid to us in the 12 months preceding the claim.</p>

    <h2>8. Disclaimer of Warranties</h2>
    <p>The Service is provided "as is" and "as available" without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.</p>

    <h2>9. Termination</h2>
    <p>You may terminate your account at any time by contacting us. We may suspend or terminate your access if you violate these Terms. Upon termination, we will delete your data in accordance with our Privacy Policy.</p>

    <h2>10. Changes to Terms</h2>
    <p>We may update these Terms from time to time. Continued use of the Service after changes constitutes acceptance. We will notify you of material changes via email or in-app notice.</p>

    <h2>11. Governing Law</h2>
    <p>These Terms are governed by the laws of the jurisdiction in which ${COMPANY} operates, without regard to conflict of law provisions.</p>

    <h2>12. Contact</h2>
    <p>Questions about these Terms? Contact us at <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
  </section>
`
  });
}

export function dataDeletionPage() {
  return pageWrapper({
    title: 'Data Deletion',
    publicNav: true,
    body: `
  ${legalStyles()}
  <style>
    .deletion-card {
      border-radius: var(--r-xl);
      padding: 32px 36px;
      margin-top: 24px;
    }
    .deletion-card .form-group { margin-bottom: 20px; }
    .deletion-status {
      display: none;
      margin-top: 20px;
      padding: 16px 20px;
      border-radius: var(--r-md);
      font-size: 14px;
      line-height: 1.6;
    }
    .deletion-status.is-success {
      display: block;
      background: rgba(16, 185, 129, 0.08);
      border: 1px solid rgba(16, 185, 129, 0.2);
      color: var(--green);
    }
    .deletion-status.is-error {
      display: block;
      background: rgba(239, 68, 68, 0.08);
      border: 1px solid rgba(239, 68, 68, 0.2);
      color: var(--red, #ef4444);
    }
  </style>
  <section class="legal-wrap container">
    <a href="/" class="legal-back">&larr; Back to home</a>
    <h1>Data Deletion</h1>
    <div class="legal-date">Your data, your choice</div>

    <p>${COMPANY} takes your privacy seriously. You can request complete deletion of all data we hold about you, including any data received from Facebook or other connected platforms.</p>

    <h2>What gets deleted</h2>
    <ul>
      <li>Your ${COMPANY} account and profile</li>
      <li>All connected platform tokens and credentials</li>
      <li>Ad account references and cached data</li>
      <li>Campaign history, reports, and analytics stored in ${COMPANY}</li>
      <li>All cookies and session data</li>
    </ul>

    <h2>How to request deletion</h2>

    <h3>Option 1: From this page</h3>
    <div class="card deletion-card">
      <div class="form-group">
        <label for="del-email">Email address on your account</label>
        <input type="email" id="del-email" class="form-input" placeholder="you@example.com">
      </div>
      <div class="form-group">
        <label for="del-reason">Reason (optional)</label>
        <textarea id="del-reason" class="form-input" rows="2" placeholder="Why are you requesting deletion?"></textarea>
      </div>
      <button type="button" id="btn-delete" class="btn btn-primary" onclick="submitDeletion()">Request data deletion</button>
      <div id="del-status" class="deletion-status"></div>
    </div>

    <h3>Option 2: From Facebook</h3>
    <p>You can also remove ${COMPANY} directly from your Facebook account:</p>
    <ul>
      <li>Go to <a href="https://www.facebook.com/settings?tab=applications" target="_blank" rel="noopener">Facebook Settings &rarr; Apps and Websites</a></li>
      <li>Find "${COMPANY}" and click "Remove"</li>
      <li>This will trigger automatic deletion of all Facebook data we hold</li>
    </ul>

    <h3>Option 3: Email us</h3>
    <p>Send a deletion request to <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> from the email associated with your account.</p>

    <h2>Timeline</h2>
    <p>We process all deletion requests within <strong>30 days</strong>. You will receive a confirmation email once deletion is complete. Some anonymized, aggregated data may be retained for analytics purposes but cannot be linked back to you.</p>

    <h2>Confirmation</h2>
    <p>After submitting a request, you'll receive a confirmation code. You can check the status of your request at any time by contacting <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a> with your confirmation code.</p>
  </section>
`,
    scripts: `
  <script>
    async function submitDeletion() {
      var email = document.getElementById('del-email').value.trim();
      var reason = document.getElementById('del-reason').value.trim();
      var status = document.getElementById('del-status');
      var btn = document.getElementById('btn-delete');

      if (!email || !email.includes('@')) {
        status.className = 'deletion-status is-error';
        status.textContent = 'Please enter a valid email address.';
        return;
      }

      btn.disabled = true;
      btn.textContent = 'Submitting\\u2026';

      try {
        var resp = await fetch('/api/data-deletion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, reason: reason }),
        });
        var data = await resp.json();

        if (resp.ok) {
          status.className = 'deletion-status is-success';
          status.innerHTML = 'Deletion request received. Your confirmation code is <strong>' +
            (data.confirmationCode || 'N/A') + '</strong>. We will process your request within 30 days and email you when complete.';
          btn.textContent = 'Request submitted';
        } else {
          throw new Error(data.error || 'Request failed');
        }
      } catch (e) {
        status.className = 'deletion-status is-error';
        status.textContent = 'Error: ' + e.message;
        btn.disabled = false;
        btn.textContent = 'Request data deletion';
      }
    }
  </script>
`
  });
}
