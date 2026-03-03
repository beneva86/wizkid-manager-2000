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

export function toPublicView(doc: any): WizkidPublicView {
  return {
    id: String(doc._id),
    name: doc.name,
    role: doc.role,
    profilePicture: doc.profilePicture ?? null,
    firedAt: doc.firedAt ?? null,
  };
}

export function toPrivateView(doc: any): WizkidPrivateView {
  return {
    ...toPublicView(doc),
    email: doc.email,
    phone: doc.phone,
  };
}
