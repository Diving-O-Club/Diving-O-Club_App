export enum DivingLevel {
  // young divers
  BRONZE = 'BRONZE',
  ARGENT = 'ARGENT',
  OR_12 = 'OR_12',
  OR_20 = 'OR_20',
  // guided / autonomous divers
  PE_12 = 'PE_12',
  N1 = 'N1',
  PA_12 = 'PA_12',
  PA_20 = 'PA_20',
  PE_40 = 'PE_40',
  N2 = 'N2',
  PE_60 = 'PE_60',
  PA_40 = 'PA_40',
  N3 = 'N3',
}

export enum InstructorLevel {
  N4 = 'N4',   // Dive Team Leader
  E1 = 'E1',   // Initiator
  E2 = 'E2',   // Initiator + Dive Team Leader
  MF1 = 'MF1', // Federal Instructor 1st Level
  MF2 = 'MF2', // Federal Instructor 2nd Level
  N5 = 'N5',   // Dive Director (Exploration)
}

export const DIVING_LEVEL_LABELS: Record<DivingLevel, string> = {
  [DivingLevel.BRONZE]: 'Plongeur Bronze',
  [DivingLevel.ARGENT]: 'Plongeur Argent',
  [DivingLevel.OR_12]: 'Plongeur Or 12m',
  [DivingLevel.OR_20]: 'Plongeur Or 20m',
  [DivingLevel.PE_12]: 'PE-12 - Plongeur Encadré 12m',
  [DivingLevel.N1]: 'N1 - Plongeur Encadré 20m',
  [DivingLevel.PA_12]: 'PA-12 - Plongeur Autonome 12m',
  [DivingLevel.PA_20]: 'PA-20 - Plongeur Autonome 20m',
  [DivingLevel.PE_40]: 'PE-40 - Plongeur Encadré 40m',
  [DivingLevel.N2]: 'N2 - Autonome 20m + Encadré 40m',
  [DivingLevel.PE_60]: 'PE-60 - Plongeur Encadré 60m',
  [DivingLevel.PA_40]: 'PA-40 - Plongeur Autonome 40m',
  [DivingLevel.N3]: 'N3 - Plongeur Autonome 60m',
}

export const INSTRUCTOR_LEVEL_LABELS: Record<InstructorLevel, string> = {
  [InstructorLevel.N4]: 'N4 - Guide de Palanquée',
  [InstructorLevel.E1]: 'E1 - Initiateur',
  [InstructorLevel.E2]: 'E2 - Initiateur + Guide de Palanquée',
  [InstructorLevel.MF1]: 'MF1 - Moniteur Fédéral 1er degré',
  [InstructorLevel.MF2]: 'MF2 - Moniteur Fédéral 2ème degré',
  [InstructorLevel.N5]: 'N5 - Directeur de Plongée Exploration',
}