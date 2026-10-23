export default function Attribution({ view }) {
  const year = new Date().getFullYear()

  return (
    <footer className="attribution">
      <p>
        Weather data by{' '}
        <a href="https://open-meteo.com/" rel="noopener noreferrer" target="_blank">
          Open-Meteo.com
        </a>{' '}
        ·{' '}
        <a
          href="https://creativecommons.org/licenses/by/4.0/"
          rel="noopener noreferrer"
          target="_blank"
        >
          CC BY 4.0
        </a>
      </p>
      <p>
        As of {view.updatedLabel} {view.timezoneOffset} · © {year} Hawaayein
      </p>
    </footer>
  )
}
