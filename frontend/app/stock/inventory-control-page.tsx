'use client';

import { FormEvent, useState } from 'react';
import { ActionToast, DataTable, FormField, SectionHeader, StatusBadge, ToastState, WorkspacePanel, formatMad } from '../components/workspace-components';
import { WorkspaceLayout } from '../layouts/workspace-layout';

const initialMoves = [
  ['MVT-2026-351', 'Casa principal', 'SKU-CHAIR', '+12', 'CUMP 820 MAD', 'Réception validée'],
  ['MVT-2026-350', 'Rabat dépôt', 'SKU-TABLE', '-4', 'CUMP 1 400 MAD', 'BL livré'],
  ['MVT-2026-349', 'Tanger transit', 'SKU-PACK', '+30', 'CUMP 95 MAD', 'Contrôle qualité'],
];

export function InventoryControlPage() {
  const [moves, setMoves] = useState(initialMoves);
  const [warehouse, setWarehouse] = useState('Casa principal');
  const [sku, setSku] = useState('SKU-LAMP');
  const [quantity, setQuantity] = useState('8');
  const [unitCost, setUnitCost] = useState('320');
  const [toast, setToast] = useState<ToastState>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const qty = Number(quantity);
    const cost = Number(unitCost);
    if (!sku.startsWith('SKU-')) {
      setToast({ tone: 'error', message: 'SKU invalide: utilisez la nomenclature SKU- pour les mouvements stock.' });
      return;
    }
    if (!Number.isFinite(qty) || qty === 0) {
      setToast({ tone: 'error', message: 'Quantité mouvement invalide.' });
      return;
    }
    if (!Number.isFinite(cost) || cost <= 0) {
      setToast({ tone: 'error', message: 'Coût unitaire requis pour recalcul CUMP.' });
      return;
    }
    const number = `MVT-2026-${351 + moves.length}`;
    setMoves((current) => [[number, warehouse, sku, qty > 0 ? `+${qty}` : String(qty), `CUMP ${formatMad(cost)}`, 'Audit stock prêt'], ...current]);
    setToast({ tone: 'success', message: `${number} enregistré avec valorisation CUMP et lien comptable.` });
  };

  return (
    <WorkspaceLayout activeModule="Stock">
      <SectionHeader
        eyebrow="Achats et stock"
        title="Mouvements, dépôts et valorisation CUMP"
        description="Suivi des réceptions, livraisons, transferts, ajustements et inventaires avec audit comptable."
        action={<StatusBadge tone="info">3 dépôts actifs</StatusBadge>}
      />
      <div className="workspaceGrid two">
        <WorkspacePanel title="Nouveau mouvement" description="Validation SKU, quantité et coût CUMP.">
          <form className="domainForm" onSubmit={submit} noValidate>
            <FormField label="Dépôt"><select value={warehouse} onChange={(event) => setWarehouse(event.target.value)}><option>Casa principal</option><option>Rabat dépôt</option><option>Tanger transit</option></select></FormField>
            <FormField label="SKU"><input value={sku} onChange={(event) => setSku(event.target.value)} /></FormField>
            <FormField label="Quantité"><input inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></FormField>
            <FormField label="Coût unitaire MAD"><input inputMode="decimal" value={unitCost} onChange={(event) => setUnitCost(event.target.value)} /></FormField>
            <button type="submit">Enregistrer mouvement</button>
            <ActionToast toast={toast} />
          </form>
        </WorkspacePanel>
        <WorkspacePanel title="Contrôles stock" description="Réservations et écarts surveillés.">
          <div className="checkList">
            <span>Réservations liées aux commandes clients</span>
            <span>Écart inventaire soumis à approbation manager</span>
            <span>Écriture stock annulée si comptabilisation échoue</span>
          </div>
        </WorkspacePanel>
      </div>
      <WorkspacePanel title="Mouvements stock">
        <DataTable columns={['Mouvement', 'Dépôt', 'SKU', 'Quantité', 'Valorisation', 'Statut']} rows={moves} />
      </WorkspacePanel>
    </WorkspaceLayout>
  );
}
