import { useState, useEffect, useCallback } from "react";
import AppShell from "../components/AppShell";
import AppText from "../components/AppText";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SubProfile {
  id: string;
  name: string;
  bulkheadInsertionLoss: number;
  bulkheadReflectance: number;
  spliceLossUnidirectional: number;
  spliceLossBidirectional: number;
  orl: number;
  notes: string;
}

interface CustomerProfile {
  id: string;
  customerName: string;
  subProfiles: SubProfile[];
  createdAt: string;
  updatedAt: string;
}

type SubProfileDraft = Omit<SubProfile, "id">;
type CustomerDraft   = Pick<CustomerProfile, "customerName">;

type SubProfileFormDraft = {
  name: string;
  bulkheadInsertionLoss: string;
  bulkheadReflectance: string;
  spliceLossUnidirectional: string;
  spliceLossBidirectional: string;
  orl: string;
  notes: string;
};

type ModalState =
  | { kind: "none" }
  | { kind: "newCustomer" }
  | { kind: "editCustomer"; customer: CustomerProfile }
  | { kind: "newSubProfile"; customerId: string }
  | { kind: "editSubProfile"; customerId: string; sp: SubProfile };

// ─── Storage ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "fiberref/customers_v2";

async function loadCustomers(): Promise<CustomerProfile[]> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CustomerProfile[]) : [];
  } catch {
    return [];
  }
}

async function saveCustomers(customers: CustomerProfile[]): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseNum(value: string): number {
  const n = parseFloat(value);
  return isNaN(n) ? 0 : n;
}

function nowIso(): string {
  return new Date().toISOString();
}

function emptyCustomerDraft(): CustomerDraft {
  return { customerName: "" };
}

function emptySubProfileFormDraft(): SubProfileFormDraft {
  return {
    name: "", bulkheadInsertionLoss: "0.5", bulkheadReflectance: "-45",
    spliceLossUnidirectional: "0.1", spliceLossBidirectional: "0.1",
    orl: "30", notes: "",
  };
}

function subProfileToFormDraft(sp: SubProfileDraft): SubProfileFormDraft {
  return {
    name: sp.name,
    bulkheadInsertionLoss: String(sp.bulkheadInsertionLoss),
    bulkheadReflectance: String(sp.bulkheadReflectance),
    spliceLossUnidirectional: String(sp.spliceLossUnidirectional),
    spliceLossBidirectional: String(sp.spliceLossBidirectional),
    orl: String(sp.orl),
    notes: sp.notes,
  };
}

function formDraftToSubProfile(fd: SubProfileFormDraft): SubProfileDraft {
  return {
    name: fd.name,
    bulkheadInsertionLoss: parseNum(fd.bulkheadInsertionLoss),
    bulkheadReflectance: parseNum(fd.bulkheadReflectance),
    spliceLossUnidirectional: parseNum(fd.spliceLossUnidirectional),
    spliceLossBidirectional: parseNum(fd.spliceLossBidirectional),
    orl: parseNum(fd.orl),
    notes: fd.notes,
  };
}

// ─── Form primitives ──────────────────────────────────────────────────────────

function FormField({
  label, value, onChangeText, placeholder,
}: {
  label: string; value: string;
  onChangeText: (t: string) => void; placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">{label}</AppText>
      <input
        type="text"
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white text-sm outline-none"
      />
    </div>
  );
}

function DbField({
  label, hint, value, onChangeText,
}: {
  label: string; hint?: string; value: string; onChangeText: (t: string) => void;
}) {
  return (
    <div className="flex flex-row items-center mb-2.5">
      <div className="flex-1 pr-3">
        <AppText size="xs" color="secondary" className="block">{label}</AppText>
        {hint !== undefined && (
          <AppText size="xs" color="muted" className="leading-3 mt-0.5 block">{hint}</AppText>
        )}
      </div>
      <div className="flex flex-row items-center bg-[#111111] border border-[#2A2A2A] rounded-lg px-2 py-1.5">
        <input
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChangeText(e.target.value)}
          onFocus={(e) => e.target.select()}
          className="bg-transparent text-white text-xs w-16 text-right outline-none"
        />
        <AppText size="xs" color="muted" className="ml-1.5">dB</AppText>
      </div>
    </div>
  );
}

// ─── Threshold table ──────────────────────────────────────────────────────────

