// ── FloTize — Shared JS ───────────────────────────────────────────────────

// Where the website forms are posted (Azure Function ContactForm on the FloTize API).
const FORM_ENDPOINT = 'https://flowdesk-api-eu-cfcmf0c4e2h5bqb3.westeurope-01.azurewebsites.net/api/ContactForm'

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle')
  const links = document.querySelector('.nav-links')
  const cta = document.querySelector('.nav-cta')

  if (toggle) {
    toggle.addEventListener('click', () => {
      links?.classList.toggle('open')
      cta?.classList.toggle('open')
      toggle.textContent = links?.classList.contains('open') ? '✕' : '☰'
    })
  }

  // Active nav link
  const current = window.location.pathname.split('/').pop() || 'index.html'
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href')?.split('/').pop()
    if (href === current) a.classList.add('active')
  })

  // Demo form handler
  const form = document.getElementById('demo-form')
  if (form) {
    // Links such as demo.html?type=demo or ?type=trial preselect what the visitor asked for
    const kindSelect = form.querySelector('#request-kind')
    const wanted = new URLSearchParams(window.location.search).get('type')
    if (kindSelect && (wanted === 'trial' || wanted === 'demo')) kindSelect.value = wanted
    form.addEventListener('submit', async e => {
      e.preventDefault()
      const btn = form.querySelector('button[type="submit"]')
      const val = id => form.querySelector('#' + id)?.value?.trim() || ''
      const name = val('name'), email = val('email'), company = val('company'), message = val('message')

      if (!name || !email || !message) {
        alert('Please fill in all required fields.')
        return
      }

      // Detect request type: on the trial/demo page the visitor chooses; the contact page is a plain contact form
      const onDemoPage = window.location.pathname.includes('demo.html')
      const isTrial = onDemoPage && val('request-kind') !== 'demo'
      const requestType = onDemoPage ? (isTrial ? 'Trial Request' : 'Demo Request') : (form.querySelector('#subject') ? 'Contact' : 'Demo Request')
      const fields = {
        type: requestType, name, email, company, message,
        phone: val('phone'), businessType: val('business-type'), teamSize: val('team-size'), topic: val('subject'),
        website: val('website') // hidden spam trap; real visitors leave it empty
      }

      const originalLabel = btn ? btn.textContent : ''
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…' }

      let sent = false
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(fields)
        })
        if (res.status === 400 || res.status === 429) {
          const data = await res.json().catch(() => ({}))
          alert(data.error || 'Please check your details and try again.')
          if (btn) { btn.disabled = false; btn.textContent = originalLabel }
          return
        }
        sent = res.ok
      } catch (err) {
        sent = false
      }

      if (!sent) {
        // The form service could not be reached: fall back to the visitor's mail app so the message is not lost.
        const subject = encodeURIComponent(`${requestType} — ${company || name}`)
        const body = encodeURIComponent(
          `Type: ${requestType}\nName: ${name}\nCompany: ${company || 'Not provided'}\nEmail: ${email}\nPhone: ${fields.phone || 'Not provided'}\nBusiness type: ${fields.businessType || 'Not provided'}\nTeam size: ${fields.teamSize || 'Not provided'}\nTopic: ${fields.topic || 'Not provided'}\n\nMessage:\n${message}`
        )
        window.location.href = `mailto:info@flotize.com?subject=${subject}&body=${body}`
      }

      const safeName = name.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
      const okText = isTrial
        ? "we'll set up your trial account and be in touch within one business day."
        : (requestType === 'Contact' ? "we'll get back to you within one business day." : "we'll be in touch within one business day to arrange your demo.")
      const fallbackText = 'your email app should have opened with your message ready to send. Please press send there, or email info@flotize.com directly.'
      form.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <div style="font-size:3rem;margin-bottom:1rem;">${sent ? '✅' : '✉️'}</div>
          <h3 style="margin-bottom:0.5rem;color:#0C1117">${sent ? (isTrial ? 'Trial request sent!' : (requestType === 'Demo Request' ? 'Demo request sent!' : 'Message sent!')) : 'One more step'}</h3>
          <p style="color:#6B7280">Thanks ${safeName} — ${sent ? okText : fallbackText}</p>
        </div>
      `
    })
  }

  // Scroll reveal
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1'
        e.target.style.transform = 'translateY(0)'
        observer.unobserve(e.target)
      }
    })
  }, { threshold: 0.1 })

  document.querySelectorAll('.reveal').forEach(el => {
    el.style.opacity = '0'
    el.style.transform = 'translateY(20px)'
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease'
    observer.observe(el)
  })
})