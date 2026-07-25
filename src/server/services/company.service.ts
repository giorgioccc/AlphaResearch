import { companyRepository } from '@/server/repositories/company.repository';

export const companyService = {
  async search(query: string) {
    return companyRepository.search(query);
  },

  async getById(id: string) {
    return companyRepository.findById(id);
  },
};
