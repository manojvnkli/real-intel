import type { Agency, AgencyMember, CreateAgencyInput, AgencyRole } from '@/lib/types';
import { mockAgency } from '@/lib/mock/agencies';

export interface AgencyService {
  getAgency(): Promise<Agency | null>;
  createAgency(data: CreateAgencyInput): Promise<Agency>;
  updateAgency(id: string, data: Partial<CreateAgencyInput>): Promise<Agency>;
  inviteMember(agencyId: string, email: string, role: AgencyRole): Promise<AgencyMember>;
  removeMember(agencyId: string, memberId: string): Promise<void>;
  updateMemberRole(agencyId: string, memberId: string, role: AgencyRole): Promise<AgencyMember>;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class MockAgencyService implements AgencyService {
  private agency: Agency | null = mockAgency;

  async getAgency(): Promise<Agency | null> {
    await delay(400);
    return this.agency ? { ...this.agency } : null;
  }

  async createAgency(data: CreateAgencyInput): Promise<Agency> {
    await delay(700);
    this.agency = {
      id: `agency-${Date.now()}`,
      name: data.name,
      description: data.description,
      phone: data.phone,
      email: data.email,
      website: data.website,
      city: data.city,
      ownerId: 'user-1',
      members: [
        {
          id: `mem-${Date.now()}`,
          userId: 'user-1',
          fullName: 'Manoj Sharma',
          email: 'demo@realestate.com',
          phone: '+91 98765 43210',
          role: 'Owner',
          avatarUrl: 'https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
          joinedAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    return { ...this.agency };
  }

  async updateAgency(id: string, data: Partial<CreateAgencyInput>): Promise<Agency> {
    await delay(500);
    if (!this.agency || this.agency.id !== id) throw new Error('Agency not found');
    this.agency = { ...this.agency, ...data };
    return { ...this.agency };
  }

  async inviteMember(agencyId: string, email: string, role: AgencyRole): Promise<AgencyMember> {
    await delay(600);
    if (!this.agency || this.agency.id !== agencyId) throw new Error('Agency not found');
    const member: AgencyMember = {
      id: `mem-${Date.now()}`,
      userId: `user-${Date.now()}`,
      fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      email,
      phone: '',
      role,
      joinedAt: new Date().toISOString(),
    };
    this.agency.members.push(member);
    return member;
  }

  async removeMember(agencyId: string, memberId: string): Promise<void> {
    await delay(400);
    if (!this.agency || this.agency.id !== agencyId) throw new Error('Agency not found');
    this.agency.members = this.agency.members.filter((m) => m.id !== memberId);
  }

  async updateMemberRole(agencyId: string, memberId: string, role: AgencyRole): Promise<AgencyMember> {
    await delay(400);
    if (!this.agency || this.agency.id !== agencyId) throw new Error('Agency not found');
    const member = this.agency.members.find((m) => m.id === memberId);
    if (!member) throw new Error('Member not found');
    member.role = role;
    return { ...member };
  }
}

export const agencyService: AgencyService = new MockAgencyService();
