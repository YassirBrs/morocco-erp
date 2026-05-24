export default function ComptabilitePage() {
  return (
    <main className="modulePage">
      <h1>Comptabilité</h1>
      <div className="modules">
        {['PCGE', 'Journaux', 'TVA', 'Lettrage', 'Clôture', 'Preuves'].map((item) => (
          <div className="module" key={item}><strong>{item}</strong><span>Contrôle comptable, exports et périodes verrouillées.</span></div>
        ))}
      </div>
    </main>
  );
}
