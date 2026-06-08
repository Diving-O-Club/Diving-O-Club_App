import { useState } from 'react';
import { type CreateEventPayload } from '@/app/lib/api/events';

const EVENT_TYPES = [
  { value: 'dive_trip',    label: 'Sortie plongée' },
  { value: 'training',     label: 'Formation' },
  { value: 'initiation',   label: 'Baptême' },
  { value: 'pool_session', label: 'Séance piscine' },
  { value: 'social',       label: 'Événement social' },
];

type Props = {
  initialValues?: Partial<CreateEventPayload>;
  onSubmit: (payload: CreateEventPayload) => void;
  loading: boolean;
  error: string | null;
  submitLabel: string;
};

export default function EventForm({
  initialValues,
  onSubmit,
  loading,
  error,
  submitLabel,
}: Props) {
  const [form, setForm] = useState<CreateEventPayload>({
    title: initialValues?.title ?? '',
    description: initialValues?.description ?? '',
    eventType: initialValues?.eventType ?? 'dive_trip',
    startDatetime: initialValues?.startDatetime ?? '',
    endDatetime: initialValues?.endDatetime ?? '',
    location: initialValues?.location ?? '',
    minimumLevel: initialValues?.minimumLevel ?? '',
    maxCapacity: initialValues?.maxCapacity ?? undefined,
    isPaid: initialValues?.isPaid ?? false,
    price: initialValues?.price ?? undefined,
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'number'
        ? value === '' ? undefined : parseFloat(value)
        : value,
    }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({
      ...prev,
      isPaid: e.target.checked,
      price: e.target.checked ? prev.price : undefined,
    }));
  };

  const validate = (): boolean => {
    if (!form.title.trim()) {
      setFormError('Le titre est requis');
      return false;
    }
    if (!form.startDatetime) {
      setFormError('La date de début est requise');
      return false;
    }
    if (!form.endDatetime) {
      setFormError('La date de fin est requise');
      return false;
    }
    if (new Date(form.endDatetime) <= new Date(form.startDatetime)) {
      setFormError('La date de fin doit être après la date de début');
      return false;
    }
    if (form.isPaid && !form.price) {
      setFormError('Le prix est requis pour un événement payant');
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
          {formError || error}
        </div>
      )}

      {/* Titre */}
      <div>
        <label className="block text-sm font-medium text-[#0d3b66] mb-1">
          Titre *
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Ex : Sortie lac de Nantua"
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
        />
      </div>

      {/* Type */}
      <div>
        <label className="block text-sm font-medium text-[#0d3b66] mb-1">
          Type d'événement *
        </label>
        <select
          name="eventType"
          value={form.eventType}
          onChange={handleChange}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
        >
          {EVENT_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-[#0d3b66] mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          placeholder="Décrivez l'événement..."
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66] resize-none"
        />
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0d3b66] mb-1">
            Date de début *
          </label>
          <input
            type="datetime-local"
            name="startDatetime"
            value={form.startDatetime}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0d3b66] mb-1">
            Date de fin *
          </label>
          <input
            type="datetime-local"
            name="endDatetime"
            value={form.endDatetime}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
          />
        </div>
      </div>

      {/* Lieu + Capacité */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#0d3b66] mb-1">
            Lieu
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Ex : Lac de Nantua"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#0d3b66] mb-1">
            Capacité max
          </label>
          <input
            type="number"
            name="maxCapacity"
            value={form.maxCapacity ?? ''}
            onChange={handleChange}
            min={1}
            placeholder="Ex : 12"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
          />
        </div>
      </div>

      {/* Payant */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="isPaid"
          checked={form.isPaid}
          onChange={handleCheckbox}
          className="w-4 h-4 accent-[#0d3b66]"
        />
        <label htmlFor="isPaid" className="text-sm font-medium text-[#0d3b66]">
          Événement payant
        </label>
      </div>

      {form.isPaid && (
        <div>
          <label className="block text-sm font-medium text-[#0d3b66] mb-1">
            Prix (€) *
          </label>
          <input
            type="number"
            name="price"
            value={form.price ?? ''}
            onChange={handleChange}
            min={0}
            step={0.01}
            placeholder="Ex : 25"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0d3b66]"
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-linear-to-r from-[#0d3b66] to-[#006994] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Enregistrement...' : submitLabel}
      </button>

    </form>
  );
}