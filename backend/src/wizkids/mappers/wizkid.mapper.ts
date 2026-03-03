import { WizkidRole } from '../wizkid-role.enum';

export type WizkidPublicView = {
  id: string;
  name: string;
  role: WizkidRole;
  profilePicture?: string;
  firedAt?: Date | null;
};

export type WizkidPrivateView = WizkidPublicView & {
  email: string;
  phone?: string;
};

export function toPublicView(wizkid: any) {
  // we hide the email and phone fields in the public view
  return {
    id: wizkid._id?.toString?.() ?? wizkid.id,
    name: wizkid.name,
    role: wizkid.role,
    profilePicture: wizkid.profilePicture ?? null,
    firedAt: wizkid.firedAt ?? null,
    createdAt: wizkid.createdAt,
    updatedAt: wizkid.updatedAt,
  };
}

export function toPrivateView(wizkid: any) {
  // we include the email and phone fields in the private view
  return {
    id: wizkid._id?.toString?.() ?? wizkid.id,
    name: wizkid.name,
    role: wizkid.role,
    email: wizkid.email,
    phone: wizkid.phone ?? null,
    profilePicture: wizkid.profilePicture ?? null,
    firedAt: wizkid.firedAt ?? null,
    createdAt: wizkid.createdAt,
    updatedAt: wizkid.updatedAt,
  };
}
