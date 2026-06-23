import { Trash2, X } from 'lucide-react';
import { type DashboardEvent } from '@/app/lib/api/events';

type Props = {
  event: DashboardEvent | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading: boolean;
};

export default function EventDeleteModal({ event, onConfirm, onCancel, loading }: Props) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">

        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-500" />
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 className="text-lg font-bold text-[#0d3b66] mb-1">
          Supprimer l&apos;événement
        </h2>
        <p className="text-sm text-gray-400 mb-6">
          Vous êtes sur le point de supprimer <span className="font-medium text-gray-600">&quot;{event.title}&quot;</span>. Cette action est irréversible.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>

      </div>
    </div>
  );
}