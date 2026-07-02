// ── FloTize — Shared JS ───────────────────────────────────────────────────

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
    form.addEventListener('submit', e => {
      e.preventDefault()
      const btn = form.querySelector('button[type="submit"]')
      const name = form.querySelector('#name')?.value?.trim()
      const email = form.querySelector('#email')?.value?.trim()
      const company = form.querySelector('#company')?.value?.trim()
      const message = form.querySelector('#message')?.value?.trim()

      if (!name || !email || !message) {
        alert('Please fill in all required fields.')
        return
      }

      // Detect page type — trial vs demo/contact
      const isTrial = window.location.pathname.includes('demo.html')
      const requestType = isTrial ? 'Trial Request' : 'Demo Request'

      // Build mailto link
      const subject = encodeURIComponent(`${requestType} — ${company || name}`)
      const body = encodeURIComponent(
        `Type: ${requestType}\nName: ${name}\nCompany: ${company || 'Not provided'}\nEmail: ${email}\nPhone: ${form.querySelector('#phone')?.value?.trim() || 'Not provided'}\n\nMessage:\n${message}`
      )
      window.location.href = `mailto:micheal.sheehan@flotize.com?subject=${subject}&body=${body}`

      // Show success
      form.innerHTML = `
        <div style="text-align:center;padding:3rem 1rem;">
          <div style="font-size:3rem;margin-bottom:1rem;">✅</div>
          <h3 style="margin-bottom:0.5rem;color:#0C1117">${isTrial ? 'Trial request sent!' : 'Request sent!'}</h3>
          <p style="color:#6B7280">Thanks ${name} — ${isTrial ? "we'll set up your trial account and be in touch within one business day." : "we'll be in touch within one business day to arrange your demo."}</p>
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