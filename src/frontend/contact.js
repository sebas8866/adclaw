import { pageWrapper } from './shared.js';
import { SITE_HOST, SITE_ORIGIN, CONTACT_EMAIL } from './legal.js';

export function contactPage({ isLoggedIn = false } = {}) {
  return pageWrapper({
    title: 'Contact',
    activeNav: 'contact',
    publicNav: !isLoggedIn,
    body: `
  <style>
    .contact-wrap {
      padding: 96px 26px 120px;
      max-width: 560px;
      margin: 0 auto;
    }
    .contact-kicker {
      font-family: var(--font-mono);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 14px;
    }
    .contact-wrap h1 {
      font-family: var(--font-display);
      font-size: clamp(28px, 4vw, 34px);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin-bottom: 10px;
    }
    .contact-wrap .lead {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.65;
      margin-bottom: 28px;
    }
    .contact-card {
      border: 1px solid rgba(127, 166, 255, 0.24);
      background: rgba(12, 19, 36, 0.88);
      border-radius: 20px;
      padding: 26px;
    }
    .contact-card .form-group { margin-bottom: 18px; }
    .contact-card .form-group:last-of-type { margin-bottom: 0; }
    .contact-card textarea.form-input {
      min-height: 140px;
      resize: vertical;
    }
    .contact-hp {
      position: absolute;
      left: -9999px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
    .contact-foot {
      margin-top: 20px;
      font-size: 13px;
      color: var(--text-muted);
      line-height: 1.6;
    }
    .contact-foot a {
      color: var(--primary);
      text-decoration: underline;
      text-underline-offset: 2px;
    }
  </style>

  <div class="contact-wrap">
    <div class="contact-kicker">Enterprise</div>
    <h1>Contact us</h1>
    <p class="lead">Tell us about your Meta ad operations and we will follow up. For fastest routing, include team size and regions you run in.</p>

    <div class="contact-card">
      <form id="contact-form" onsubmit="handleContactSubmit(event)">
        <div class="contact-hp" aria-hidden="true">
          <label for="contact-website">Website</label>
          <input type="text" name="website" id="contact-website" tabindex="-1" autocomplete="off">
        </div>
        <div class="form-group">
          <label for="contact-name">Name</label>
          <input type="text" id="contact-name" name="name" class="form-input" required maxlength="120" autocomplete="name" placeholder="Your name">
        </div>
        <div class="form-group">
          <label for="contact-email">Work email</label>
          <input type="email" id="contact-email" name="email" class="form-input" required maxlength="254" autocomplete="email" placeholder="you@company.com">
        </div>
        <div class="form-group">
          <label for="contact-company">Company <span style="color:var(--text-dim);font-weight:400;">(optional)</span></label>
          <input type="text" id="contact-company" name="company" class="form-input" maxlength="200" autocomplete="organization" placeholder="Company or brand">
        </div>
        <div class="form-group">
          <label for="contact-message">How can we help?</label>
          <textarea id="contact-message" name="message" class="form-input" required maxlength="8000" placeholder="Goals, ad spend range, timelines…"></textarea>
        </div>
        <button type="submit" id="btn-contact" class="btn btn-primary" style="width:100%;justify-content:center;margin-top:8px;">Send message</button>
      </form>
    </div>
    <p class="contact-foot">The live app is on Vercel at <a href="${SITE_ORIGIN}">${SITE_HOST}</a>. Use this form for inquiries — we also monitor <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>.</p>
  </div>
`,
    scripts: `
  <script>
    async function handleContactSubmit(e) {
      e.preventDefault();
      var form = document.getElementById('contact-form');
      var btn = document.getElementById('btn-contact');
      var website = document.getElementById('contact-website').value;
      if (website) {
        showToast('Thanks — we will get back to you.', 'success');
        return;
      }

      var payload = {
        name: document.getElementById('contact-name').value.trim(),
        email: document.getElementById('contact-email').value.trim(),
        company: document.getElementById('contact-company').value.trim(),
        message: document.getElementById('contact-message').value.trim(),
        website: ''
      };

      btn.disabled = true;
      btn.textContent = 'Sending…';

      try {
        var res = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        var data = await res.json().catch(function() { return {}; });
        if (!res.ok) throw new Error(data.error || 'Request failed');
        showToast('Thanks — we received your message and will reply soon.', 'success');
        form.reset();
      } catch (err) {
        showToast(err.message || 'Something went wrong', 'error');
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send message';
      }
    }
  </script>
`,
  });
}
