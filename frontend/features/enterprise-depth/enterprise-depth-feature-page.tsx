import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { getEnterpriseDepthReadiness, type EnterpriseDepthReadiness } from '../../lib/api';
import {
  enterpriseDepthFeatureByKey,
  enterpriseDepthFeatureDefinitions,
  type EnterpriseDepthFeatureKey,
  type EnterpriseDepthMetric,
} from './enterprise-depth-feature-config';

type EnterpriseDepthFeaturePageProps = {
  data: EnterpriseDepthReadiness;
  featureKey: EnterpriseDepthFeatureKey;
};

export function makeEnterpriseDepthServerSideProps(featureKey: EnterpriseDepthFeatureKey): GetServerSideProps<EnterpriseDepthFeaturePageProps> {
  return async () => ({
    props: {
      data: await getEnterpriseDepthReadiness(),
      featureKey,
    },
  });
}

export function EnterpriseDepthFeaturePage({ data, featureKey }: EnterpriseDepthFeaturePageProps) {
  const definition = enterpriseDepthFeatureByKey[featureKey];
  const featureData = data[featureKey] ?? {};

  return (
    <>
      <Head>
        <title>{`${definition.title} | Morocco ERP`}</title>
      </Head>
      <main className="shell featureShell">
        <aside className="sidebar">
          <div className="brand">
            <span className="brandMark">ME</span>
            <div>
              <strong>Morocco ERP</strong>
              <small>Pages métier dédiées</small>
            </div>
          </div>
          <nav aria-label="Fonctionnalités profondeur entreprise">
            {enterpriseDepthFeatureDefinitions.map((feature) => (
              <a key={feature.key} className={feature.key === featureKey ? 'active' : ''} href={feature.route}>
                {feature.title}
              </a>
            ))}
          </nav>
        </aside>

        <section className="workspace">
          <header className="topbar">
            <div>
              <p className="eyebrow">{definition.domain}</p>
              <h1>{definition.title}</h1>
              <p className="identity">{definition.description}</p>
            </div>
            <div className="status">
              <span>Tenant Maroc</span>
              <strong>Contrôle actif</strong>
            </div>
          </header>

          <section className="panel">
            <div className="reportGrid">
              {definition.metrics.map((metric) => (
                <Metric key={metric.label} label={metric.label} value={formatMetric(featureData, metric)} />
              ))}
            </div>
          </section>

          <section className="gridTwo">
            <div className="panel">
              <PanelHeader title="Contrôles métier" action="Ouvrir workflow" />
              <ul className="checks">
                {definition.controls.map((control) => <li key={control}>{control}</li>)}
              </ul>
            </div>
            <div className="panel">
              <PanelHeader title="Données opérationnelles" action="Exporter JSON" />
              <DataTable
                columns={['Champ', 'Valeur']}
                rows={definition.metrics.map((metric) => [metric.label, formatMetric(featureData, metric)])}
              />
            </div>
          </section>

          <section className="panel">
            <PanelHeader title="Navigation dédiée" action="Retour tableau de bord" />
            <div className="featureLinks">
              <a href="/">Tableau de bord</a>
              {enterpriseDepthFeatureDefinitions
                .filter((feature) => feature.domain === definition.domain && feature.key !== featureKey)
                .slice(0, 6)
                .map((feature) => <a key={feature.key} href={feature.route}>{feature.title}</a>)}
            </div>
          </section>
        </section>
      </main>
    </>
  );
}

function PanelHeader({ title, action }: { title: string; action: string }) {
  return (
    <div className="panelHeader">
      <h2>{title}</h2>
      <button type="button">{action}</button>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function DataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="tableScroll">
      <table>
        <thead>
          <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join(':')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatMetric(source: unknown, metric: EnterpriseDepthMetric): string {
  const value = readPath(source, metric.path);
  if (metric.format === 'count') return String(Array.isArray(value) ? value.length : Number(value ?? 0));
  if (metric.format === 'boolean') return value ? 'Oui' : 'Non';
  if (metric.format === 'money') return formatMad(Number(value ?? 0));
  if (Array.isArray(value)) return String(value.length);
  if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') return value.length > 36 ? `${value.slice(0, 36)}...` : value;
  if (value && typeof value === 'object') return 'Disponible';
  return 'A renseigner';
}

function readPath(source: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((current, segment) => {
    if (current == null) return undefined;
    if (Array.isArray(current)) return current[Number(segment)];
    if (typeof current === 'object') return (current as Record<string, unknown>)[segment];
    return undefined;
  }, source);
}

function formatMad(value: number): string {
  return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(value);
}
