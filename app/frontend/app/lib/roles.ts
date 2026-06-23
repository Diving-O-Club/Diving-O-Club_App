// Display labels for role codes. `code_role` is the technical identifier stored
// in the database; the French label lives here on the front (single source of
// truth), since the `label_role` column was removed from the schema.
export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Administrateur',
  committee: 'Comité',
  instructor: 'Moniteur',
  member: 'Adhérent',
};
