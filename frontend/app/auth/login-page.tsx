'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Mode = 'login' | 'register';

export function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('direction@atlas.ma');
  const [password, setPassword] = useState('MoroccoERP2026');
  const [company, setCompany] = useState('Atlas Distribution SARL');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage('');
    setError('');

    if (!email.includes('@') || !email.includes('.')) {
      setError('Adresse e-mail invalide. Utilisez une adresse professionnelle complète.');
      return;
    }

    if (password.length < 8) {
      setError('Mot de passe trop court. Minimum 8 caractères pour ouvrir une session sécurisée.');
      return;
    }

    if (mode === 'register' && company.trim().length < 3) {
      setError('Raison sociale obligatoire pour créer un tenant Morocco ERP.');
      return;
    }

    const session = {
      email,
      userName: mode === 'register' ? company : 'Direction Atlas',
      role: 'Direction',
      tenantId: 'tenant-demo',
      issuedAt: new Date().toISOString(),
    };
    window.localStorage.setItem('morocco-erp-session', JSON.stringify(session));
    setMessage(mode === 'login' ? 'Session sécurisée ouverte.' : 'Tenant de démonstration préparé.');
    window.setTimeout(() => router.push('/crm'), 450);
  };

  return (
    <main className="authPage">
      <section className="authPanel" aria-labelledby="auth-title">
        <a className="brandLockup" href="/">
          <span className="brandMark">ME</span>
          <span>Morocco ERP</span>
        </a>
        <div>
          <p className="eyebrow">Accès sécurisé</p>
          <h1 id="auth-title">{mode === 'login' ? 'Connexion à l’espace entreprise' : 'Créer un accès entreprise'}</h1>
          <p className="authIntro">
            Les tableaux de bord internes restent masqués tant qu’une session utilisateur n’est pas simulée ou active.
          </p>
        </div>

        <div className="segmentedControl" role="tablist" aria-label="Mode authentification">
          <button type="button" className={mode === 'login' ? 'selected' : ''} onClick={() => setMode('login')}>Connexion</button>
          <button type="button" className={mode === 'register' ? 'selected' : ''} onClick={() => setMode('register')}>Inscription</button>
        </div>

        <form className="authForm" onSubmit={submit} noValidate>
          {mode === 'register' ? (
            <label>
              <span>Raison sociale</span>
              <input value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" />
            </label>
          ) : null}
          <label>
            <span>E-mail professionnel</span>
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          </label>
          <label>
            <span>Mot de passe</span>
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} />
          </label>
          {error ? <p className="formAlert error" role="alert">{error}</p> : null}
          {message ? <p className="formAlert success" role="status">{message}</p> : null}
          <button type="submit" disabled={!hydrated}>{hydrated ? (mode === 'login' ? 'Se connecter' : 'Créer la session') : 'Préparation...'}</button>
        </form>
      </section>
    </main>
  );
}
