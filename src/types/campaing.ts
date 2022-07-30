
export interface NarrativeChange {
  tag: string;
  values: string[];
}

export interface HasDeath {
  message: string;
}

export interface HasNoDeath {
  message: string;
}

export interface Results {
  hasDeath: HasDeath;
  hasNoDeath: HasNoDeath;
}

export interface Investigation {
  id: number;
  name: string;
  risk: number;
  results: Results;
  selected?: boolean;
}

export interface TypeCampaing {
  id: number;
  name: string;
  year: number;
  narrative: string;
  url_image: string;
  narrative_changes: NarrativeChange[];
  suspects_actions: string[];
  reasons: string[];
  investigations: Investigation[];
  created_at: string;
  updated_at: string;
}

export interface TypeSuspect {
  who: any;
  details: any;
}