function ThresholdTable({ sp }: { sp: SubProfile }) {
  const rows: [string, string][] = [
    ["Bulkhead insertion loss", `≤ ${sp.bulkheadInsertionLoss.toFixed(2)} dB`],
    ["Bulkhead reflectance",    `≥ ${sp.bulkheadReflectance.toFixed(1)} dB`],
    ["Splice loss (uni)",       `≤ ${sp.spliceLossUnidirectional.toFixed(2)} dB`],
    ["Splice loss (bi)",        `≤ ${sp.spliceLossBidirectional.toFixed(2)} dB`],
    ["ORL",                     `≥ ${sp.orl.toFixed(1)} dB`],
  ];
  return (
    <div className="mt-1">
      {rows.map(([label, value]) => (
        <div key={label} className="flex flex-row py-1 border-b border-[#1E1E1E]">
          <AppText size="xs" color="muted" className="flex-1">{label}</AppText>
          <AppText size="xs" color="primary" className="font-semibold">{value}</AppText>
        </div>
      ))}
      {sp.notes !== "" && (
        <AppText size="xs" color="muted" className="italic mt-2 leading-4 block">{sp.notes}</AppText>
      )}
    </div>
  );
}

// ─── Sub-profile card ─────────────────────────────────────────────────────────

function SubProfileCard({
  sp, onEdit, onDelete,
}: {
  sp: SubProfile; onEdit: () => void; onDelete: () => void;
}) {
  function confirmDelete() {
    if (window.confirm(`Delete "${sp.name}"?`)) onDelete();
  }
  return (
    <div className="mt-2 bg-[#111111] rounded-lg border border-[#222222] px-3 pt-2 pb-2">
      <div className="flex flex-row items-center mb-1">
        <AppText size="sm" color="accentCyan" className="font-semibold flex-1">{sp.name}</AppText>
        <button type="button" onClick={onEdit} className="mr-4 p-1" aria-label={`Edit ${sp.name}`}>
          <AppText size="xs" color="muted">Edit</AppText>
        </button>
        <button type="button" onClick={confirmDelete} className="p-1" aria-label={`Delete ${sp.name}`}>
          <AppText size="xs" color="danger">Delete</AppText>
        </button>
      </div>
      <ThresholdTable sp={sp} />
    </div>
  );
}

// ─── Customer card ────────────────────────────────────────────────────────────

function CustomerCard({
  customer, onRename, onDelete,
  onAddSubProfile, onEditSubProfile, onDeleteSubProfile,
}: {
  customer: CustomerProfile;
  onRename: () => void;
  onDelete: () => void;
  onAddSubProfile: () => void;
  onEditSubProfile: (sp: SubProfile) => void;
  onDeleteSubProfile: (spId: string) => void;
}) {
  function confirmDelete() {
    if (window.confirm(`Delete "${customer.customerName}" and all threshold profiles? This cannot be undone.`)) {
      onDelete();
    }
  }
  return (
    <div className="mx-3 mb-4 bg-[#1A1A1A] rounded-xl border border-[#2A2A2A] p-4">
      <div className="flex flex-row items-center mb-3">
        <AppText size="md" color="accentCyan" className="font-bold flex-1">{customer.customerName}</AppText>
        <button type="button" onClick={onRename} className="mr-4 p-1" aria-label={`Rename ${customer.customerName}`}>
          <AppText size="xs" color="muted">Rename</AppText>
        </button>
        <button type="button" onClick={confirmDelete} className="p-1" aria-label={`Delete ${customer.customerName}`}>
          <AppText size="xs" color="danger">Delete</AppText>
        </button>
      </div>

      {customer.subProfiles.length === 0 ? (
        <AppText size="xs" color="muted" className="italic block">No threshold profiles yet.</AppText>
      ) : (
        customer.subProfiles.map((sp) => (
          <SubProfileCard
            key={sp.id}
            sp={sp}
            onEdit={() => onEditSubProfile(sp)}
            onDelete={() => onDeleteSubProfile(sp.id)}
          />
        ))
      )}

      <button
        type="button"
        onClick={onAddSubProfile}
        className="mt-3 w-full border border-[#2A2A2A] rounded-lg py-2 flex items-center justify-center"
        aria-label={`Add threshold profile for ${customer.customerName}`}
      >
        <AppText size="xs" color="muted" className="font-semibold">+ Add Threshold Profile</AppText>
      </button>
    </div>
  );
}

// ─── Customer modal ───────────────────────────────────────────────────────────

