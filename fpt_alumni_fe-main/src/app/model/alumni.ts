export interface Alumni {
  id: string;
  mainEmail: string;
  password: string | null;
  roleId: string;
  roleName: string;
  avartar: string;
  studentCode: string;
  phoneNumber: string;
  class: string;
  major: string;
  isGraduated: boolean;
  job: string;
  company: string;
  linkedUrl: string;
  fullName: string;
  dateOfBirth: string;
  graduationYear: string;
  gender: number;
  country: string;
  city: string;
  userId: string;
  workExperiences: WorkExperience[];
  educationExperiences: EducationExperience[];
  privacySetting: {
      emailPublic: boolean | null;
      phonePublic: boolean | null;
  };
  status: string;
  fields: any; // You can specify the type for 'fields' if needed
}

export interface WorkExperience {
  company: string | null;
  position: string | null;
  startDate: string | null;
  endDate: string | null;
}

export interface EducationExperience {
  institution: string | null;
  major: string | null;
  startDate: string | null;
  endDate: string | null;
}