function CustomerModal({
  visible, initial, onSave, onCancel,
}: {
  visible: boolean; initial: CustomerDraft;
  onSave: (draft: CustomerDraft) => void; onCancel: () => void;
}) {
  const [draft, setDraft] = useState<CustomerDraft>(initial);
  useEffect(() => { setDraft(initial); }, [initial]);

  if (!visible) return null;

  function handleSave() {
    if (!draft.customerName.trim()) {
      window.alert("Customer name is required.");
      return;
    }
    onSave(draft);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-[#0D0D0D] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg">
        <div className="flex flex-row items-center px-4 py-3 border-b border-[#1A1A1A]">
          <button type="button" onClick={onCancel} className="p-2" aria-label="Cancel">
            <AppText size="sm" color="muted">Cancel</AppText>
          </button>
          <AppText size="md" color="primary" className="font-semibold flex-1 text-center">Customer</AppText>
          <button type="button" onClick={handleSave} className="p-2" aria-label="Save customer">
            <AppText size="sm" color="accentCyan" className="font-semibold">Save</AppText>
          </button>
        </div>
        <div className="px-4 pt-4 pb-8">
          <FormField
            label="Customer Name *"
            value={draft.customerName}
            onChangeText={(v) => setDraft({ customerName: v })}
            placeholder="e.g. Acme Corp"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Sub-profile modal ────────────────────────────────────────────────────────

function SubProfileModal({
  visible, initial, onSave, onCancel,
}: {
  visible: boolean; initial: SubProfileFormDraft;
  onSave: (draft: SubProfileDraft) => void; onCancel: () => void;
}) {
  const [draft, setDraft] = useState<SubProfileFormDraft>(initial);
  useEffect(() => { setDraft(initial); }, [initial]);

  if (!visible) return null;

  function set(key: keyof SubProfileFormDraft, value: string) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!draft.name.trim()) {
      window.alert("Profile name is required.");
      return;
    }
    onSave(formDraftToSubProfile(draft));
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end sm:justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-[#0D0D0D] rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex flex-row items-center px-4 py-3 border-b border-[#1A1A1A] flex-shrink-0">
          <button type="button" onClick={onCancel} className="p-2" aria-label="Cancel">
            <AppText size="sm" color="muted">Cancel</AppText>
          </button>
          <AppText size="md" color="primary" className="font-semibold flex-1 text-center">Threshold Profile</AppText>
          <button type="button" onClick={handleSave} className="p-2" aria-label="Save threshold profile">
            <AppText size="sm" color="accentCyan" className="font-semibold">Save</AppText>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-4 pt-4 pb-8">
          <FormField
            label="Profile Name *"
            value={draft.name}
            onChangeText={(v) => set("name", v)}
            placeholder="e.g. Long Haul, Metro, Underground"
          />

          <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-2 mt-1 block">
            Thresholds
          </AppText>

          <DbField label="Bulkhead insertion loss"       hint="max dB per mated pair"             value={draft.bulkheadInsertionLoss}    onChangeText={(v) => set("bulkheadInsertionLoss", v)} />
          <DbField label="Bulkhead reflectance"          hint="min dB — negative value (e.g. -45)" value={draft.bulkheadReflectance}       onChangeText={(v) => set("bulkheadReflectance", v)} />
          <DbField label="Splice loss — unidirectional"  hint="max dB per fusion splice"            value={draft.spliceLossUnidirectional}  onChangeText={(v) => set("spliceLossUnidirectional", v)} />
          <DbField label="Splice loss — bidirectional"   hint="max dB per fusion splice"            value={draft.spliceLossBidirectional}   onChangeText={(v) => set("spliceLossBidirectional", v)} />
          <DbField label="ORL"                           hint="min dB optical return loss"          value={draft.orl}                       onChangeText={(v) => set("orl", v)} />

          <div className="mt-2 mb-3">
            <AppText size="xs" color="muted" className="font-semibold uppercase tracking-wider mb-1 block">Notes</AppText>
            <textarea
              value={draft.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Contract spec reference, scope of work, access notes…"
              rows={3}
              className="w-full bg-[#111111] border border-[#2A2A2A] rounded-lg px-3 py-2 text-white text-sm resize-none outline-none"
              style={{ height: 72 }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
      <AppText size="md" color="muted" className="mb-4" style={{ fontSize: 48 }}>◈</AppText>
      <AppText size="sm" color="muted" className="font-semibold text-center mb-1 block">No profiles yet</AppText>
      <AppText size="xs" color="muted" className="text-center mb-6 leading-4 block">
        Save per-customer threshold templates — bulkhead loss, reflectance, splice loss,
        and ORL — for quick pass/fail reference in the field.
      </AppText>
      <button
        type="button"
        onClick={onAdd}
        className="border border-[#00FFFF] rounded-xl px-5 py-2.5"
      >
        <AppText size="sm" color="accentCyan" className="font-semibold">Create First Profile</AppText>
      </button>
    </div>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ProfilesScreen() {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [modal, setModal]         = useState<ModalState>({ kind: "none" });

  useEffect(() => { loadCustomers().then(setCustomers); }, []);

  const persist = useCallback(async (updated: CustomerProfile[]) => {
    setCustomers(updated);
    await saveCustomers(updated);
  }, []);

  async function handleSaveCustomer(draft: CustomerDraft) {
    if (modal.kind === "editCustomer") {
      await persist(customers.map((c) =>
        c.id === modal.customer.id
          ? { ...c, customerName: draft.customerName, updatedAt: nowIso() }
          : c
      ));
    } else {
      const newCustomer: CustomerProfile = {
        id: crypto.randomUUID(), customerName: draft.customerName,
        subProfiles: [], createdAt: nowIso(), updatedAt: nowIso(),
      };
      await persist([newCustomer, ...customers]);
    }
    setModal({ kind: "none" });
  }

  async function handleDeleteCustomer(customerId: string) {
    await persist(customers.filter((c) => c.id !== customerId));
  }

  async function handleSaveSubProfile(draft: SubProfileDraft) {
    if (modal.kind === "editSubProfile") {
      const { customerId, sp } = modal;
      await persist(customers.map((c) =>
        c.id !== customerId ? c : {
          ...c, updatedAt: nowIso(),
          subProfiles: c.subProfiles.map((s) => s.id === sp.id ? { ...s, ...draft } : s),
        }
      ));
    } else if (modal.kind === "newSubProfile") {
      const { customerId } = modal;
      const newSp: SubProfile = { id: crypto.randomUUID(), ...draft };
      await persist(customers.map((c) =>
        c.id !== customerId ? c : {
          ...c, updatedAt: nowIso(),
          subProfiles: [...c.subProfiles, newSp],
        }
      ));
    }
    setModal({ kind: "none" });
  }

  async function handleDeleteSubProfile(customerId: string, spId: string) {
    await persist(customers.map((c) =>
      c.id !== customerId ? c : {
        ...c, updatedAt: nowIso(),
        subProfiles: c.subProfiles.filter((s) => s.id !== spId),
      }
    ));
  }

  const customerModalVisible    = modal.kind === "newCustomer"   || modal.kind === "editCustomer";
  const subProfileModalVisible  = modal.kind === "newSubProfile" || modal.kind === "editSubProfile";
  const customerDraft           = modal.kind === "editCustomer" ? { customerName: modal.customer.customerName } : emptyCustomerDraft();
  const subProfileFormDraft     = modal.kind === "editSubProfile" ? subProfileToFormDraft(modal.sp) : emptySubProfileFormDraft();

  return (
    <AppShell>
      {/* "+ Add" button — web equivalent of the header right button */}
      <div className="flex justify-end px-3 pt-3">
        <button
          type="button"
          onClick={() => setModal({ kind: "newCustomer" })}
          className="text-[#00FFFF] text-sm font-semibold py-1 px-2"
        >
          + Add
        </button>
      </div>

      {customers.length === 0 ? (
        <EmptyState onAdd={() => setModal({ kind: "newCustomer" })} />
      ) : (
        <div style={{ paddingTop: 4, paddingBottom: 24 }}>
          {customers.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onRename={() => setModal({ kind: "editCustomer", customer })}
              onDelete={() => handleDeleteCustomer(customer.id)}
              onAddSubProfile={() => setModal({ kind: "newSubProfile", customerId: customer.id })}
              onEditSubProfile={(sp) => setModal({ kind: "editSubProfile", customerId: customer.id, sp })}
              onDeleteSubProfile={(spId) => handleDeleteSubProfile(customer.id, spId)}
            />
          ))}
        </div>
      )}

      <CustomerModal
        visible={customerModalVisible}
        initial={customerDraft}
        onSave={handleSaveCustomer}
        onCancel={() => setModal({ kind: "none" })}
      />
      <SubProfileModal
        visible={subProfileModalVisible}
        initial={subProfileFormDraft}
        onSave={handleSaveSubProfile}
        onCancel={() => setModal({ kind: "none" })}
      />
    </AppShell>
  );
}
